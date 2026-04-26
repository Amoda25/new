package com.smartcampus.ticket.service;

import java.util.List;

import com.smartcampus.ticket.dto.TicketCreateDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;

public interface TicketService {

    TicketResponseDTO createTicket(TicketCreateDTO dto, String currentUserId);

    List<TicketResponseDTO> getMyTickets(String currentUserId);

    TicketResponseDTO getTicketById(String ticketId, String currentUserId);

    List<TicketResponseDTO> getAllTickets();

    void assignTechnician(String ticketId, String technicianId);

    List<TicketResponseDTO> getAssignedTickets(String technicianId);

    void updateTicketStatus(String ticketId, String status, String technicianId);
    
    void updateTicketStatusAdmin(String ticketId, String status);
    
    void rejectTicket(String ticketId, String reason);

    void updateResolution(String ticketId, String resolutionNotes, String technicianId);

    void updateResolutionAdmin(String ticketId, String resolutionNotes);

    void deleteTicket(String ticketId);
    
    void deleteTicketForTechnician(String ticketId, String technicianId);

    void deleteTicketForUser(String ticketId, String userId);

}
