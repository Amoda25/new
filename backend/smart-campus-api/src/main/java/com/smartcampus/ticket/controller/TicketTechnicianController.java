package com.smartcampus.ticket.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;

import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.dto.TicketResolutionDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;
import com.smartcampus.ticket.dto.TicketStatusUpdateDTO;
import com.smartcampus.ticket.service.TicketImageService;
import com.smartcampus.ticket.service.TicketService;

import com.smartcampus.user.repository.UserRepository;

@RestController
@RequestMapping("/api/technician/tickets")
@PreAuthorize("hasRole('TECHNICIAN')")
public class TicketTechnicianController {

    private final TicketService ticketService;
    private final TicketImageService ticketImageService;
    private final UserRepository userRepository;

    public TicketTechnicianController(TicketService ticketService, 
                                     TicketImageService ticketImageService,
                                     UserRepository userRepository) {
        this.ticketService = ticketService;
        this.ticketImageService = ticketImageService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAssignedTickets(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String technicianId = extractUserId(userDetails);
        System.out.println("Technician ID: " + technicianId + " is viewing assigned tickets");
        
        return ResponseEntity.ok(ticketService.getAssignedTickets(technicianId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateTicketStatus(
            @PathVariable @NonNull String id,
            @RequestBody TicketStatusUpdateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String technicianId = extractUserId(userDetails);
        System.out.println("Technician ID: " + technicianId + " is updating ticket " + id + " status to " + dto.getStatus());
        
        ticketService.updateTicketStatus(id, dto.getStatus(), technicianId);
        return ResponseEntity.ok("Ticket status updated successfully");
    }

    @PutMapping("/{id}/resolution")
    public ResponseEntity<String> updateResolution(
            @PathVariable @NonNull String id,
            @RequestBody TicketResolutionDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String technicianId = extractUserId(userDetails);
        System.out.println("Technician ID: " + technicianId + " is adding resolution to ticket " + id);
        
        ticketService.updateResolution(id, dto.getResolutionNotes(), technicianId);
        return ResponseEntity.ok("Resolution updated successfully");
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<TicketImageResponseDTO>> getTicketImages(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String technicianId = extractUserId(userDetails);
        System.out.println("Technician ID: " + technicianId + " is viewing images for ticket " + id);
        
        return ResponseEntity.ok(ticketImageService.getImagesByTicketIdForTechnician(id, technicianId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String technicianId = extractUserId(userDetails);
        System.out.println("Technician ID: " + technicianId + " is deleting ticket " + id);
        
        ticketService.deleteTicketForTechnician(id, technicianId);
        return ResponseEntity.ok("Ticket deleted successfully");
    }

    private String extractUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        String username = userDetails.getUsername();
        try {
            return username;
        } catch (NumberFormatException e) {
            return userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("Technician not found: " + username))
                    .getId();
        }
    }
}
