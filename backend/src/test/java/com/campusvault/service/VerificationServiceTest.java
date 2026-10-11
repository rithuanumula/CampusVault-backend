package com.campusvault.service;

import com.campusvault.dto.PublicVerificationResponse;
import com.campusvault.entity.*;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.VerificationRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VerificationServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private VerificationRecordRepository verificationRecordRepository;

    @InjectMocks
    private VerificationService verificationService;

    private Certificate sampleCertificate;

    @BeforeEach
    void setUp() {
        User admin = new User("admin@campusvault.edu", "pass", "Dean of Records", Role.ROLE_ADMIN);
        User studentUser = new User("rithika@campusvault.edu", "pass", "A Rithika Reddy", Role.ROLE_STUDENT);
        Student student = new Student("AU-2026-00421", studentUser, "A Rithika Reddy", "rithika@campusvault.edu", "Apex University", "CSE", "4th Year");
        Event event = new Event("EVT-REACT-2026", "React Workshop", EventCategory.WORKSHOP, "Workshop", LocalDate.of(2026, 9, 21), "Apex University");

        sampleCertificate = new Certificate(
                "AU-WEB-2026-00421",
                student,
                event,
                "Certificate of Excellence",
                "Completed React Training",
                LocalDate.of(2026, 9, 21),
                "http://localhost:5173/verify/AU-WEB-2026-00421",
                admin
        );
    }

    @Test
    @DisplayName("Should verify active certificate and return VERIFIED status")
    void testVerifyValidCertificate() {
        when(certificateRepository.findByCertificateId("AU-WEB-2026-00421"))
                .thenReturn(Optional.of(sampleCertificate));

        PublicVerificationResponse response = verificationService.verifyCertificate(
                "AU-WEB-2026-00421",
                VerificationMethod.MANUAL_ID,
                "127.0.0.1",
                "Mozilla/5.0"
        );

        assertNotNull(response);
        assertEquals("VERIFIED", response.getStatus());
        assertTrue(response.isValid());
        assertEquals("A Rithika Reddy", response.getStudentName());
        assertEquals("React Workshop", response.getEventName());
        assertEquals("AU-WEB-2026-00421", response.getCertificateId());

        verify(verificationRecordRepository, times(1)).save(any(VerificationRecord.class));
    }

    @Test
    @DisplayName("Should detect revoked certificate and return REVOKED status with reason")
    void testVerifyRevokedCertificate() {
        sampleCertificate.setStatus(CertificateStatus.REVOKED);
        sampleCertificate.setRevocationReason("Violation of academic honor code");
        sampleCertificate.setRevokedAt(LocalDateTime.now());

        when(certificateRepository.findByCertificateId("AU-WEB-2026-00421"))
                .thenReturn(Optional.of(sampleCertificate));

        PublicVerificationResponse response = verificationService.verifyCertificate(
                "AU-WEB-2026-00421",
                VerificationMethod.QR,
                "192.168.1.100",
                "Mobile Safari"
        );

        assertNotNull(response);
        assertEquals("REVOKED", response.getStatus());
        assertFalse(response.isValid());
        assertEquals("Violation of academic honor code", response.getRevocationReason());

        verify(verificationRecordRepository, times(1)).save(any(VerificationRecord.class));
    }

    @Test
    @DisplayName("Should handle non-existent certificate and return INVALID/NOT_FOUND status")
    void testVerifyNonExistentCertificate() {
        when(certificateRepository.findByCertificateId("UNKNOWN-ID-999"))
                .thenReturn(Optional.empty());

        PublicVerificationResponse response = verificationService.verifyCertificate(
                "UNKNOWN-ID-999",
                VerificationMethod.MANUAL_ID,
                "127.0.0.1",
                "Mozilla/5.0"
        );

        assertNotNull(response);
        assertEquals("INVALID", response.getStatus());
        assertFalse(response.isValid());

        verify(verificationRecordRepository, times(1)).save(any(VerificationRecord.class));
    }
}
