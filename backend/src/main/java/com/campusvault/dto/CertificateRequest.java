package com.campusvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CertificateRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotBlank(message = "Certificate title is required")
    private String certificateTitle;

    private String description;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    // Optional custom ID prefix if administrator wants to specify (defaults to configured format)
    private String idPrefix;

    // Optional exact custom Certificate ID
    private String customCertificateId;

    public CertificateRequest() {}

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getCertificateTitle() {
        return certificateTitle;
    }

    public void setCertificateTitle(String certificateTitle) {
        this.certificateTitle = certificateTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public String getIdPrefix() {
        return idPrefix;
    }

    public void setIdPrefix(String idPrefix) {
        this.idPrefix = idPrefix;
    }

    public String getCustomCertificateId() {
        return customCertificateId;
    }

    public void setCustomCertificateId(String customCertificateId) {
        this.customCertificateId = customCertificateId;
    }
}
