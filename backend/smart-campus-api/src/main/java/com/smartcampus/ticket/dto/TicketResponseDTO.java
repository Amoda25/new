package com.smartcampus.ticket.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;
    private Long createdBy;
    private Long resourceId;
    private Long assignedTo;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> images; 

    public TicketResponseDTO() {
    }

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public String getDescription() { return description; }

    public String getPriority() { return priority; }

    public String getStatus() { return status; }

    public Long getCreatedBy() { return createdBy; }

    public Long getResourceId() { return resourceId; }

    public Long getAssignedTo() { return assignedTo; }

    public String getResolutionNotes() { return resolutionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<String> getImages() { return images; }

    public void setId(Long id) { this.id = id; }

    public void setTitle(String title) { this.title = title; }

    public void setDescription(String description) { this.description = description; }

    public void setPriority(String priority) { this.priority = priority; }

    public void setStatus(String status) { this.status = status; }

    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }

    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void setImages(List<String> images) { this.images = images; }
}