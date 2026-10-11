package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.CertificateRequest;
import com.campusvault.dto.CertificateResponse;
import com.campusvault.dto.RevokeCertificateRequest;
import com.campusvault.entity.Role;
import com.campusvault.entity.User;
import com.campusvault.service.AuthService;
import com.campusvault.service.CertificateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CertificateController {

    private final CertificateService certificateService;
    private final AuthService authService;

    public CertificateController(CertificateService certificateService, AuthService authService) {
        this.certificateService = certificateService;
        this.authService = authService;
    }

    // --- Admin Endpoints ---

    @PostMapping("/admin/certificates")
    public ResponseEntity<ApiResponse<CertificateResponse>> generateCertificate(
            @Valid @RequestBody CertificateRequest request,
            Authentication authentication) {
        User admin = authService.getUserByEmail(authentication.getName());
        CertificateResponse cert = certificateService.generateCertificate(request, admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Certificate generated successfully", cert));
    }

    @GetMapping("/admin/certificates")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getAllCertificates(@RequestParam(required = false) String query) {
        List<CertificateResponse> certificates = certificateService.getAllCertificates(query);
        return ResponseEntity.ok(ApiResponse.success("Certificates fetched successfully", certificates));
    }

    @GetMapping("/admin/certificates/{id}")
    public ResponseEntity<ApiResponse<CertificateResponse>> getCertificateById(@PathVariable Long id) {
        CertificateResponse cert = certificateService.getCertificateById(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate details fetched", cert));
    }

    @PostMapping("/admin/certificates/{id}/revoke")
    public ResponseEntity<ApiResponse<CertificateResponse>> revokeCertificate(
            @PathVariable Long id,
            @RequestBody(required = false) RevokeCertificateRequest request,
            Authentication authentication) {
        User admin = authService.getUserByEmail(authentication.getName());
        if (request == null) {
            request = new RevokeCertificateRequest("Revoked by administrator");
        }
        CertificateResponse revoked = certificateService.revokeCertificate(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success("Certificate revoked successfully", revoked));
    }

    @GetMapping("/admin/certificates/{id}/download")
    public ResponseEntity<byte[]> downloadCertificateByAdminId(@PathVariable Long id, Authentication authentication) {
        CertificateResponse certResp = certificateService.getCertificateById(id);
        User admin = authService.getUserByEmail(authentication.getName());
        byte[] pdfBytes = certificateService.downloadPdf(certResp.getCertificateId(), admin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + certResp.getCertificateId() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // --- Student Endpoints ---

    @GetMapping("/student/certificates")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getStudentCertificates(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<CertificateResponse> certs = certificateService.getCertificatesForStudentUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Your certificates loaded", certs));
    }

    @GetMapping("/student/certificates/{id}/download")
    public ResponseEntity<byte[]> downloadStudentCertificateById(@PathVariable Long id, Authentication authentication) {
        CertificateResponse certResp = certificateService.getCertificateById(id);
        User studentUser = authService.getUserByEmail(authentication.getName());
        byte[] pdfBytes = certificateService.downloadPdf(certResp.getCertificateId(), studentUser);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + certResp.getCertificateId() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // --- Public / General Endpoints ---

    @GetMapping("/certificates/{certificateId}/download")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable String certificateId, Authentication authentication) {
        User currentUser = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            try {
                currentUser = authService.getUserByEmail(authentication.getName());
            } catch (Exception ignored) {}
        }

        byte[] pdfBytes = certificateService.downloadPdf(certificateId, currentUser);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + certificateId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/certificates/{certificateId}/qr")
    public ResponseEntity<byte[]> getCertificateQrCode(@PathVariable String certificateId) {
        byte[] qrBytes = certificateService.getQrCodeImage(certificateId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrBytes);
    }
}
