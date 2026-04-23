package com.smartcampus.booking.service;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingConflictService {
    
    private final BookingRepository bookingRepository;
    
    public BookingConflictService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }
    
    /**
     * Check if a booking conflicts with existing approved/pending bookings
     */
    public boolean hasConflict(Long resourceId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> conflicting = bookingRepository.findConflictingBookings(
            resourceId, startTime, endTime
        );
        return !conflicting.isEmpty();
    }
    
    /**
     * Check if a booking conflicts (excluding a specific booking ID for updates)
     */
    public boolean hasConflictExcludingId(Long resourceId, LocalDateTime startTime, 
                                          LocalDateTime endTime, Long excludeId) {
        List<Booking> conflicting = bookingRepository.findConflictingBookingsExcludingId(
            resourceId, startTime, endTime, excludeId
        );
        return !conflicting.isEmpty();
    }
    
    /**
     * Get all conflicting bookings for a given time slot
     */
    public List<Booking> getConflictingBookings(Long resourceId, LocalDateTime startTime, 
                                                 LocalDateTime endTime) {
        return bookingRepository.findConflictingBookings(resourceId, startTime, endTime);
    }
    
    /**
     * Validate that start time is before end time
     */
    public boolean isValidTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return startTime != null && endTime != null && startTime.isBefore(endTime);
    }
    
    /**
     * Validate that booking is at least 15 minutes long
     */
    public boolean isValidDuration(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) return false;
        long minutes = java.time.Duration.between(startTime, endTime).toMinutes();
        return minutes >= 15;
    }
    
    /**
     * Validate that booking is not in the past
     */
    public boolean isNotPastTime(LocalDateTime startTime) {
        return startTime != null && startTime.isAfter(LocalDateTime.now());
    }
}