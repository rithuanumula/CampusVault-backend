package com.campusvault.dto;

import com.campusvault.entity.VerificationMethod;
import com.campusvault.entity.VerificationRecord;
import com.campusvault.entity.VerificationResult;
import java.time.LocalDateTime;

public class VerificationHistoryResponse {
    private Long id;
    private String certificateId;
    private LocalDateTime verificationTimestamp;
    private VerificationMethod verificationMethod;
    private VerificationResult verificationResult;
    private String clientIp;
    private String userAgent;
    private String remarks;

    public VerificationHistoryResponse() {}

    public static VerificationHistoryResponse fromEntity(VerificationRecord rec) {
        VerificationHistoryResponse resp = new VerificationHistoryResponse();
        resp.setId(rec.getId());
        resp.setCertificateId(rec.getCertificateId());
        resp.setVerificationTimestamp(rec.getVerificationTimestamp());
        resp.setVerificationMethod(rec.getVerificationMethod());
        resp.setVerificationResult(rec.getVerificationResult());
        resp.setClientIp(rec.getClientIp());
        resp.setUserAgent(rec.getUserAgent());
        resp.setRemarks(rec.getRemarks());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public LocalDateTime getVerificationTimestamp() {
        return verificationTimestamp;
    }

    public void setVerificationTimestamp(LocalDateTime verificationTimestamp) {
        this.verificationTimestamp = verificationTimestamp;
    }

    public VerificationMethod getVerificationMethod() {
        return verificationMethod;
    }

    public void setVerificationMethod(VerificationMethod verificationMethod) {
        this.verificationMethod = verificationMethod;
    }

    public VerificationResult getVerificationResult() {
        return verificationResult;
    }

    public void setVerificationResult(VerificationResult verificationResult) {
        this.verificationResult = verificationResult;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
