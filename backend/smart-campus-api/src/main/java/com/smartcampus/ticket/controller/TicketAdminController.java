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

import com.smartcampus.ticket.dto.TicketAssignDTO;
import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.dto.TicketResolutionDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;
import com.smartcampus.ticket.dto.TicketStatusUpdateDTO;
import com.smartcampus.ticket.service.TicketImageService;
import com.smartcampus.ticket.service.TicketService;
import com.smartcampus.user.model.User;
import com.smartcampus.user.service.UserService;


@RestController
@RequestMapping("/api/admin/tickets")
@PreAuthorize("hasRole('ADMIN')")  // ← ADD THIS - Only ADMIN can access
public class TicketAdminController {

    private final TicketService ticketService;
    private final TicketImageService ticketImageService;
    private final UserService userService;


    public TicketAdminController(TicketService ticketService, TicketImageService ticketImageService,UserService userService) {
        this.ticketService = ticketService;
        this.ticketImageService = ticketImageService;
         this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets(
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String adminId = userDetails.getUsername();  // ← Get admin ID from JWT
        System.out.println("Admin ID: " + adminId + " is viewing all tickets");
        
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getAllTechnicians() {
        return ResponseEntity.ok(userService.getAllTechnicians());
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<String> assignTechnician(
            @PathVariable String id,
            @RequestBody TicketAssignDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String adminId = userDetails.getUsername();
        System.out.println("Admin ID: " + adminId + " is assigning technician to ticket " + id);
        
        ticketService.assignTechnician(id, dto.getTechnicianId());
        return ResponseEntity.ok("Technician assigned successfully");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateTicketStatus(
            @PathVariable String id,
            @RequestBody TicketStatusUpdateDTO dto) {
        ticketService.updateTicketStatusAdmin(id, dto.getStatus());
        return ResponseEntity.ok("Ticket status updated successfully by Admin");
    }

    @PutMapping("/{id}/resolution")
    public ResponseEntity<String> updateResolution(
            @PathVariable String id,
            @RequestBody TicketResolutionDTO dto) {
        ticketService.updateResolutionAdmin(id, dto.getResolutionNotes());
        return ResponseEntity.ok("Resolution updated successfully by Admin");
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<TicketImageResponseDTO>> getTicketImagesForAdmin(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String adminId = userDetails.getUsername();
        System.out.println("Admin ID: " + adminId + " is viewing images for ticket " + id);
        
        return ResponseEntity.ok(ticketImageService.getImagesByTicketIdForAdmin(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTicket(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String adminId = userDetails.getUsername();
        System.out.println("Admin ID: " + adminId + " is deleting ticket " + id);
        
        ticketService.deleteTicket(id);
        return ResponseEntity.ok("Ticket and related images deleted successfully");
    }
}
