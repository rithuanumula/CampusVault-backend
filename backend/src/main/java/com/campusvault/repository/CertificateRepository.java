package com.campusvault.repository;

import com.campusvault.entity.Certificate;
import com.campusvault.entity.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateId(String certificateId);
    boolean existsByCertificateId(String certificateId);

    List<Certificate> findByStudentIdOrderByIssueDateDesc(Long studentId);
    List<Certificate> findByStudentUserIdOrderByIssueDateDesc(Long userId);
    List<Certificate> findByEventId(Long eventId);
    long countByEventId(Long eventId);
    long countByStatus(CertificateStatus status);
    List<Certificate> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Certificate c WHERE " +
           "LOWER(c.certificateId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.student.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.event.eventName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.certificateTitle) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY c.createdAt DESC")
    List<Certificate> searchCertificates(@Param("query") String query);
}
