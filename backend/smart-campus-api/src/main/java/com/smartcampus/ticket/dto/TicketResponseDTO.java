package com.smartcampus.ticket.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponseDTO {

    private String id;
    private String title;
    private String description;
    private String priority;
    private String status;
    private String createdBy;
    private String resourceId;
    private String assignedTo;
    private String category;
    private String location;
    private String contactName;
    private String contactDetails;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> images; 

    public TicketResponseDTO() {
    }

    public String getId() { return id; }

    public String getTitle() { return title; }

    public String getDescription() { return description; }

    public String getPriority() { return priority; }

    public String getStatus() { return status; }

    public String getCreatedBy() { return createdBy; }

    public String getResourceId() { return resourceId; }

    public String getAssignedTo() { return assignedTo; }

    public String getResolutionNotes() { return resolutionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getCategory() { return category; }
    public String getLocation() { return location; }
    public String getContactName() { return contactName; }
    public String getContactDetails() { return contactDetails; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setCategory(String category) { this.category = category; }
    public void setLocation(String location) { this.location = location; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public List<String> getImages() { return images; }

    public void setId(String id) { this.id = id; }

    public void setTitle(String title) { this.title = title; }

    public void setDescription(String description) { this.description = description; }

    public void setPriority(String priority) { this.priority = priority; }

    public void setStatus(String status) { this.status = status; }

    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getRejectionReason() { return rejectionReason; }

    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void setImages(List<String> images) { this.images = images; }
}
