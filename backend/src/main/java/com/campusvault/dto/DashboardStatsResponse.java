package com.campusvault.dto;

import java.util.List;

public class DashboardStatsResponse {
    private long totalStudents;
    private long totalEvents;
    private long totalCertificates;
    private long totalVerifications;
    private long activeCertificates;
    private long revokedCertificates;
    private List<CertificateResponse> recentCertificates;
    private List<VerificationHistoryResponse> recentVerifications;

    public DashboardStatsResponse() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalCertificates() {
        return totalCertificates;
    }

    public void setTotalCertificates(long totalCertificates) {
        this.totalCertificates = totalCertificates;
    }

    public long getTotalVerifications() {
        return totalVerifications;
    }

    public void setTotalVerifications(long totalVerifications) {
        this.totalVerifications = totalVerifications;
    }

    public long getActiveCertificates() {
        return activeCertificates;
    }

    public void setActiveCertificates(long activeCertificates) {
        this.activeCertificates = activeCertificates;
    }

    public long getRevokedCertificates() {
        return revokedCertificates;
    }

    public void setRevokedCertificates(long revokedCertificates) {
        this.revokedCertificates = revokedCertificates;
    }

    public List<CertificateResponse> getRecentCertificates() {
        return recentCertificates;
    }

    public void setRecentCertificates(List<CertificateResponse> recentCertificates) {
        this.recentCertificates = recentCertificates;
    }

    public List<VerificationHistoryResponse> getRecentVerifications() {
        return recentVerifications;
    }

    public void setRecentVerifications(List<VerificationHistoryResponse> recentVerifications) {
        this.recentVerifications = recentVerifications;
    }
}
