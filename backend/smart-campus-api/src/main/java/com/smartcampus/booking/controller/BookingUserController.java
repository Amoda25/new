package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingCreateDTO;
import com.smartcampus.booking.dto.BookingResponseDTO;
import com.smartcampus.booking.service.BookingService;
import com.smartcampus.user.repository.UserRepository;
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
    
    @PostMapping("/bookings")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingCreateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        BookingResponseDTO created = bookingService.createBooking(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        BookingResponseDTO booking = bookingService.getUserBookingById(id, userId);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = extractUserId(userDetails);
        BookingResponseDTO cancelled = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(cancelled);
    }
    
    private Long extractUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        String username = userDetails.getUsername();
        
        try {
            return Long.parseLong(username);
        } catch (NumberFormatException e) {
            return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
        }
    }
}