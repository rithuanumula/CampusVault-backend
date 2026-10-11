# CampusVault System Architecture & Security Design

## 1. System Overview
CampusVault is an enterprise-grade digital credential issuance and verification platform for universities and technical institutions. The platform pairs high-resolution cryptographic PDF certificates with scannable QR codes and real-time MySQL database validation.

```
                      +---------------------------------------+
                      |           React Frontend              |
                      |  - Vite, React Router, Axios, CSS3   |
                      |  - QR Scanner (html5-qrcode)          |
                      +-------------------+-------------------+
                                          |
                        HTTP / REST APIs  |  Bearer JWT Tokens
                                          v
                      +---------------------------------------+
                      |       Spring Boot 3.3 Backend         |
                      |  - Layered Architecture               |
                      |  - Spring Security & BCrypt           |
                      |  - JJWT Token Engine                  |
                      |  - ZXing QR Generator                 |
                      |  - OpenPDF Certificate Engine         |
                      +-------------------+-------------------+
                                          |
                         JPA / Hibernate  |  Hikari Connection Pool
                                          v
                      +---------------------------------------+
                      |         MySQL 8.0 Database            |
                      |  - Users, Students, Events,           |
                      |    Certificates, Audit Logs           |
                      +---------------------------------------+
```

---

## 2. Layered Backend Architecture

- **Controller Layer (`com.campusvault.controller`)**: Exposes REST endpoints, validates DTO inputs with Bean Validation (`@Valid`), maps HTTP verbs and status codes (`200 OK`, `201 Created`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).
- **Service Layer (`com.campusvault.service`)**: Encapsulates transactional business logic, unique ID generation with collision retry, PDF vector rendering, ZXing barcode matrix generation, and role access control safeguards.
- **Repository Layer (`com.campusvault.repository`)**: Spring Data JPA interfaces with derived and JPQL search queries.
- **Entity Layer (`com.campusvault.entity`)**: Normalized relational mappings for `User`, `Student`, `Event`, `Certificate`, and `VerificationRecord`.
- **Security Layer (`com.campusvault.security`)**: Stateless JWT authentication filter, DaoAuthenticationProvider, BCrypt password hashing, and role-based endpoint authorization.
- **Exception Layer (`com.campusvault.exception`)**: `@RestControllerAdvice` global handler capturing exceptions and providing standardized JSON error objects without leaking internal traces.

---

## 3. Certificate Generation & Verification Engine

1. **Unique ID Strategy**:
   - Format: `{PREFIX}-{YEAR}-{5_DIGIT_SEQUENCE}` (e.g. `AU-WEB-2026-00421`).
   - Prefix dynamically computed from event category or customizable by registrar.
   - Enforced by database `UNIQUE` constraint and service-layer collision check.
2. **ZXing QR Code**:
   - URL: `http://localhost:5173/verify/{certificateId}`.
   - Encoded as error-corrected PNG matrix and embedded in OpenPDF canvas.
3. **OpenPDF Certificate**:
   - Landscape A4 vector canvas.
   - Double ornamental border in deep forest green (`#0E382C`) and metallic gold (`#C59B27`).
   - Institutional banner, recipient name, event acknowledgment, official signatures, and embedded verification QR code.
4. **Tamper-Evident Verification**:
   - The public verification service never trusts QR data or client params. It looks up the live record in MySQL.
   - If marked `REVOKED`, returns `REVOKED` status and administrator justification.
   - Logs every attempt to `verification_records` with client IP, timestamp, and method (`QR` vs `MANUAL_ID`).
