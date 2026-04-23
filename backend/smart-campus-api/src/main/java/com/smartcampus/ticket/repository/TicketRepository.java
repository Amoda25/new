package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.model.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    List<Ticket> findByAssignedToOrderByCreatedAtDesc(Long assignedTo);
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
}