package com.smartcampus.booking.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.booking.dto.BookingCreateDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.security.roles.Role;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;

// Removed jakarta.persistence.EntityNotFoundException

@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final BookingConflictService conflictService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    
    public BookingService(BookingRepository bookingRepository, 
                          BookingConflictService conflictService,
                          NotificationService notificationService,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.conflictService = conflictService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }
    
    // ========== USER OPERATIONS ==========
    
    /**
     * Create a new booking request
     */
    public BookingResponseDTO createBooking(BookingCreateDTO dto, String userId) {
        // Validate time range
        if (!conflictService.isValidTimeRange(dto.getStartTime(), dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        
        // Validate duration (minimum 15 minutes)
        if (!conflictService.isValidDuration(dto.getStartTime(), dto.getEndTime())) {
            throw new IllegalArgumentException("Booking must be at least 15 minutes long");
        }
        
        // Validate not in past
        if (!conflictService.isNotPastTime(dto.getStartTime())) {
            throw new IllegalArgumentException("Cannot book in the past");
        }
        
        // Check for conflicts
        if (conflictService.hasConflict(dto.getResourceId(), dto.getStartTime(), dto.getEndTime())) {
            throw new IllegalStateException("Booking conflicts with existing booking");
        }
        
        // Create booking
        Booking booking = new Booking(
            dto.getResourceId(),
            userId,
            dto.getStartTime(),
            dto.getEndTime(),
            dto.getPurpose(),
            dto.getAttendees()
        );
        
        Booking saved = bookingRepository.save(booking);

        try {
            Optional<User> adminOpt = userRepository.findFirstByRole(Role.ADMIN);

            if (adminOpt.isPresent()) {
                notificationService.createNotification(
                    adminOpt.get().getId(),
                    NotificationType.BOOKING_CREATED,
                    "A new booking has been created",
                    saved.getId()
                );
            } else {
                System.out.println("⚠️ Admin not found");
            }

        } catch (Exception e) {
            System.out.println("⚠️ Notification failed: " + e.getMessage());
        }

        return BookingResponseDTO.fromEntity(saved);
    }
    
    /**
     * Get all bookings for the current user
     */
    public List<BookingResponseDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByStartTimeDesc(userId)
            .stream()
            .map(BookingResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get a single booking for the current user (with ownership check)
     */
    public BookingResponseDTO getUserBookingById(String bookingId, String userId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
            .orElseThrow(() -> new RuntimeException("Booking not found or not owned by user"));
        return BookingResponseDTO.fromEntity(booking);
    }
    
    /**
     * Cancel a booking (only if it's PENDING or APPROVED)
     */
    public BookingResponseDTO cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
            .orElseThrow(() -> new RuntimeException("Booking not found or not owned by user"));
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }
        
        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new IllegalStateException("Cannot cancel a rejected booking");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(updated);
    }
    
    // ========== ADMIN OPERATIONS ==========
    
    /**
     * Get all bookings (admin)
     */
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(BookingResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get bookings by status (admin)
     */
    public List<BookingResponseDTO> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
            .stream()
            .map(BookingResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get pending bookings (admin convenience method)
     */
    public List<BookingResponseDTO> getPendingBookings() {
        return getBookingsByStatus(BookingStatus.PENDING);
    }
    
    /**
     * Approve a booking
     */
    public BookingResponseDTO approveBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved");
        }
        
        // Double-check conflict before approving
        if (conflictService.hasConflictExcludingId(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime(), 
                booking.getId())) {
            throw new IllegalStateException("Cannot approve: Booking conflicts with another booking");
        }
        
        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        Booking updated = bookingRepository.save(booking);
        
        notificationService.createNotification(
            booking.getUserId(),   // IMPORTANT
            NotificationType.BOOKING_APPROVED,
            "Your booking #" + bookingId + " has been approved",
            bookingId
        );

        
        return BookingResponseDTO.fromEntity(updated);
    }
    
    /**
     * Reject a booking with a reason
     */
    public BookingResponseDTO rejectBooking(String bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }
        
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        Booking updated = bookingRepository.save(booking);


        notificationService.createNotification(
            booking.getUserId(),   
            NotificationType.BOOKING_REJECTED,
            "Your booking #" + bookingId + " was rejected: " + reason,
            bookingId
        );

        
        return BookingResponseDTO.fromEntity(updated);
    }
    
    /**
     * Get a single booking by ID (admin)
     */
    public BookingResponseDTO getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        return BookingResponseDTO.fromEntity(booking);
    }

    /**
     * Delete a booking (admin)
     */
    public void deleteBooking(String bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(bookingId);
    }
}
