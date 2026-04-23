package com.smartcampus.ticket.dto;

public class TicketAssignDTO {
    private Long technicianId;

    public TicketAssignDTO() {
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }
}