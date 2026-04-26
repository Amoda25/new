package com.smartcampus.booking.dto;

import com.smartcampus.booking.model.Booking;
import com.smartcampus.booking.model.BookingStatus;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    private String id;
    private String resourceId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private Integer attendees;
    private BookingStatus status;
    private String rejectionReason;
    private String studentName;
    private String idNumber;
    private String department;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    
    public static BookingResponseDTO fromEntity(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setUserId(booking.getUserId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    
    public Integer getAttendees() { return attendees; }
    public void setAttendees(Integer attendees) { this.attendees = attendees; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}

