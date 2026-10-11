package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.PublicVerificationResponse;
import com.campusvault.entity.VerificationMethod;
import com.campusvault.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/certificates")
public class PublicVerificationController {

    private final VerificationService verificationService;

    public PublicVerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<ApiResponse<PublicVerificationResponse>> verifyCertificate(
            @PathVariable String certificateId,
            @RequestParam(required = false, defaultValue = "MANUAL_ID") String method,
            HttpServletRequest request) {

        VerificationMethod verificationMethod;
        try {
            verificationMethod = VerificationMethod.valueOf(method.toUpperCase());
        } catch (Exception e) {
            verificationMethod = VerificationMethod.MANUAL_ID;
        }

        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        } else if (clientIp.contains(",")) {
            clientIp = clientIp.split(",")[0].trim();
        }

        String userAgent = request.getHeader("User-Agent");

        PublicVerificationResponse result = verificationService.verifyCertificate(
                certificateId,
                verificationMethod,
                clientIp,
                userAgent
        );

        return ResponseEntity.ok(ApiResponse.success(
                result.isValid() ? "Certificate authenticity verified" : "Certificate verification completed",
                result
        ));
    }
}
