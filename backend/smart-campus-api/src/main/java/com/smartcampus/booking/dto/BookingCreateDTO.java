package com.smartcampus.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BookingCreateDTO {
    
    @NotNull(message = "Resource ID is required")
    private String resourceId;
    
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
    
    private String purpose;
    
    @Min(value = 1, message = "Attendees must be at least 1")
    private Integer attendees;
    
    // Getters and Setters
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public Integer getAttendees() { return attendees; }
    public void setAttendees(Integer attendees) { this.attendees = attendees; }
}
