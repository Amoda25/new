package com.smartcampus.ticket.dto;

public class TicketCreateDTO {
    private String title;
    private String description;
    private String priority;
    private Long resourceId;

    public TicketCreateDTO() {
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }
}