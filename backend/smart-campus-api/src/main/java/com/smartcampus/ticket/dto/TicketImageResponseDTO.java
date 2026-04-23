package com.smartcampus.ticket.dto;

public class TicketImageResponseDTO {

    private Long id;
    private Long ticketId;
    private String fileName;
    private String imageUrl;
    private Long fileSize;
    private String uploadedAt;

    public TicketImageResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}