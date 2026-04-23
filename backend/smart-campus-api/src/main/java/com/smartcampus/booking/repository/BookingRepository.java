package com.smartcampus.booking.repository;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by user (for My Bookings page)
    List<Booking> findByUserIdOrderByStartTimeDesc(Long userId);
    
    // Find all bookings ordered by creation (for admin)
    List<Booking> findAllByOrderByCreatedAtDesc();
    
    // Find bookings by status (for admin filtering)
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);
    
    // Find pending bookings (convenience method)
    List<Booking> findByStatus(BookingStatus status);
    
    // Find booking by id and user (for ownership check)
    Optional<Booking> findByIdAndUserId(Long id, Long userId);
    
    //  CRITICAL: Check for overlapping bookings (conflict detection)
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status IN ('APPROVED', 'PENDING') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    // Check for overlapping excluding a specific booking (for updates)
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status IN ('APPROVED', 'PENDING') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime " +
           "AND b.id != :excludeId")
    List<Booking> findConflictingBookingsExcludingId(
        @Param("resourceId") Long resourceId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeId") Long excludeId
    );
}