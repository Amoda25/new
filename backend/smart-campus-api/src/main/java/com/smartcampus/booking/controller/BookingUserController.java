package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingCreateDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.service.BookingService;
import com.smartcampus.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class BookingUserController {
    
    private final BookingService bookingService;
    private final UserRepository userRepository;
    
    public BookingUserController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }
    
    @PostConstruct
    public void init() {
        System.out.println("DEBUG: BookingUserController loaded with ID-based authentication.");
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingCreateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        System.out.println("DEBUG: Create booking request received for resource: " + dto.getResourceId());
        
        try {
            String userId = extractUserId(userDetails);
            System.out.println("DEBUG: Authenticated User ID: " + userId);
            
            BookingResponseDTO created = bookingService.createBooking(dto, userId);
            System.out.println("DEBUG: Booking created successfully. ID: " + created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            System.err.println("ERROR: Booking creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR: Unexpected booking error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/availability")
    public ResponseEntity<List<BookingResponseDTO>> getAvailability(
            @RequestParam String resourceId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        
        List<BookingResponseDTO> bookings = bookingService.getResourceBookingsForDay(resourceId, date);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        BookingResponseDTO booking = bookingService.getUserBookingById(id, userId);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        BookingResponseDTO cancelled = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(cancelled);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        bookingService.deleteUserBooking(id, userId);
        return ResponseEntity.ok("Booking deleted successfully");
    }
    
    private String extractUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        // Since JwtAuthenticationFilter sets the userId as the username
        return userDetails.getUsername();
    }

}
