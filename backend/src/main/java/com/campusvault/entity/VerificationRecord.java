package com.campusvault.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_records")
public class VerificationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_id", nullable = false, length = 100)
    private String certificateId;

    @Column(name = "verification_timestamp", nullable = false)
    private LocalDateTime verificationTimestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_method", nullable = false, length = 50)
    private VerificationMethod verificationMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_result", nullable = false, length = 50)
    private VerificationResult verificationResult;

    @Column(name = "client_ip", length = 100)
    private String clientIp;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(length = 255)
    private String remarks;

    public VerificationRecord() {}

    public VerificationRecord(String certificateId, VerificationMethod verificationMethod,
                              VerificationResult verificationResult, String clientIp, String userAgent, String remarks) {
        this.certificateId = certificateId;
        this.verificationMethod = verificationMethod;
        this.verificationResult = verificationResult;
        this.clientIp = clientIp;
        this.userAgent = userAgent;
        this.remarks = remarks;
        this.verificationTimestamp = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.verificationTimestamp == null) {
            this.verificationTimestamp = LocalDateTime.now();
        }
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
