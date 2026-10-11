package com.campusvault.service;

import com.campusvault.dto.PublicVerificationResponse;
import com.campusvault.dto.VerificationHistoryResponse;
import com.campusvault.entity.Certificate;
import com.campusvault.entity.CertificateStatus;
import com.campusvault.entity.VerificationMethod;
import com.campusvault.entity.VerificationRecord;
import com.campusvault.entity.VerificationResult;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.VerificationRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class VerificationService {

    private final CertificateRepository certificateRepository;
    private final VerificationRecordRepository verificationRecordRepository;

    public VerificationService(CertificateRepository certificateRepository,
                               VerificationRecordRepository verificationRecordRepository) {
        this.certificateRepository = certificateRepository;
        this.verificationRecordRepository = verificationRecordRepository;
    }

    @Transactional
    public PublicVerificationResponse verifyCertificate(String rawCertId, VerificationMethod method, String clientIp, String userAgent) {
        if (rawCertId == null || rawCertId.isBlank()) {
            recordAttempt("UNKNOWN", method, VerificationResult.INVALID, clientIp, userAgent, "Empty Certificate ID provided");
            return PublicVerificationResponse.notFound("EMPTY_ID");
        }

        String certificateId = rawCertId.trim().toUpperCase();
        Optional<Certificate> certOpt = certificateRepository.findByCertificateId(certificateId);

        if (certOpt.isEmpty()) {
            recordAttempt(certificateId, method, VerificationResult.INVALID, clientIp, userAgent, "Certificate ID not found in registry");
            return PublicVerificationResponse.notFound(certificateId);
        }

        Certificate cert = certOpt.get();

        if (cert.getStatus() == CertificateStatus.REVOKED) {
            recordAttempt(certificateId, method, VerificationResult.REVOKED, clientIp, userAgent, "Certificate revoked: " + cert.getRevocationReason());
            return PublicVerificationResponse.revoked(
                    cert.getCertificateId(),
                    cert.getRevocationReason(),
                    cert.getRevokedAt(),
                    cert.getStudent().getCollege(),
                    cert.getStudent().getFullName()
            );
        }

        // Active & authentic
        recordAttempt(certificateId, method, VerificationResult.VERIFIED, clientIp, userAgent, "Successfully verified");
        return PublicVerificationResponse.verified(
                cert.getCertificateId(),
                cert.getStudent().getFullName(),
                cert.getStudent().getDepartment(),
                cert.getStudent().getCollege(),
                cert.getEvent().getEventName(),
                cert.getEvent().getCategory(),
                cert.getEvent().getOrganizer(),
                cert.getCertificateTitle(),
                cert.getDescription(),
                cert.getIssueDate()
        );
    }

    private void recordAttempt(String certificateId, VerificationMethod method, VerificationResult result,
                               String clientIp, String userAgent, String remarks) {
        try {
            VerificationRecord record = new VerificationRecord(
                    certificateId,
                    method != null ? method : VerificationMethod.MANUAL_ID,
                    result,
                    clientIp != null ? (clientIp.length() > 100 ? clientIp.substring(0, 100) : clientIp) : "unknown",
                    userAgent != null ? (userAgent.length() > 500 ? userAgent.substring(0, 500) : userAgent) : "unknown",
                    remarks
            );
            verificationRecordRepository.save(record);
        } catch (Exception ignored) {
            // Log silently without breaking public verification response
        }
    }

    public Page<VerificationHistoryResponse> getVerificationHistory(String query, Pageable pageable) {
        Page<VerificationRecord> records;
        if (query != null && !query.isBlank()) {
            records = verificationRecordRepository.searchRecords(query.trim(), pageable);
        } else {
            records = verificationRecordRepository.findAllByOrderByVerificationTimestampDesc(pageable);
        }
        return records.map(VerificationHistoryResponse::fromEntity);
    }
}
