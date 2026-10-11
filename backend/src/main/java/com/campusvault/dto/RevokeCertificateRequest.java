package com.campusvault.dto;

import jakarta.validation.constraints.NotBlank;

public class RevokeCertificateRequest {

    @NotBlank(message = "Revocation reason is required")
    private String reason;

    public RevokeCertificateRequest() {}

    public RevokeCertificateRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
