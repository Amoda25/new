package com.smartcampus.ticket.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.ticket.dto.TicketImageResponseDTO;
import com.smartcampus.ticket.model.Ticket;
import com.smartcampus.ticket.model.TicketImage;
import com.smartcampus.ticket.repository.TicketImageRepository;
import com.smartcampus.ticket.repository.TicketRepository;



@Service
public class TicketImageServiceImpl implements TicketImageService {

    private final TicketImageRepository ticketImageRepository;
    private final TicketRepository ticketRepository;

    private static final String UPLOAD_DIR = "uploads/tickets";

    public TicketImageServiceImpl(TicketImageRepository ticketImageRepository,TicketRepository ticketRepository) {
        this.ticketImageRepository = ticketImageRepository;
        this.ticketRepository = ticketRepository;
    }   

    @Override
    public List<TicketImage> uploadImages(Long ticketId, List<MultipartFile> files) {

        System.out.println("Files received: " + (files == null ? 0 : files.size()));

        if (files == null || files.isEmpty()) {
            return List.of();
        }

        if (files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        List<TicketImage> savedImages = new ArrayList<>();

        try {

            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile file : files) {

                String contentType = file.getContentType();

                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new RuntimeException("Only image files are allowed");
                }

                String originalFileName = file.getOriginalFilename();

                String safeFileName =
                        UUID.randomUUID() + "_" + (originalFileName != null ? originalFileName : "image");

                Path targetPath = uploadPath.resolve(safeFileName);

                Files.copy(file.getInputStream(), targetPath);

                TicketImage image = new TicketImage();
                image.setTicketId(ticketId);
                image.setFileName(originalFileName);
                image.setFilePath("uploads/tickets/" + safeFileName);
                image.setFileSize(file.getSize());
                image.setUploadedAt(LocalDateTime.now());

                savedImages.add(ticketImageRepository.save(image));
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }

        return savedImages;
    }




    @Override
    public List<TicketImageResponseDTO> getImagesByTicketId(Long ticketId, Long currentUserId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (!ticket.getCreatedBy().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access images of this ticket");
        }

        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);
        List<TicketImageResponseDTO> responseList = new ArrayList<>();

        for (TicketImage image : images) {
            TicketImageResponseDTO dto = new TicketImageResponseDTO();
            dto.setId(image.getId());
            dto.setTicketId(image.getTicketId());
            dto.setFileName(image.getFileName());
            dto.setImageUrl("http://localhost:8080/" + image.getFilePath());
            dto.setFileSize(image.getFileSize());
            dto.setUploadedAt(image.getUploadedAt() != null ? image.getUploadedAt().toString() : null);

            responseList.add(dto);
        }

        return responseList;
    }



    @Override
    public List<TicketImageResponseDTO> getImagesByTicketIdForTechnician(Long ticketId, Long technicianId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(technicianId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not assigned to this ticket");
        }

        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);
        List<TicketImageResponseDTO> responseList = new ArrayList<>();

        for (TicketImage image : images) {
            TicketImageResponseDTO dto = new TicketImageResponseDTO();
            dto.setId(image.getId());
            dto.setTicketId(image.getTicketId());
            dto.setFileName(image.getFileName());
            dto.setImageUrl("http://localhost:8080/" + image.getFilePath());
            dto.setFileSize(image.getFileSize());
            dto.setUploadedAt(image.getUploadedAt() != null ? image.getUploadedAt().toString() : null);

            responseList.add(dto);
        }

        return responseList;
    }

    @Override
    public List<TicketImageResponseDTO> getImagesByTicketIdForAdmin(Long ticketId) {

        ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        List<TicketImage> images = ticketImageRepository.findByTicketId(ticketId);
        List<TicketImageResponseDTO> responseList = new ArrayList<>();

        for (TicketImage image : images) {
            TicketImageResponseDTO dto = new TicketImageResponseDTO();
            dto.setId(image.getId());
            dto.setTicketId(image.getTicketId());
            dto.setFileName(image.getFileName());
            dto.setImageUrl("http://localhost:8080/" + image.getFilePath());
            dto.setFileSize(image.getFileSize());
            dto.setUploadedAt(image.getUploadedAt() != null ? image.getUploadedAt().toString() : null);

            responseList.add(dto);
        }

        return responseList;
    }

}