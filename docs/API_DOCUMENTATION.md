# CampusVault — REST API Specification

**Base URL**: `http://localhost:8080/api`  
**Authentication Scheme**: Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints

### 1.1 Institutional Login
- **URL**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@campusvault.edu",
    "password": "Admin@123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzM4NCJ9...",
      "type": "Bearer",
      "id": 1,
      "email": "admin@campusvault.edu",
      "role": "ROLE_ADMIN",
      "fullName": "System Administrator",
      "studentId": null
    }
  }
  ```

### 1.2 Student Self-Registration
- **URL**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "fullName": "A Rithika Reddy",
    "email": "student@campusvault.edu",
    "password": "Student@123",
    "studentId": "AU-2026-00421",
    "college": "Apex University Institute of Technology",
    "department": "Computer Science and Engineering",
    "academicYear": "4th Year (2023-2027)"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "token": "eyJhbGciOiJIUzM4NCJ9...",
      "role": "ROLE_STUDENT",
      "fullName": "A Rithika Reddy"
    }
  }
  ```

### 1.3 Get Current User Profile
- **URL**: `GET /auth/me`
- **Access**: Authenticated (Bearer Token)
- **Response** (`200 OK`): User and student profile details.

---

## 2. Public Certificate Verification

### 2.1 Verify Certificate by ID
- **URL**: `GET /public/certificates/verify/{certificateId}?method={MANUAL_ID|QR}`
- **Access**: Public (No Login Required)
- **Parameters**:
  - `certificateId` (Path): e.g. `AU-WEB-2026-00421`
  - `method` (Query): `MANUAL_ID` or `QR` (Default: `MANUAL_ID`)
- **Response — Valid Certificate** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Certificate authenticity verified",
    "data": {
      "status": "VERIFIED",
      "valid": true,
      "certificateId": "AU-WEB-2026-00421",
      "studentName": "A Rithika Reddy",
      "studentDepartment": "Computer Science and Engineering",
      "institutionName": "Apex University Institute of Technology",
      "eventName": "React & Full-Stack Cloud Architecture Workshop",
      "eventCategory": "WORKSHOP",
      "eventOrganizer": "School of Computing & Department of CSE",
      "certificateTitle": "Certificate of Excellence & Completion",
      "description": "Successfully demonstrated superior expertise in Full-Stack Web Engineering...",
      "issueDate": "2026-09-21",
      "verifiedAt": "2026-10-12T00:16:10.490693",
      "message": "Authentic digital certificate verified by CampusVault registry."
    }
  }
  ```
- **Response — Revoked Certificate** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "status": "REVOKED",
      "valid": false,
      "certificateId": "AU-WEB-2026-00421",
      "revocationReason": "Violation of academic honor code",
      "revokedAt": "2026-10-12T01:00:00"
    }
  }
  ```
- **Response — Nonexistent / Invalid** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "status": "INVALID",
      "valid": false,
      "certificateId": "NONEXISTENT",
      "message": "Certificate record not found. The provided Certificate ID does not match any official credential in the CampusVault registry."
    }
  }
  ```

---

## 3. Certificate Issuance & Media

### 3.1 Issue New Certificate
- **URL**: `POST /admin/certificates`
- **Access**: Role `ADMIN`
- **Request Body**:
  ```json
  {
    "studentId": 1,
    "eventId": 1,
    "certificateTitle": "Certificate of Excellence & Completion",
    "description": "Demonstrated outstanding leadership in building decentralized systems.",
    "issueDate": "2026-09-21",
    "idPrefix": "AU-WEB"
  }
  ```
- **Response** (`201 Created`): Returns complete CertificateResponse object with generated unique ID, QR code URL, and PDF download reference.

### 3.2 List All Issued Certificates
- **URL**: `GET /admin/certificates?query={optionalSearch}`
- **Access**: Role `ADMIN`

### 3.3 Revoke Certificate
- **URL**: `POST /admin/certificates/{id}/revoke`
- **Access**: Role `ADMIN`
- **Request Body**:
  ```json
  {
    "reason": "Transcript record adjustment requested by Registrar Office"
  }
  ```

### 3.4 Download PDF Certificate
- **URL**: `GET /certificates/{certificateId}/download`
- **Access**: Public / Authenticated
- **Content-Type**: `application/pdf` (binary stream generated via OpenPDF)

### 3.5 Retrieve QR Code Image
- **URL**: `GET /certificates/{certificateId}/qr`
- **Access**: Public / Authenticated
- **Content-Type**: `image/png` (binary stream generated via ZXing)

---

## 4. Student Credential APIs

### 4.1 Get Logged-in Student Certificates
- **URL**: `GET /student/certificates`
- **Access**: Role `STUDENT` (Access control strictly filters to authenticated user)

### 4.2 Download Student Certificate by Database ID
- **URL**: `GET /student/certificates/{id}/download`
- **Access**: Role `STUDENT` (Access control ensures student owns the certificate)

### 4.3 Get Student Profile
- **URL**: `GET /student/profile`
- **Access**: Role `STUDENT`

---

## 5. Event Management APIs

### 5.1 List Events
- **URL**: `GET /events?query={optionalSearch}`
- **Access**: Public / Authenticated

### 5.2 Create Event
- **URL**: `POST /admin/events`
- **Access**: Role `ADMIN`
- **Request Body**:
  ```json
  {
    "eventName": "InnovateX 36-Hour National Hackathon",
    "category": "HACKATHON",
    "eventDate": "2026-08-15",
    "organizer": "Apex University Innovation Council",
    "description": "National college hackathon on decentralized systems."
  }
  ```

### 5.3 Update Event
- **URL**: `PUT /admin/events/{id}`
- **Access**: Role `ADMIN`

### 5.4 Delete Event
- **URL**: `DELETE /admin/events/{id}`
- **Access**: Role `ADMIN` (Safeguard: Blocked if certificates have been issued for this event)

---

## 6. Student Management APIs (Admin)

### 6.1 List Students
- **URL**: `GET /admin/students?query={optionalSearch}`
- **Access**: Role `ADMIN`

### 6.2 Provision Student
- **URL**: `POST /admin/students`
- **Access**: Role `ADMIN`

### 6.3 Update Student
- **URL**: `PUT /admin/students/{id}`
- **Access**: Role `ADMIN`

---

## 7. Audit & Analytics APIs

### 7.1 Dashboard Statistics
- **URL**: `GET /admin/stats`
- **Access**: Role `ADMIN`
- **Response**: Aggregated counts of students, events, certificates, verifications, active/revoked, and recent logs.

### 7.2 Verification Audit Logs
- **URL**: `GET /admin/verifications?query={optional}&page=0&size=15`
- **Access**: Role `ADMIN`
- **Response**: Paginated table of verification attempts, methods (QR / MANUAL_ID), results, client IP addresses, and timestamps.
