package com.smartcampus.ticket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcampus.ticket.model.TicketImage;

public interface TicketImageRepository extends JpaRepository<TicketImage, Long> {
    List<TicketImage> findByTicketId(Long ticketId);
}