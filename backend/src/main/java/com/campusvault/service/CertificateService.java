package com.campusvault.service;

import com.campusvault.dto.CertificateRequest;
import com.campusvault.dto.CertificateResponse;
import com.campusvault.dto.RevokeCertificateRequest;
import com.campusvault.entity.*;
import com.campusvault.exception.BadRequestException;
import com.campusvault.exception.ConflictException;
import com.campusvault.exception.ResourceNotFoundException;
import com.campusvault.exception.UnauthorizedException;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.EventRepository;
import com.campusvault.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final QrCodeService qrCodeService;
    private final PdfCertificateService pdfCertificateService;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    @Value("${app.storage.upload-dir:./storage}")
    private String storageUploadDir;

    public CertificateService(CertificateRepository certificateRepository,
                              StudentRepository studentRepository,
                              EventRepository eventRepository,
                              QrCodeService qrCodeService,
                              PdfCertificateService pdfCertificateService) {
        this.certificateRepository = certificateRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
        this.qrCodeService = qrCodeService;
        this.pdfCertificateService = pdfCertificateService;
    }

    public List<CertificateResponse> getAllCertificates(String query) {
        List<Certificate> certs;
        if (query != null && !query.isBlank()) {
            certs = certificateRepository.searchCertificates(query.trim());
        } else {
            certs = certificateRepository.findAllByOrderByCreatedAtDesc();
        }
        return certs.stream().map(CertificateResponse::fromEntity).collect(Collectors.toList());
    }

    public CertificateResponse getCertificateById(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));
        return CertificateResponse.fromEntity(cert);
    }

    public CertificateResponse getCertificateByCertificateId(String certificateId) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with Certificate ID: " + certificateId));
        return CertificateResponse.fromEntity(cert);
    }

    public List<CertificateResponse> getCertificatesForStudentUser(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return certificateRepository.findByStudentIdOrderByIssueDateDesc(student.getId()).stream()
                .map(CertificateResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificateResponse generateCertificate(CertificateRequest request, User admin) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentId()));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        // Generate or use custom Certificate ID
        String certificateId;
        if (request.getCustomCertificateId() != null && !request.getCustomCertificateId().isBlank()) {
            certificateId = request.getCustomCertificateId().trim().toUpperCase();
            if (certificateRepository.existsByCertificateId(certificateId)) {
                throw new ConflictException("Certificate ID " + certificateId + " already exists in the system.");
            }
        } else {
            certificateId = generateUniqueCertificateId(request.getIdPrefix(), event);
        }

        // Verification URL
        String verificationUrl = frontendBaseUrl + "/verify/" + certificateId;

        // Build Certificate entity
        Certificate cert = new Certificate(
                certificateId,
                student,
                event,
                request.getCertificateTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getIssueDate() != null ? request.getIssueDate() : LocalDate.now(),
                verificationUrl,
                admin
        );

        // Generate QR code bytes
        byte[] qrBytes = qrCodeService.generateQrCodeImage(verificationUrl, 300, 300);

        // Generate PDF bytes
        byte[] pdfBytes = pdfCertificateService.generateCertificatePdf(cert, qrBytes);

        // Store files in filesystem
        ensureStorageDirectories();
        String pdfFileName = "cert_" + certificateId.replaceAll("[^a-zA-Z0-9-]", "_") + ".pdf";
        String qrFileName = "qr_" + certificateId.replaceAll("[^a-zA-Z0-9-]", "_") + ".png";

        Path pdfPath = Paths.get(storageUploadDir, "certificates", pdfFileName);
        Path qrPath = Paths.get(storageUploadDir, "qr", qrFileName);

        try {
            Files.write(pdfPath, pdfBytes);
            Files.write(qrPath, qrBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to persist certificate media files: " + e.getMessage(), e);
        }

        cert.setPdfPath(pdfPath.toString());
        cert.setQrPath(qrPath.toString());

        Certificate saved = certificateRepository.save(cert);
        return CertificateResponse.fromEntity(saved);
    }

    @Transactional
    public CertificateResponse revokeCertificate(Long id, RevokeCertificateRequest request, User admin) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));

        if (cert.getStatus() == CertificateStatus.REVOKED) {
            throw new BadRequestException("Certificate " + cert.getCertificateId() + " is already revoked.");
        }

        cert.setStatus(CertificateStatus.REVOKED);
        cert.setRevocationReason(request.getReason() != null ? request.getReason().trim() : "Revoked by administrator");
        cert.setRevokedAt(LocalDateTime.now());
        cert.setRevokedBy(admin);

        Certificate updated = certificateRepository.save(cert);
        return CertificateResponse.fromEntity(updated);
    }

    public byte[] downloadPdf(String certificateId, User currentUser) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + certificateId));

        // If user is a student, ensure they only download their own certificate
        if (currentUser != null && currentUser.getRole() == Role.ROLE_STUDENT) {
            if (cert.getStudent().getUser() == null || !cert.getStudent().getUser().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("Access denied: You can only download your own certificates.");
            }
        }

        // Check if PDF exists on disk; if not, re-generate on the fly
        if (cert.getPdfPath() != null) {
            File file = new File(cert.getPdfPath());
            if (file.exists()) {
                try {
                    return Files.readAllBytes(file.toPath());
                } catch (IOException ignored) {}
            }
        }

        // Regenerate if file missing
        byte[] qrBytes = qrCodeService.generateQrCodeImage(cert.getQrCodeUrl(), 300, 300);
        return pdfCertificateService.generateCertificatePdf(cert, qrBytes);
    }

    public byte[] getQrCodeImage(String certificateId) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found: " + certificateId));

        if (cert.getQrPath() != null) {
            File file = new File(cert.getQrPath());
            if (file.exists()) {
                try {
                    return Files.readAllBytes(file.toPath());
                } catch (IOException ignored) {}
            }
        }

        return qrCodeService.generateQrCodeImage(cert.getQrCodeUrl(), 300, 300);
    }

    private String generateUniqueCertificateId(String customPrefix, Event event) {
        String prefix;
        if (customPrefix != null && !customPrefix.isBlank()) {
            prefix = customPrefix.trim().toUpperCase();
        } else {
            String catCode = event.getCategory() != null ?
                    event.getCategory().name().substring(0, Math.min(3, event.getCategory().name().length())) : "GEN";
            prefix = "AU-" + catCode;
        }

        int year = LocalDate.now().getYear();
        Random random = new Random();

        for (int attempt = 0; attempt < 10; attempt++) {
            int seq = 10000 + random.nextInt(90000);
            String candidateId = prefix + "-" + year + "-" + String.format("%05d", seq);
            if (!certificateRepository.existsByCertificateId(candidateId)) {
                return candidateId;
            }
        }

        // Fallback with timestamp to guarantee uniqueness
        return prefix + "-" + year + "-" + (System.currentTimeMillis() % 100000);
    }

    private void ensureStorageDirectories() {
        try {
            Files.createDirectories(Paths.get(storageUploadDir, "certificates"));
            Files.createDirectories(Paths.get(storageUploadDir, "qr"));
        } catch (IOException e) {
            throw new RuntimeException("Could not create storage directories: " + e.getMessage(), e);
        }
    }
}
