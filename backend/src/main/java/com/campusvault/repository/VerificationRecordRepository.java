package com.campusvault.repository;

import com.campusvault.entity.VerificationRecord;
import com.campusvault.entity.VerificationResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRecordRepository extends JpaRepository<VerificationRecord, Long> {
    Page<VerificationRecord> findAllByOrderByVerificationTimestampDesc(Pageable pageable);
    List<VerificationRecord> findByCertificateIdOrderByVerificationTimestampDesc(String certificateId);
    long countByVerificationResult(VerificationResult verificationResult);

    @Query("SELECT v FROM VerificationRecord v WHERE " +
           "LOWER(v.certificateId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.remarks) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY v.verificationTimestamp DESC")
    Page<VerificationRecord> searchRecords(@Param("query") String query, Pageable pageable);
}
