package com.campusvault.service;

import com.campusvault.dto.EventRequest;
import com.campusvault.dto.EventResponse;
import com.campusvault.entity.Event;
import com.campusvault.exception.BadRequestException;
import com.campusvault.exception.ConflictException;
import com.campusvault.exception.ResourceNotFoundException;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final CertificateRepository certificateRepository;

    public EventService(EventRepository eventRepository, CertificateRepository certificateRepository) {
        this.eventRepository = eventRepository;
        this.certificateRepository = certificateRepository;
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc().stream()
                .map(e -> EventResponse.fromEntity(e, certificateRepository.countByEventId(e.getId())))
                .collect(Collectors.toList());
    }

    public List<EventResponse> searchEvents(String query) {
        if (query == null || query.isBlank()) {
            return getAllEvents();
        }
        return eventRepository.searchEvents(query.trim()).stream()
                .map(e -> EventResponse.fromEntity(e, certificateRepository.countByEventId(e.getId())))
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return EventResponse.fromEntity(event, certificateRepository.countByEventId(event.getId()));
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        String eventCode = request.getEventCode();
        if (eventCode == null || eventCode.isBlank()) {
            String catPrefix = request.getCategory() != null ? request.getCategory().name().substring(0, Math.min(4, request.getCategory().name().length())) : "EVT";
            eventCode = "EVT-" + catPrefix + "-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        } else {
            eventCode = eventCode.trim().toUpperCase();
            if (eventRepository.existsByEventCode(eventCode)) {
                throw new ConflictException("Event with code " + eventCode + " already exists");
            }
        }

        Event event = new Event(
                eventCode,
                request.getEventName(),
                request.getCategory(),
                request.getDescription(),
                request.getEventDate(),
                request.getOrganizer()
        );

        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }

        Event saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved, 0);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (request.getEventName() != null && !request.getEventName().isBlank()) {
            event.setEventName(request.getEventName().trim());
        }
        if (request.getCategory() != null) {
            event.setCategory(request.getCategory());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription().trim());
        }
        if (request.getEventDate() != null) {
            event.setEventDate(request.getEventDate());
        }
        if (request.getOrganizer() != null && !request.getOrganizer().isBlank()) {
            event.setOrganizer(request.getOrganizer().trim());
        }
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }

        Event updated = eventRepository.save(event);
        return EventResponse.fromEntity(updated, certificateRepository.countByEventId(updated.getId()));
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        long certCount = certificateRepository.countByEventId(id);
        if (certCount > 0) {
            throw new BadRequestException("Cannot delete event because " + certCount +
                    " issued certificate(s) depend on it. Please update the event status to COMPLETED or ARCHIVED instead.");
        }

        eventRepository.delete(event);
    }
}
