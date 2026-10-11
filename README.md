# CampusVault — Digital Certificate Verification System

[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue.svg)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Security-Spring%20Security%20%2B%20JWT-red.svg)](https://spring.io/projects/spring-security)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

**CampusVault** is a full-stack digital certificate issuance, management, and verification platform for universities and higher education institutions. It pairs tamper-evident MySQL relational records with cryptographic PDF generation (OpenPDF) and camera-scannable QR codes (ZXing) to eliminate fake credentials and streamline verification for recruiters and employers.

---

## 1. Project Directory Structure

```text
CampusVault/
├── backend/                             # Java Spring Boot 3.3 Application
│   ├── src/main/java/com/campusvault/
│   │   ├── config/                      # Security, CORS, DataInitializer
│   │   ├── controller/                  # REST Controllers
│   │   ├── dto/                         # Request & Response Data Transfer Objects
│   │   ├── entity/                      # JPA Entities (User, Student, Event, Certificate, etc.)
│   │   ├── exception/                   # Global exception handling & API error formats
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JWT Service, Custom UserDetails, Auth Filter
│   │   └── service/                     # Business logic, ZXing QR & OpenPDF generation
│   ├── src/main/resources/
│   │   ├── application.properties       # Primary MySQL & security properties
│   │   └── application-test.properties  # In-memory H2 test profile
│   ├── src/test/java/                   # JUnit 5 & Mockito test suite (15 tests)
│   └── pom.xml                          # Maven build dependencies
├── frontend/                            # React.js 19 + Vite Web Application
│   ├── src/
│   │   ├── api/                         # Axios client & REST service modules
│   │   ├── components/                  # Navbar, Footer, QrScannerModal, ProtectedRoute
│   │   ├── context/                     # AuthContext, ToastContext
│   │   ├── pages/                       # LandingPage, PublicVerifyPage, Admin & Student pages
│   │   ├── tests/                       # Vitest & Testing-Library frontend tests (5 tests)
│   │   └── index.css                    # Design system (Forest green, gold, soft mint)
│   ├── package.json                     # NPM dependencies
│   ├── vite.config.js                   # Vite dev server & proxy settings
│   └── vitest.config.js                 # Frontend test configuration
├── database/
│   ├── schema.sql                       # MySQL 8.0 schema definition script
│   └── seed.sql                         # Sample seed dataset
├── docs/
│   ├── API_DOCUMENTATION.md             # Complete REST API specification
│   └── ARCHITECTURE.md                  # System architecture & security model
├── .gitignore
└── README.md                            # Comprehensive setup & run instructions
```

---

## 2. Technology Stack

- **Frontend**: React.js 19, React Router 7, Axios, Lucide React icons, `html5-qrcode` (camera QR scanner), `canvas-confetti` (verification animations), Vanilla CSS3 Design System.
- **Backend**: Java 21+, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate ORM 6.5, Maven 3.9.
- **Authentication**: Stateless Bearer JWT (`io.jsonwebtoken` 0.12), BCrypt password hashing, Role-Based Access Control (`ROLE_ADMIN`, `ROLE_STUDENT`).
- **Database**: MySQL 8.0 Community Server.
- **QR Code Engine**: Google ZXing 3.5.3 (High error correction level `H`).
- **PDF Certificate Engine**: OpenPDF 2.0.3 (Landscape A4 vector canvas with decorative borders and embedded QR code).

---

## 3. Prerequisites

Before running the application, make sure you have:
1. **Java JDK 21+** (`java -version`)
2. **Apache Maven 3.8+** (`mvn -version`)
3. **Node.js 18+ and npm** (`node -v`, `npm -v`)
4. **MySQL 8.0+** running on `localhost:3306`

---

## 4. Database Setup (MySQL 8)

1. Open your terminal or MySQL command line client:
   ```bash
   mysql -u root -p
   ```
2. Create the `campusvault` database:
   ```sql
   CREATE DATABASE campusvault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. *(Optional)* If you wish to manually initialize the schema and seed data via SQL, run:
   ```bash
   mysql -u root -p campusvault < database/schema.sql
   mysql -u root -p campusvault < database/seed.sql
   ```
   *(Note: The Spring Boot application will automatically create/update tables and seed the initial development dataset on startup via `DataInitializer.java`.)*

---

## 5. Environment Variables & Configuration

### Backend Configuration (`backend/src/main/resources/application.properties`)
The following environment variables can be set or overridden:

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/campusvault?...` | MySQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `password` | Database password |
| `JWT_SECRET` | `4c616d7075735661...` | Base64 HMAC-SHA signing secret |
| `JWT_EXPIRATION_MS` | `86400000` | Token expiration (24 hours) |
| `FRONTEND_BASE_URL` | `http://localhost:5173` | URL embedded in scannable QR codes |
| `ADMIN_INIT_EMAIL` | `admin@campusvault.edu` | Auto-seeded admin email |
| `ADMIN_INIT_PASSWORD` | `Admin@123` | Auto-seeded admin password |

### Frontend Configuration (`frontend/.env`)
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 6. How to Start the Application

### Step 1: Start the Spring Boot Backend
Open a terminal in the project root:
```bash
cd backend
mvn spring-boot:run
```
The backend starts on port **8080**.  
You will see log output indicating that tables are initialized and the sample admin account and sample certificate `AU-WEB-2026-00421` have been seeded.

### Step 2: Start the React Frontend
Open a new terminal tab in the project root:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server starts on **http://localhost:5173**.

---

## 7. Pre-Configured Demo Accounts

To facilitate instant testing and evaluation, 1-click credential buttons are available directly on the login page:

| Role | Email | Password | Pre-loaded Data |
|---|---|---|---|
| **Administrator** | `admin@campusvault.edu` | `Admin@123` | Full access to stats, event creation, student registration, certificate issuance, and revocation. |
| **Student** | `rithika@campusvault.edu` | `Student@123` | Profile for A Rithika Reddy (`AU-2026-00421`), certificate history, direct PDF download. |
| **Public Verifier** | *No login needed* | *No login needed* | Can scan QR codes or type IDs on `http://localhost:5173/verify`. |

---

## 8. Verifying the End-to-End Workflow

1. **Public Verification**:
   - Visit `http://localhost:5173/verify`.
   - Enter `AU-WEB-2026-00421` and click **Verify ID** (or click the sample button).
   - The verified card displays with an emerald green badge, recipient name (*A Rithika Reddy*), event details (*React & Full-Stack Cloud Architecture Workshop*), and a **Download Official PDF** button.
2. **Camera QR Scanning**:
   - On the verification page, click **Scan QR**.
   - Your device camera opens; point it at any CampusVault QR code to immediately verify.
3. **Admin Credential Issuance**:
   - Log into `http://localhost:5173/login` using the Admin demo button.
   - Go to **Issue Certificate** (`/admin/certificates/new`).
   - Select a student, select an event, write a description, and click **Generate & Issue Certificate**.
   - A unique ID (e.g. `AU-WOR-2026-XXXXX`) is minted, QR code is generated, and OpenPDF certificate is compiled.
4. **Certificate Revocation**:
   - Go to **Certificates** (`/admin/certificates`).
   - Click the red shield icon on any active certificate.
   - Enter a revocation reason (e.g. *Academic integrity review*) and confirm.
   - Visit `http://localhost:5173/verify/{certificateId}` — the status now displays **REVOKED** with the official warning message and timestamp.
5. **Student Portal**:
   - Sign in as `rithika@campusvault.edu`.
   - View only your personal certificates, inspect QR code previews, and download your high-resolution PDF certificate.
   - Unauthorized attempts by students to download another student's certificate are strictly blocked with `401/403` on the backend.

---

## 9. Running Tests

### Backend Test Suite (JUnit 5 + MockMvc)
```bash
cd backend
mvn test
```
*Results: 15 passing tests covering authentication, JWT validation, role authorization, event CRUD, unique ID collision handling, QR generation, valid/revoked/invalid verification checks, and student ownership safeguards.*

### Frontend Test Suite (Vitest + Testing Library)
```bash
cd frontend
npm test
```
*Results: 5 passing tests covering login form auto-fill, public certificate verification UI, verified badges, and revocation banners.*

### Production Build Validation
```bash
cd backend && mvn clean package -DskipTests
cd ../frontend && npm run build
```

---

## 10. Troubleshooting Guide

- **Database Connection Refused (`Connection to localhost:3306 refused`)**:
  - Verify that MySQL is running: `mysqladmin -u root -p status` or check your local service.
  - Verify your password in `backend/src/main/resources/application.properties`.
- **CORS Errors**:
  - The backend CORS origin is configured to allow `http://localhost:5173` and `http://localhost:3000`. If running frontend on a different port, update `app.cors.allowed-origins` in `application.properties`.
- **Port 8080 or 5173 already in use**:
  - To kill a lingering process on port 8080: `lsof -ti:8080 | xargs kill -9`.
  - To kill a lingering process on port 5173: `lsof -ti:5173 | xargs kill -9`.

---

## 11. Cloud Deployment (Render + Vercel)

CampusVault is fully prepared for instant cloud deployment:
- **Backend on Render**: Multi-stage production container ([`backend/Dockerfile`](backend/Dockerfile)) and blueprint ([`render.yaml`](render.yaml)).
- **Frontend on Vercel**: SPA client-side routing rewrites ([`frontend/vercel.json`](frontend/vercel.json)) and Vite environment configuration.
- **Detailed Step-by-Step Instructions**: Refer to [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) for full instructions on setting up cloud MySQL (e.g. Aiven/TiDB Cloud), configuring environment variables, and linking the live domains.

