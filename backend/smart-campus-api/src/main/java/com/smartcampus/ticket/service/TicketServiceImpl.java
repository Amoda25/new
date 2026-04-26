package com.smartcampus.ticket.service;

import org.springframework.lang.NonNull;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.notification.model.NotificationType;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.security.roles.Role;
import com.smartcampus.ticket.dto.TicketCreateDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;
import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.model.TicketImage;
import com.smartcampus.ticket.model.TicketStatus;
import com.smartcampus.ticket.repository.CommentRepository;
import com.smartcampus.ticket.repository.TicketImageRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.model.User;
import com.smartcampus.user.repository.UserRepository;


@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketImageRepository ticketImageRepository;
    private final NotificationService notificationService;
    private final CommentRepository commentRepository;
    

    private final UserRepository userRepository;
    

    public TicketServiceImpl(TicketRepository ticketRepository,NotificationService notificationService,TicketImageRepository ticketImageRepository,CommentRepository commentRepository,UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
        this.ticketImageRepository = ticketImageRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;

    }

    @Override
    public TicketResponseDTO createTicket(TicketCreateDTO dto, String currentUserId) {
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setLocation(dto.getLocation());
        ticket.setContactName(dto.getContactName());
        ticket.setContactDetails(dto.getContactDetails());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedBy(currentUserId);
        ticket.setResourceId(dto.getResourceId());
        ticket.setAssignedTo(null);
        ticket.setResolutionNotes(null);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(null);

        Ticket savedTicket = ticketRepository.save(ticket);


        try {
            Optional<User> adminOpt = userRepository.findFirstByRole(Role.ADMIN);

            if (adminOpt.isPresent()) {
                notificationService.createNotification(
                    adminOpt.get().getId(),
                    NotificationType.TICKET_CREATED,
                    "A new ticket has been created",
                    savedTicket.getId()
                );
            } else {
                System.out.println("⚠️ Admin not found");
            }

        } catch (Exception e) {
            System.out.println("⚠️ Notification failed: " + e.getMessage());
        }

        return mapToResponseDTO(savedTicket);
    }

    @Override
    public List<TicketResponseDTO> getMyTickets(String currentUserId) {
        List<Ticket> tickets = ticketRepository.findByCreatedByOrderByCreatedAtDesc(currentUserId);
        List<TicketResponseDTO> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            responseList.add(mapToResponseDTO(ticket));
        }

        return responseList;
    }
    @Override
    public TicketResponseDTO getTicketById(@NonNull String ticketId, String currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getCreatedBy().equals(currentUserId)) {
            throw new RuntimeException("You cannot access this ticket");
        }

        return mapToResponseDTO(ticket);
    }

    @Override
    public List<TicketResponseDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        List<TicketResponseDTO> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            responseList.add(mapToResponseDTO(ticket));
        }

        return responseList;
    }

    @Override
    public void assignTechnician(@NonNull String ticketId, String technicianId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTo(technicianId);
        ticket.setStatus(TicketStatus.ASSIGNED);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        notificationService.createNotification(
            technicianId,
            NotificationType.TICKET_ASSIGNED,
            "You have been assigned to ticket #" + ticketId,
            ticketId
        );
    }

    @Override
    public List<TicketResponseDTO> getAssignedTickets(String technicianId) {
        List<Ticket> tickets = ticketRepository.findByAssignedToOrderByCreatedAtDesc(technicianId);
        List<TicketResponseDTO> responseList = new ArrayList<>();

        for (Ticket ticket : tickets) {
            responseList.add(mapToResponseDTO(ticket));
        }

        return responseList;
    }

    @Override
    public void updateTicketStatus(@NonNull String ticketId, String status, String technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(technicianId)) {
            throw new RuntimeException("This ticket is not assigned to this technician");
        }

        ticket.setStatus(TicketStatus.valueOf(status.toUpperCase()));
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        if (ticket.getStatus() == TicketStatus.RESOLVED) {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_RESOLVED,
                "Your ticket #" + ticketId + " has been resolved",
                ticketId
            );
        }
        else {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_STATUS_UPDATED,
                "Your ticket status changed to " + ticket.getStatus(),
                ticketId
            );
        }
        
    }

    @Override
    public void updateTicketStatusAdmin(String ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.valueOf(status.toUpperCase()));
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        try {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_STATUS_UPDATED,
                "Admin updated your ticket status to " + ticket.getStatus(),
                ticketId
            );
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }

    @Override
    public void rejectTicket(String ticketId, String reason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        try {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_STATUS_UPDATED,
                "Your ticket was rejected. Reason: " + reason,
                ticketId
            );
        } catch (Exception e) {
            System.err.println("Failed to send rejection notification: " + e.getMessage());
        }
    }
    
    @Override
    public void updateTicketStatusAdmin(String ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.valueOf(status.toUpperCase()));
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        try {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_STATUS_UPDATED,
                "Admin updated your ticket status to " + ticket.getStatus(),
                ticketId
            );
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }

    @Override
    public void rejectTicket(String ticketId, String reason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(reason);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        try {
            notificationService.createNotification(
                ticket.getCreatedBy(),
                NotificationType.TICKET_STATUS_UPDATED,
                "Your ticket was rejected. Reason: " + reason,
                ticketId
            );
        } catch (Exception e) {
            System.err.println("Failed to send rejection notification: " + e.getMessage());
        }
    }

    @Override
    public void updateResolution(@NonNull String ticketId, String resolutionNotes, String technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(technicianId)) {
            throw new RuntimeException("This ticket is not assigned to this technician");
        }

        ticket.setResolutionNotes(resolutionNotes);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);
    }

    @Override
    public void updateResolutionAdmin(String ticketId, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setResolutionNotes(resolutionNotes);
        ticket.setUpdatedAt(LocalDateTime.now());

        ticketRepository.save(ticket);
    }



    @Override
    public void deleteTicket(@NonNull String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));


        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);

        for (TicketImage image : images) {
            try {
                String storedPath = image.getFilePath();

                if (storedPath != null && !storedPath.isBlank()) {
                    Path filePath = Paths.get(storedPath).toAbsolutePath().normalize();
                    Files.deleteIfExists(filePath);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete image file: " + image.getFilePath(), e);
            }
        }

        ticketImageRepository.deleteAll(images);
        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }



    @Override
    public void deleteTicketForTechnician(@NonNull String ticketId, String technicianId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        
        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(technicianId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this ticket");
        }

        // Only resolved tickets are deleted
        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only resolved tickets can be deleted"
            );
        }

        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);

        for (TicketImage image : images) {
            try {
                Path filePath = Paths.get(image.getFilePath()).toAbsolutePath().normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.out.println("Failed to delete file: " + image.getFilePath());
            }
        }

        ticketImageRepository.deleteAll(images);
        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }


    @Override
    public void deleteTicketForUser(@NonNull String ticketId, String userId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        // Only owner can delete
        if (!ticket.getCreatedBy().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own tickets");
        }

        
        
        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);

        for (TicketImage image : images) {
            try {
                Path filePath = Paths.get(image.getFilePath()).toAbsolutePath().normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.out.println("Failed to delete file: " + image.getFilePath());
            }
        }

        ticketImageRepository.deleteAll(images);
        commentRepository.deleteByTicketId(ticketId);
        ticketRepository.delete(ticket);
    }


    private TicketResponseDTO mapToResponseDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus().name());
        
        // Resolve creator name
        if (ticket.getCreatedBy() != null) {
            Optional<User> creatorOpt = userRepository.findById(ticket.getCreatedBy());
            dto.setCreatedBy(creatorOpt.map(User::getName).orElse("Unknown Student"));
        } else {
            dto.setCreatedBy("System");
        }

        dto.setResourceId(ticket.getResourceId());
        
        // Resolve technician name if assigned
        if (ticket.getAssignedTo() != null) {
            Optional<User> techOpt = userRepository.findById(ticket.getAssignedTo());
            dto.setAssignedTo(techOpt.map(User::getName).orElse("Unknown Technician"));
        } else {
            dto.setAssignedTo(null);
        }

        dto.setCategory(ticket.getCategory());
        dto.setLocation(ticket.getLocation());
        dto.setContactName(ticket.getContactName());
        dto.setContactDetails(ticket.getContactDetails());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        return dto;
    }
}
