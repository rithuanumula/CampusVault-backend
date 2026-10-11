package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.VerificationHistoryResponse;
import com.campusvault.service.VerificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class VerificationHistoryController {

    private final VerificationService verificationService;

    public VerificationHistoryController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/verifications")
    public ResponseEntity<ApiResponse<Page<VerificationHistoryResponse>>> getVerificationHistory(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)));
        Page<VerificationHistoryResponse> historyPage = verificationService.getVerificationHistory(query, pageable);

        return ResponseEntity.ok(ApiResponse.success("Verification audit history fetched", historyPage));
    }
}
