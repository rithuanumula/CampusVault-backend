package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.EventRequest;
import com.campusvault.dto.EventResponse;
import com.campusvault.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Public / Authenticated catalog endpoints
    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(@RequestParam(required = false) String query) {
        List<EventResponse> events = eventService.searchEvents(query);
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", events));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Event details fetched", event));
    }

    // Admin endpoints
    @PostMapping("/admin/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Event created successfully", created));
    }

    @PutMapping("/admin/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(@PathVariable Long id, @RequestBody EventRequest request) {
        EventResponse updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }

    @DeleteMapping("/admin/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
