package com.campusvault.repository;

import com.campusvault.entity.Event;
import com.campusvault.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByEventCode(String eventCode);
    boolean existsByEventCode(String eventCode);
    List<Event> findAllByOrderByEventDateDesc();
    List<Event> findByCategory(EventCategory category);

    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.eventName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.eventCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.organizer) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY e.eventDate DESC")
    List<Event> searchEvents(@Param("query") String query);
}
