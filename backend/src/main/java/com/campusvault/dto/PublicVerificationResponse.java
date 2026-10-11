package com.campusvault.dto;

import com.campusvault.entity.EventCategory;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PublicVerificationResponse {
    private String status; // VERIFIED, REVOKED, INVALID
    private boolean valid;
    private String certificateId;
    private String studentName;
    private String studentDepartment;
    private String institutionName;
    private String eventName;
    private EventCategory eventCategory;
    private String eventOrganizer;
    private String certificateTitle;
    private String description;
    private LocalDate issueDate;
    private LocalDateTime verifiedAt;
    private String revocationReason;
    private LocalDateTime revokedAt;
    private String message;

    public PublicVerificationResponse() {}

    public static PublicVerificationResponse verified(
            String certificateId,
            String studentName,
            String studentDepartment,
            String institutionName,
            String eventName,
            EventCategory eventCategory,
            String eventOrganizer,
            String certificateTitle,
            String description,
            LocalDate issueDate) {
        PublicVerificationResponse resp = new PublicVerificationResponse();
        resp.setStatus("VERIFIED");
        resp.setValid(true);
        resp.setCertificateId(certificateId);
        resp.setStudentName(studentName);
        resp.setStudentDepartment(studentDepartment);
        resp.setInstitutionName(institutionName);
        resp.setEventName(eventName);
        resp.setEventCategory(eventCategory);
        resp.setEventOrganizer(eventOrganizer);
        resp.setCertificateTitle(certificateTitle);
        resp.setDescription(description);
        resp.setIssueDate(issueDate);
        resp.setVerifiedAt(LocalDateTime.now());
        resp.setMessage("Authentic digital certificate verified by CampusVault registry.");
        return resp;
    }

    public static PublicVerificationResponse revoked(String certificateId, String revocationReason, LocalDateTime revokedAt, String institutionName, String studentName) {
        PublicVerificationResponse resp = new PublicVerificationResponse();
        resp.setStatus("REVOKED");
        resp.setValid(false);
        resp.setCertificateId(certificateId);
        resp.setInstitutionName(institutionName);
        resp.setStudentName(studentName);
        resp.setRevocationReason(revocationReason);
        resp.setRevokedAt(revokedAt);
        resp.setVerifiedAt(LocalDateTime.now());
        resp.setMessage("Warning: This certificate has been officially REVOKED by the issuing institution.");
        return resp;
    }

    public static PublicVerificationResponse notFound(String certificateId) {
        PublicVerificationResponse resp = new PublicVerificationResponse();
        resp.setStatus("INVALID");
        resp.setValid(false);
        resp.setCertificateId(certificateId);
        resp.setVerifiedAt(LocalDateTime.now());
        resp.setMessage("Certificate record not found. The provided Certificate ID does not match any official credential in the CampusVault registry.");
        return resp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public void setStudentDepartment(String studentDepartment) {
        this.studentDepartment = studentDepartment;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public EventCategory getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(EventCategory eventCategory) {
        this.eventCategory = eventCategory;
    }

    public String getEventOrganizer() {
        return eventOrganizer;
    }

    public void setEventOrganizer(String eventOrganizer) {
        this.eventOrganizer = eventOrganizer;
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

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void setRevocationReason(String revocationReason) {
        this.revocationReason = revocationReason;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(LocalDateTime revokedAt) {
        this.revokedAt = revokedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
