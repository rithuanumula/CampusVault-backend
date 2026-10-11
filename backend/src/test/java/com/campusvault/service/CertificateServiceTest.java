package com.campusvault.service;

import com.campusvault.dto.CertificateRequest;
import com.campusvault.dto.CertificateResponse;
import com.campusvault.dto.RevokeCertificateRequest;
import com.campusvault.entity.*;
import com.campusvault.exception.BadRequestException;
import com.campusvault.exception.UnauthorizedException;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.EventRepository;
import com.campusvault.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EventRepository eventRepository;

    private QrCodeService qrCodeService = new QrCodeService();
    private PdfCertificateService pdfCertificateService = new PdfCertificateService();

    private CertificateService certificateService;

    private User admin;
    private User studentUser1;
    private User studentUser2;
    private Student student1;
    private Event event;

    @BeforeEach
    void setUp() {
        certificateService = new CertificateService(
                certificateRepository,
                studentRepository,
                eventRepository,
                qrCodeService,
                pdfCertificateService
        );
        ReflectionTestUtils.setField(certificateService, "frontendBaseUrl", "http://localhost:5173");
        ReflectionTestUtils.setField(certificateService, "storageUploadDir", "./target/test-storage");

        admin = new User("admin@campusvault.edu", "pass", "Dean Records", Role.ROLE_ADMIN);
        admin.setId(1L);

        studentUser1 = new User("rithika@campusvault.edu", "pass", "A Rithika Reddy", Role.ROLE_STUDENT);
        studentUser1.setId(2L);

        studentUser2 = new User("hacker@other.edu", "pass", "Malicious User", Role.ROLE_STUDENT);
        studentUser2.setId(3L);

        student1 = new Student("AU-2026-00421", studentUser1, "A Rithika Reddy", "rithika@campusvault.edu", "Apex University", "CSE", "4th Year");
        student1.setId(10L);

        event = new Event("EVT-REACT-2026", "React Workshop", EventCategory.WORKSHOP, "React description", LocalDate.of(2026, 9, 21), "Apex University");
        event.setId(20L);
    }

    @Test
    @DisplayName("Should successfully generate certificate and return valid CertificateResponse")
    void testGenerateCertificate() {
        CertificateRequest request = new CertificateRequest();
        request.setStudentId(10L);
        request.setEventId(20L);
        request.setCertificateTitle("Certificate of Completion");
        request.setDescription("Completed training with honors");
        request.setIssueDate(LocalDate.of(2026, 9, 21));

        when(studentRepository.findById(10L)).thenReturn(Optional.of(student1));
        when(eventRepository.findById(20L)).thenReturn(Optional.of(event));
        when(certificateRepository.existsByCertificateId(anyString())).thenReturn(false);
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CertificateResponse response = certificateService.generateCertificate(request, admin);

        assertNotNull(response);
        assertNotNull(response.getCertificateId());
        assertTrue(response.getCertificateId().startsWith("AU-WOR-"));
        assertEquals("Certificate of Completion", response.getCertificateTitle());
        assertEquals("A Rithika Reddy", response.getStudentName());
        assertEquals(CertificateStatus.ACTIVE, response.getStatus());

        verify(certificateRepository, times(1)).save(any(Certificate.class));
    }

    @Test
    @DisplayName("Should enforce role access control: student cannot download another student's certificate")
    void testDownloadAccessControlDenied() {
        Certificate cert = new Certificate(
                "AU-WEB-2026-00421",
                student1, // owned by studentUser1 (ID: 2)
                event,
                "Certificate of Completion",
                "Completed training",
                LocalDate.of(2026, 9, 21),
                "http://localhost:5173/verify/AU-WEB-2026-00421",
                admin
        );

        when(certificateRepository.findByCertificateId("AU-WEB-2026-00421")).thenReturn(Optional.of(cert));

        // studentUser2 (ID: 3) attempts to download student1's certificate
        assertThrows(UnauthorizedException.class, () -> {
            certificateService.downloadPdf("AU-WEB-2026-00421", studentUser2);
        });
    }

    @Test
    @DisplayName("Should revoke active certificate and record administrator reason")
    void testRevokeCertificate() {
        Certificate cert = new Certificate(
                "AU-WEB-2026-00421",
                student1,
                event,
                "Certificate of Completion",
                "Completed training",
                LocalDate.of(2026, 9, 21),
                "http://localhost:5173/verify/AU-WEB-2026-00421",
                admin
        );
        cert.setId(50L);

        when(certificateRepository.findById(50L)).thenReturn(Optional.of(cert));
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(i -> i.getArgument(0));

        RevokeCertificateRequest revokeRequest = new RevokeCertificateRequest("Fraudulent event attendance");
        CertificateResponse response = certificateService.revokeCertificate(50L, revokeRequest, admin);

        assertNotNull(response);
        assertEquals(CertificateStatus.REVOKED, response.getStatus());
        assertEquals("Fraudulent event attendance", response.getRevocationReason());
    }
}
