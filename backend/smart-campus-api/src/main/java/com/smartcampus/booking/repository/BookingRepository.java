package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Find bookings by user (for My Bookings page)
    List<Booking> findByUserIdOrderByStartTimeDesc(String userId);
    
    // Find all bookings ordered by creation (for admin)
    List<Booking> findAllByOrderByCreatedAtDesc();
    
    // Find bookings by status (for admin filtering)
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);
    
    // Find pending bookings (convenience method)
    List<Booking> findByStatus(BookingStatus status);
    
    // Find booking by id and user (for ownership check)
    Optional<Booking> findByIdAndUserId(String id, String userId);
    
    //  CRITICAL: Check for overlapping bookings (conflict detection)
    @Query("{ 'resourceId': ?0, 'status': { $in: ['APPROVED', 'PENDING'] }, 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findConflictingBookings(
        String resourceId,
        LocalDateTime startTime,
        LocalDateTime endTime
    );
    
    // Check for overlapping excluding a specific booking (for updates)
    @Query("{ 'resourceId': ?0, 'status': { $in: ['APPROVED', 'PENDING'] }, 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 }, '_id': { $ne: ?3 } }")
    List<Booking> findConflictingBookingsExcludingId(
        String resourceId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String excludeId
    );

    // Find all active bookings for a resource in a time range (for availability)
    @Query("{ 'resourceId': ?0, 'status': { $in: ['APPROVED', 'PENDING'] }, 'startTime': { $gte: ?1, $lt: ?2 } }")
    List<Booking> findResourceBookingsForDay(String resourceId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}