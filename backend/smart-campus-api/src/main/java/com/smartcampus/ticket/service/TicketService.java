package com.smartcampus.ticket.service;

import java.util.List;

import com.smartcampus.ticket.dto.TicketCreateDTO;
import com.smartcampus.ticket.dto.TicketResponseDTO;

public interface TicketService {

    TicketResponseDTO createTicket(TicketCreateDTO dto, Long currentUserId);

    List<TicketResponseDTO> getMyTickets(Long currentUserId);

    TicketResponseDTO getTicketById(Long ticketId, Long currentUserId);

    List<TicketResponseDTO> getAllTickets();

    void assignTechnician(Long ticketId, Long technicianId);

    List<TicketResponseDTO> getAssignedTickets(Long technicianId);

    void updateTicketStatus(Long ticketId, String status, Long technicianId);

    void updateResolution(Long ticketId, String resolutionNotes, Long technicianId);

    void deleteTicket(Long ticketId);
    
    void deleteTicketForTechnician(Long ticketId, Long technicianId);

    void deleteTicketForUser(Long ticketId, Long userId);

}