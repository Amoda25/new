package com.smartcampus.ticket.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.model.TicketImage;

public interface TicketImageService {

    List<TicketImage> uploadImages(Long ticketId, List<MultipartFile> files);

    List<TicketImageResponseDTO> getImagesByTicketId(Long ticketId, Long currentUserId);

    List<TicketImageResponseDTO> getImagesByTicketIdForTechnician(Long ticketId, Long technicianId);

    List<TicketImageResponseDTO> getImagesByTicketIdForAdmin(Long ticketId);
}