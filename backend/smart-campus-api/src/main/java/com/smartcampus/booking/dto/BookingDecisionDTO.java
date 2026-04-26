package com.smartcampus.booking.dto;



public class BookingDecisionDTO {
    
    private String reason;  // Required for rejection, optional for approval
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
