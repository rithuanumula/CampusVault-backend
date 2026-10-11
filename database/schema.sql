-- ============================================================
-- CampusVault - Database Schema Initialization (MySQL 8.0+)
-- ============================================================

CREATE DATABASE IF NOT EXISTS campusvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusvault;

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS verification_records;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Students Table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    college VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_code (student_id),
    INDEX idx_student_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Events Table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_code VARCHAR(50) NOT NULL UNIQUE,
    event_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    organizer VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_code (event_code),
    INDEX idx_event_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Certificates Table
CREATE TABLE certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_id VARCHAR(100) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    certificate_title VARCHAR(200) NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    qr_code_url VARCHAR(500) NOT NULL,
    pdf_path VARCHAR(500),
    qr_path VARCHAR(500),
    issued_by_id BIGINT NOT NULL,
    revocation_reason TEXT,
    revoked_at DATETIME,
    revoked_by_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cert_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cert_issued_by FOREIGN KEY (issued_by_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cert_revoked_by FOREIGN KEY (revoked_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_cert_id (certificate_id),
    INDEX idx_cert_status (status),
    INDEX idx_cert_student_fk (student_id),
    INDEX idx_cert_event_fk (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Verification Records Table
CREATE TABLE verification_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_id VARCHAR(100) NOT NULL,
    verification_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_method VARCHAR(50) NOT NULL,
    verification_result VARCHAR(50) NOT NULL,
    client_ip VARCHAR(100),
    user_agent VARCHAR(500),
    remarks VARCHAR(255),
    INDEX idx_verif_cert_id (certificate_id),
    INDEX idx_verif_timestamp (verification_timestamp),
    INDEX idx_verif_result (verification_result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
