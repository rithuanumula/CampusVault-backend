package com.campusvault.service;

import com.campusvault.dto.EventRequest;
import com.campusvault.dto.EventResponse;
import com.campusvault.entity.Event;
import com.campusvault.entity.EventCategory;
import com.campusvault.entity.EventStatus;
import com.campusvault.exception.BadRequestException;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.EventRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CertificateRepository certificateRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    @DisplayName("Should create event with auto-generated code")
    void testCreateEvent() {
        EventRequest request = new EventRequest();
        request.setEventName("Cloud Architecture Summit");
        request.setCategory(EventCategory.TECHNICAL);
        request.setDescription("Annual cloud symposium");
        request.setEventDate(LocalDate.of(2026, 11, 10));
        request.setOrganizer("Dept of Cloud Systems");

        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArgument(0));

        EventResponse response = eventService.createEvent(request);

        assertNotNull(response);
        assertEquals("Cloud Architecture Summit", response.getEventName());
        assertTrue(response.getEventCode().startsWith("EVT-TECH-"));
    }

    @Test
    @DisplayName("Should prevent deleting event when issued certificates depend on it")
    void testDeleteEventSafetyCheck() {
        Event event = new Event("EVT-REACT-2026", "React Workshop", EventCategory.WORKSHOP, "Desc", LocalDate.now(), "Apex");
        event.setId(5L);

        when(eventRepository.findById(5L)).thenReturn(Optional.of(event));
        when(certificateRepository.countByEventId(5L)).thenReturn(3L); // 3 certificates exist

        assertThrows(BadRequestException.class, () -> {
            eventService.deleteEvent(5L);
        });

        verify(eventRepository, never()).delete(any(Event.class));
    }
}
