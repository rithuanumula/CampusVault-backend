package com.campusvault.service;

import com.campusvault.dto.CertificateResponse;
import com.campusvault.dto.DashboardStatsResponse;
import com.campusvault.dto.VerificationHistoryResponse;
import com.campusvault.entity.CertificateStatus;
import com.campusvault.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final CertificateRepository certificateRepository;
    private final VerificationRecordRepository verificationRecordRepository;

    public DashboardService(StudentRepository studentRepository,
                            EventRepository eventRepository,
                            CertificateRepository certificateRepository,
                            VerificationRecordRepository verificationRecordRepository) {
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
        this.certificateRepository = certificateRepository;
        this.verificationRecordRepository = verificationRecordRepository;
    }

    public DashboardStatsResponse getAdminStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalEvents(eventRepository.count());
        stats.setTotalCertificates(certificateRepository.count());
        stats.setTotalVerifications(verificationRecordRepository.count());
        stats.setActiveCertificates(certificateRepository.countByStatus(CertificateStatus.ACTIVE));
        stats.setRevokedCertificates(certificateRepository.countByStatus(CertificateStatus.REVOKED));

        List<CertificateResponse> recentCerts = certificateRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(CertificateResponse::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentCertificates(recentCerts);

        List<VerificationHistoryResponse> recentVerifs = verificationRecordRepository
                .findAllByOrderByVerificationTimestampDesc(PageRequest.of(0, 5))
                .stream()
                .map(VerificationHistoryResponse::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentVerifications(recentVerifs);

        return stats;
    }
}
