-- ============================================================
-- CampusVault - Sample Seed Data (For testing & initial setup)
-- Default passwords are BCrypt encrypted for 'Admin@123' and 'Student@123'
-- Hash for 'Admin@123': $2a$10$vNlKzKkG3HkYFfR4rA1Qhe6nSjhLhGg2m2a8Y7mZ7sXy0.U6M7tce
-- Hash for 'Student@123': $2a$10$eE074q4h8hA3bS9eRkmYge9M.xM09R17n8vQ2XgU7E6vT4L1L6g0m
-- ============================================================

USE campusvault;

-- 1. Users
-- Admin user: admin@campusvault.edu / Admin@123
INSERT INTO users (id, email, password, full_name, role, enabled, created_at, updated_at)
VALUES (1, 'admin@campusvault.edu', '$2a$10$8.73pUuPcmzUjO62mO6gUeeQZ8O7G7/C9Vq9ZkL7M4s1Lq/GzK6v2', 'Dean of Academic Records', 'ROLE_ADMIN', TRUE, NOW(), NOW());

-- Student user: rithika@campusvault.edu / Student@123
INSERT INTO users (id, email, password, full_name, role, enabled, created_at, updated_at)
VALUES (2, 'rithika@campusvault.edu', '$2a$10$8.73pUuPcmzUjO62mO6gUeeQZ8O7G7/C9Vq9ZkL7M4s1Lq/GzK6v2', 'A Rithika Reddy', 'ROLE_STUDENT', TRUE, NOW(), NOW());

-- Student 2 user: rohit@campusvault.edu / Student@123
INSERT INTO users (id, email, password, full_name, role, enabled, created_at, updated_at)
VALUES (3, 'rohit@campusvault.edu', '$2a$10$8.73pUuPcmzUjO62mO6gUeeQZ8O7G7/C9Vq9ZkL7M4s1Lq/GzK6v2', 'Rohit Sharma', 'ROLE_STUDENT', TRUE, NOW(), NOW());

-- 2. Students
INSERT INTO students (id, student_id, user_id, full_name, email, college, department, academic_year, status, created_at, updated_at)
VALUES 
(1, 'AU-2026-00421', 2, 'A Rithika Reddy', 'rithika@campusvault.edu', 'Apex University Institute of Technology', 'Computer Science and Engineering', '4th Year (2023-2027)', 'ACTIVE', NOW(), NOW()),
(2, 'AU-2026-00812', 3, 'Rohit Sharma', 'rohit@campusvault.edu', 'Apex University Institute of Technology', 'Information Technology', '3rd Year (2024-2028)', 'ACTIVE', NOW(), NOW());

-- 3. Events
INSERT INTO events (id, event_code, event_name, category, description, event_date, organizer, status, created_at, updated_at)
VALUES
(1, 'EVT-REACT-2026', 'React & Full-Stack Cloud Architecture Workshop', 'WORKSHOP', 'Intensive hands-on workshop covering production React, REST microservices, and modern web application deployment.', '2026-09-21', 'School of Computing & Department of CSE', 'ACTIVE', NOW(), NOW()),
(2, 'EVT-HACK-2026', 'InnovateX 36-Hour National Hackathon', 'HACKATHON', 'National college hackathon solving real-world challenges in decentralized systems and educational tech.', '2026-08-15', 'Apex University Innovation Council', 'ACTIVE', NOW(), NOW()),
(3, 'EVT-AI-2026', 'Advanced Machine Learning & AI Summer Internship', 'INTERNSHIP', '8-week accredited summer training on deep neural networks and practical LLM integration.', '2026-07-30', 'Center for Artificial Intelligence Research', 'COMPLETED', NOW(), NOW());

-- 4. Sample Verified Certificate
INSERT INTO certificates (id, certificate_id, student_id, event_id, certificate_title, description, issue_date, status, qr_code_url, pdf_path, qr_path, issued_by_id, created_at, updated_at)
VALUES 
(1, 'AU-WEB-2026-00421', 1, 1, 'Certificate of Excellence & Completion', 'Successfully completed the intensive 3-day practical training on React and Full-Stack Cloud Architecture with Grade Outstanding (O).', '2026-09-21', 'ACTIVE', 'http://localhost:5173/verify/AU-WEB-2026-00421', 'storage/certificates/AU-WEB-2026-00421.pdf', 'storage/qr/AU-WEB-2026-00421.png', 1, NOW(), NOW());
