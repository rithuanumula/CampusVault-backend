package com.campusvault.dto;

import com.campusvault.entity.EventCategory;
import com.campusvault.entity.EventStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EventRequest {

    private String eventCode;

    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Event category is required")
    private EventCategory category;

    private String description;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    @NotBlank(message = "Organizer is required")
    private String organizer;

    private EventStatus status;

    public EventRequest() {}

    public String getEventCode() {
        return eventCode;
    }

    public void setEventCode(String eventCode) {
        this.eventCode = eventCode;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public EventCategory getCategory() {
        return category;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }
}
