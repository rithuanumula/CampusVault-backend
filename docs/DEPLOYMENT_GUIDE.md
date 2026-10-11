# CampusVault Deployment Guide
### Deploy Spring Boot Backend on Render & React Frontend on Vercel

This guide provides step-by-step instructions for deploying **CampusVault — Digital Certificate Verification System** to cloud infrastructure:
- **Backend**: [Render](https://render.com) (Spring Boot 3 + Java 21 via Docker container)
- **Frontend**: [Vercel](https://vercel.com) (React.js + Vite SPA with client-side routing)
- **Database**: Cloud MySQL 8 (Aiven, TiDB Cloud, Clever Cloud, or Railway)

---

## 🏗️ Architecture Overview

```
                      +-----------------------------+
                      |       Vercel (Frontend)     |
                      |   React.js 18 + Vite SPA    |
                      |  https://campusvault.vercel.app  |
                      +--------------+--------------+
                                     |
                          REST API & JWT Tokens
                                     |
                                     v
                      +-----------------------------+
                      |       Render (Backend)      |
                      |  Spring Boot 3 + Java 21    |
                      |  OpenPDF + ZXing QR Engine  |
                      |  https://*.onrender.com     |
                      +--------------+--------------+
                                     |
                          JDBC (Port 3306, SSL)
                                     |
                                     v
                      +-----------------------------+
                      |    Cloud MySQL 8 Database   |
                      | (Aiven / TiDB / Railway)    |
                      +-----------------------------+
```

---

## Step 1: Set Up Free Cloud MySQL 8 Database

Spring Boot requires a live MySQL instance. Because Render provides PostgreSQL by default, use a free cloud MySQL provider:

### Recommended Option: Aiven (Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and create a free account.
2. Click **Create Service** &rarr; Select **MySQL**.
3. Choose the **Free Plan** and select your closest cloud region.
4. Click **Create Service** (takes ~2 minutes to provision).
5. On the service overview page, copy your connection parameters:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (usually `avnadmin`)
   - **Password**
   - **Database Name** (default is `defaultdb`, or create `campusvault`)
6. Your JDBC URL will look like:
   ```
   jdbc:mysql://mysql-xxxx.aivencloud.com:12345/defaultdb?sslMode=REQUIRED&serverTimezone=UTC
   ```

*(Alternative providers: [TiDB Cloud Serverless](https://tidbcloud.com) or [Clever Cloud](https://www.clever-cloud.com))*

---

## Step 2: Deploy Backend on Render

### Method A: Deploy via Docker (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** &rarr; Select **Web Service**.
4. Connect your Git repository containing `CampusVault`.
5. Configure the service settings:
   - **Name**: `campusvault-backend`
   - **Language / Runtime**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile` (or `./backend/Dockerfile` if root directory is empty)
   - **Instance Type**: `Free`
6. Scroll down to **Environment Variables** and add the following:

| Key | Example Value | Description |
|---|---|---|
| `PORT` | `8080` | Render port (handled automatically) |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST:PORT/DB?sslMode=REQUIRED&serverTimezone=UTC` | Your cloud MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `avnadmin` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | `your_secret_password` | MySQL password |
| `JWT_SECRET` | `4c616d7075735661756c745365637572654a77745365637265744b657932303236303432314175576562` | 64+ char secret string |
| `FRONTEND_BASE_URL` | `https://campusvault.vercel.app` | Your Vercel frontend URL (used in generated QR codes) |
| `CORS_ALLOWED_ORIGINS` | `https://campusvault.vercel.app,https://*.vercel.app,http://localhost:5173` | Allowed origins for CORS |
| `SEED_SAMPLE_DATA` | `true` | Auto-seed sample events and admin |

7. Click **Create Web Service**.
8. Render will build the Docker container and start Spring Boot.
9. Verify the backend is live by opening:
   ```
   https://campusvault-backend.onrender.com/api/public/certificates/verify/AU-WEB-2026-00421
   ```
   You should see JSON returning `status: "VERIFIED"`.

---

## Step 3: Deploy Frontend on Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your `CampusVault` repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` &rarr; select `frontend` (Important!)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://campusvault-backend.onrender.com/api` (replace with your Render URL) |

6. Click **Deploy**.
7. Vercel will install dependencies, run `vite build`, and provide your production URL (e.g. `https://campusvault.vercel.app`).
8. The included [`frontend/vercel.json`](file:///Users/rithikareddy11/rithu/TT/CampusVault/frontend/vercel.json) automatically handles SPA rewrites so direct navigation to paths like `/verify/AU-WEB-2026-00421` and `/admin/dashboard` works without 404 errors.

---

## Step 4: Link Frontend & Backend

Once your Vercel deployment URL is live (e.g., `https://campusvault-yourname.vercel.app`):

1. Go back to your **Render Web Service** dashboard.
2. In **Environment Variables**, update:
   - `FRONTEND_BASE_URL`: `https://campusvault-yourname.vercel.app`
   - `CORS_ALLOWED_ORIGINS`: `https://campusvault-yourname.vercel.app,https://*.vercel.app,http://localhost:5173`
3. Click **Save Changes** (Render will automatically redeploy).

---

## Step 5: Verification & End-to-End Testing

Test the full production workflow:
1. **Public Verification**:
   - Open `https://your-app.vercel.app/verify/AU-WEB-2026-00421`.
   - Confirm status badge displays **OFFICIALLY VERIFIED** with student and event metadata.
2. **Administrator Login**:
   - Navigate to `https://your-app.vercel.app/login`.
   - Log in with `admin@campusvault.edu` / `Admin@123`.
   - Verify statistics load on the Admin Dashboard.
3. **Issue Certificate**:
   - Go to `https://your-app.vercel.app/admin/certificates/new`.
   - Generate a certificate for a student.
   - Download the generated PDF certificate and scan its QR code using a phone camera.
   - Confirm the QR code directs to `https://your-app.vercel.app/verify/<CERTIFICATE-ID>`.
4. **Certificate Revocation**:
   - Revoke a certificate in the Admin Certificates table.
   - Open the verification page again and ensure the status is updated to **REVOKED**.

---

## 🛠️ Troubleshooting & Tips

* **Render Free Tier Spin-Down**:
  Render free web services spin down after 15 minutes of inactivity. The first request after spin-down may take ~45–50 seconds to boot up. The frontend has a 15-second timeout configured in Axios.
* **CORS Errors**:
  Ensure `CORS_ALLOWED_ORIGINS` in Render matches your exact Vercel URL without trailing slashes.
* **MySQL SSL Handshake**:
  When using cloud MySQL (like Aiven or PlanetScale), ensure the JDBC URL includes `sslMode=REQUIRED` or `useSSL=true&requireSSL=false`.
