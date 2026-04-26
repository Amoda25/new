package com.smartcampus.ticket.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.ticket.dto.TicketCreateDTO;
import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;
import com.smartcampus.ticket.service.TicketImageService;
import com.smartcampus.ticket.service.TicketService;
import com.smartcampus.user.repository.UserRepository;

@RestController
@RequestMapping("/api/user/tickets")
public class TicketUserController {

    private final TicketService ticketService;
    private final TicketImageService ticketImageService;
    private final UserRepository userRepository;

    public TicketUserController(TicketService ticketService, 
                                TicketImageService ticketImageService,
                                UserRepository userRepository) {
        this.ticketService = ticketService;
        this.ticketImageService = ticketImageService;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponseDTO> createTicket(
            @ModelAttribute TicketCreateDTO dto,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String currentUserId = extractUserId(userDetails);
        
        System.out.println("User ID: " + currentUserId + " is creating a ticket");
        System.out.println("Images received: " + (images == null ? 0 : images.length));
        
        if (images != null) {
            for (MultipartFile image : images) {
                System.out.println("File: " + image.getOriginalFilename());
            }
        }

        TicketResponseDTO createdTicket = ticketService.createTicket(dto, currentUserId);

        if (images != null && images.length > 0) {
            ticketImageService.uploadImages(createdTicket.getId(), java.util.Arrays.asList(images));
        }

        return ResponseEntity.ok(createdTicket);
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getMyTickets(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String currentUserId = extractUserId(userDetails);
        System.out.println("User ID: " + currentUserId + " is viewing their tickets");
        
        return ResponseEntity.ok(ticketService.getMyTickets(currentUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String currentUserId = extractUserId(userDetails);
        System.out.println("User ID: " + currentUserId + " is viewing ticket " + id);
        
        return ResponseEntity.ok(ticketService.getTicketById(id, currentUserId));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<TicketImageResponseDTO>> getTicketImages(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {  // ← ADD THIS PARAMETER
        
        String currentUserId = userDetails.getUsername();
        System.out.println("User ID: " + currentUserId + " is viewing images for ticket " + id);
        
        return ResponseEntity.ok(ticketImageService.getImagesByTicketId(id, currentUserId));
    }

    // TEMPORARY TEST ENDPOINT - Can be removed later
    @PostMapping(value = "/test-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> testUpload(
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        System.out.println("User ID: " + userId + " testing upload");
        System.out.println("TEST images count = " + (images == null ? 0 : images.length));

        if (images != null) {
            for (MultipartFile file : images) {
                System.out.println("TEST file = " + file.getOriginalFilename());
            }
        }

        return ResponseEntity.ok("received = " + (images == null ? 0 : images.length));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserTicket(
            @PathVariable @NonNull String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        String userId = extractUserId(userDetails);
        System.out.println("User ID: " + userId + " is deleting ticket " + id);
        
        ticketService.deleteTicketForUser(id, userId);
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
                    .orElseThrow(() -> new RuntimeException("User not found: " + username))
                    .getId();
        }
    }
}
