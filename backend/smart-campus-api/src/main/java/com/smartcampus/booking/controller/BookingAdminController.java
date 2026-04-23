package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingDecisionDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.model.BookingStatus;
import com.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class BookingAdminController {
    
    private final BookingService bookingService;
    
    public BookingAdminController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) String status) {
        
        if (status != null && !status.isEmpty()) {
            try {
                BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                return ResponseEntity.ok(bookingService.getBookingsByStatus(bookingStatus));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.ok(bookingService.getAllBookings());
            }
        }
        
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    @GetMapping("/bookings/pending")
    public ResponseEntity<List<BookingResponseDTO>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }
    
    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(@PathVariable Long id) {
        BookingResponseDTO approved = bookingService.approveBooking(id);
        return ResponseEntity.ok(approved);
    }
    
    @PutMapping("/bookings/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDecisionDTO decision) {
        
        BookingResponseDTO rejected = bookingService.rejectBooking(id, decision.getReason());
        return ResponseEntity.ok(rejected);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}