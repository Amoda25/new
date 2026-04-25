package com.smartcampus.ticket.dto;

public class TicketCreateDTO {
    private String title;
    private String description;
    private String priority;
    private String resourceId;
    private String category;
    private String location;
    private String contactName;
    private String contactDetails;

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

    public String getResourceId() {
        return resourceId;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public String getContactName() {
        return contactName;
    }

    public String getContactDetails() {
        return contactDetails;
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

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }
}
