package com.smartcampus.ticket.service;

import java.util.List;
import org.springframework.lang.NonNull;

import org.springframework.web.multipart.MultipartFile;


import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.model.TicketImage;

public interface TicketImageService {

    List<TicketImage> uploadImages(@NonNull String ticketId, List<MultipartFile> files);

    List<TicketImageResponseDTO> getImagesByTicketId(@NonNull String ticketId, String currentUserId);

    List<TicketImageResponseDTO> getImagesByTicketIdForTechnician(@NonNull String ticketId, String technicianId);

    List<TicketImageResponseDTO> getImagesByTicketIdForAdmin(@NonNull String ticketId);
}
