package com.smartcampus.booking.model;

public enum BookingStatus {
    PENDING("Pending Approval"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    CANCELLED("Cancelled");
    
    private final String displayName;
    
    BookingStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public boolean canBeCancelled() {
        return this == PENDING || this == APPROVED;
    }
    
    public boolean isPending() {
        return this == PENDING;
    }
    
    public boolean isActive() {
        return this == APPROVED;
    }
}