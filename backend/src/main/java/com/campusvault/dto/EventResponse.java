package com.campusvault.dto;

import com.campusvault.entity.Event;
import com.campusvault.entity.EventCategory;
import com.campusvault.entity.EventStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventResponse {
    private Long id;
    private String eventCode;
    private String eventName;
    private EventCategory category;
    private String description;
    private LocalDate eventDate;
    private String organizer;
    private EventStatus status;
    private long certificateCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EventResponse() {}

    public static EventResponse fromEntity(Event event, long certificateCount) {
        EventResponse resp = new EventResponse();
        resp.setId(event.getId());
        resp.setEventCode(event.getEventCode());
        resp.setEventName(event.getEventName());
        resp.setCategory(event.getCategory());
        resp.setDescription(event.getDescription());
        resp.setEventDate(event.getEventDate());
        resp.setOrganizer(event.getOrganizer());
        resp.setStatus(event.getStatus());
        resp.setCertificateCount(certificateCount);
        resp.setCreatedAt(event.getCreatedAt());
        resp.setUpdatedAt(event.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public long getCertificateCount() {
        return certificateCount;
    }

    public void setCertificateCount(long certificateCount) {
        this.certificateCount = certificateCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
