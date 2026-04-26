package com.smartcampus.ticket.service;

import java.util.List;
import org.springframework.lang.NonNull;

import com.smartcampus.ticket.dto.TicketCreateDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;


public interface TicketService {

    TicketResponseDTO createTicket(TicketCreateDTO dto, String currentUserId);

    List<TicketResponseDTO> getMyTickets(String currentUserId);

    TicketResponseDTO getTicketById(@NonNull String ticketId, String currentUserId);

    List<TicketResponseDTO> getAllTickets();

    void assignTechnician(@NonNull String ticketId, String technicianId);

    List<TicketResponseDTO> getAssignedTickets(String technicianId);

    void updateTicketStatus(@NonNull String ticketId, String status, String technicianId);
    
    void updateTicketStatusAdmin(@NonNull String ticketId, String status);
    
    void rejectTicket(@NonNull String ticketId, String reason);

    void updateResolution(@NonNull String ticketId, String resolutionNotes, String technicianId);

    void updateResolutionAdmin(@NonNull String ticketId, String resolutionNotes);

    void deleteTicket(@NonNull String ticketId);
    
    void deleteTicketForTechnician(@NonNull String ticketId, String technicianId);

    void deleteTicketForUser(@NonNull String ticketId, String userId);

}
