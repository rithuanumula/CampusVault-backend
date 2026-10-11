package com.campusvault.dto;

import com.campusvault.entity.Certificate;
import com.campusvault.entity.CertificateStatus;
import com.campusvault.entity.EventCategory;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CertificateResponse {
    private Long id;
    private String certificateId;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private String studentEmail;
    private String studentCollege;
    private String studentDepartment;
    private Long eventId;
    private String eventCode;
    private String eventName;
    private EventCategory eventCategory;
    private String eventOrganizer;
    private String certificateTitle;
    private String description;
    private LocalDate issueDate;
    private CertificateStatus status;
    private String qrCodeUrl;
    private String pdfDownloadUrl;
    private String issuedByAdminName;
    private String revocationReason;
    private LocalDateTime revokedAt;
    private String revokedByAdminName;
    private LocalDateTime createdAt;

    public CertificateResponse() {}

    public static CertificateResponse fromEntity(Certificate cert) {
        CertificateResponse resp = new CertificateResponse();
        resp.setId(cert.getId());
        resp.setCertificateId(cert.getCertificateId());

        if (cert.getStudent() != null) {
            resp.setStudentId(cert.getStudent().getId());
            resp.setStudentCode(cert.getStudent().getStudentId());
            resp.setStudentName(cert.getStudent().getFullName());
            resp.setStudentEmail(cert.getStudent().getEmail());
            resp.setStudentCollege(cert.getStudent().getCollege());
            resp.setStudentDepartment(cert.getStudent().getDepartment());
        }

        if (cert.getEvent() != null) {
            resp.setEventId(cert.getEvent().getId());
            resp.setEventCode(cert.getEvent().getEventCode());
            resp.setEventName(cert.getEvent().getEventName());
            resp.setEventCategory(cert.getEvent().getCategory());
            resp.setEventOrganizer(cert.getEvent().getOrganizer());
        }

        resp.setCertificateTitle(cert.getCertificateTitle());
        resp.setDescription(cert.getDescription());
        resp.setIssueDate(cert.getIssueDate());
        resp.setStatus(cert.getStatus());
        resp.setQrCodeUrl(cert.getQrCodeUrl());
        resp.setPdfDownloadUrl("/api/certificates/" + cert.getCertificateId() + "/download");

        if (cert.getIssuedBy() != null) {
            resp.setIssuedByAdminName(cert.getIssuedBy().getFullName());
        }

        resp.setRevocationReason(cert.getRevocationReason());
        resp.setRevokedAt(cert.getRevokedAt());

        if (cert.getRevokedBy() != null) {
            resp.setRevokedByAdminName(cert.getRevokedBy().getFullName());
        }

        resp.setCreatedAt(cert.getCreatedAt());
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentCollege() {
        return studentCollege;
    }

    public void setStudentCollege(String studentCollege) {
        this.studentCollege = studentCollege;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public void setStudentDepartment(String studentDepartment) {
        this.studentDepartment = studentDepartment;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventCode() {
        return eventCode;
    }

    public void setEventCode(String eventCode) {
        this.eventCode = eventCode;
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

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public String getPdfDownloadUrl() {
        return pdfDownloadUrl;
    }

    public void setPdfDownloadUrl(String pdfDownloadUrl) {
        this.pdfDownloadUrl = pdfDownloadUrl;
    }

    public String getIssuedByAdminName() {
        return issuedByAdminName;
    }

    public void setIssuedByAdminName(String issuedByAdminName) {
        this.issuedByAdminName = issuedByAdminName;
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

    public String getRevokedByAdminName() {
        return revokedByAdminName;
    }

    public void setRevokedByAdminName(String revokedByAdminName) {
        this.revokedByAdminName = revokedByAdminName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
