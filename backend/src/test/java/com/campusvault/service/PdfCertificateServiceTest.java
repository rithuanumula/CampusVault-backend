package com.campusvault.service;

import com.campusvault.entity.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class PdfCertificateServiceTest {

    private final PdfCertificateService pdfCertificateService = new PdfCertificateService();
    private final QrCodeService qrCodeService = new QrCodeService();

    @Test
    @DisplayName("Should generate valid OpenPDF binary bytes containing PDF magic header")
    void testGenerateCertificatePdf() {
        User admin = new User("admin@campusvault.edu", "pass", "Dean of Academic Affairs", Role.ROLE_ADMIN);
        User studentUser = new User("student@campusvault.edu", "pass", "A Rithika Reddy", Role.ROLE_STUDENT);

        Student student = new Student(
                "AU-2026-00421",
                studentUser,
                "A Rithika Reddy",
                "student@campusvault.edu",
                "Apex University",
                "Computer Science and Engineering",
                "4th Year"
        );

        Event event = new Event(
                "EVT-REACT-2026",
                "React Workshop",
                EventCategory.WORKSHOP,
                "Intensive Hands-on training",
                LocalDate.of(2026, 9, 21),
                "Department of CSE"
        );

        Certificate cert = new Certificate(
                "AU-WEB-2026-00421",
                student,
                event,
                "Certificate of Excellence",
                "Outstanding completion of workshop",
                LocalDate.of(2026, 9, 21),
                "http://localhost:5173/verify/AU-WEB-2026-00421",
                admin
        );

        byte[] qrBytes = qrCodeService.generateQrCodeImage(cert.getQrCodeUrl(), 200, 200);
        byte[] pdfBytes = pdfCertificateService.generateCertificatePdf(cert, qrBytes);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500);

        // Verify PDF magic header: %PDF-
        assertEquals((byte) '%', pdfBytes[0]);
        assertEquals((byte) 'P', pdfBytes[1]);
        assertEquals((byte) 'D', pdfBytes[2]);
        assertEquals((byte) 'F', pdfBytes[3]);
    }
}
