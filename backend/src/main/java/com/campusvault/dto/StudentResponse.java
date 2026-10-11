package com.campusvault.dto;

import com.campusvault.entity.Student;
import java.time.LocalDateTime;

public class StudentResponse {
    private Long id;
    private String studentId;
    private Long userId;
    private String fullName;
    private String email;
    private String college;
    private String department;
    private String academicYear;
    private String status;
    private long certificateCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentResponse() {}

    public static StudentResponse fromEntity(Student s, long certificateCount) {
        StudentResponse resp = new StudentResponse();
        resp.setId(s.getId());
        resp.setStudentId(s.getStudentId());
        resp.setUserId(s.getUser() != null ? s.getUser().getId() : null);
        resp.setFullName(s.getFullName());
        resp.setEmail(s.getEmail());
        resp.setCollege(s.getCollege());
        resp.setDepartment(s.getDepartment());
        resp.setAcademicYear(s.getAcademicYear());
        resp.setStatus(s.getStatus());
        resp.setCertificateCount(certificateCount);
        resp.setCreatedAt(s.getCreatedAt());
        resp.setUpdatedAt(s.getUpdatedAt());
        return resp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getCertificateCount() {
        return certificateCount;
    }

    public void setCertificateCount(long certificateCount) {
        this.certificateCount = certificateCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
