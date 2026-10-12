# Deploying CampusVault Backend with MySQL on Railway

This guide walks you through deploying the Spring Boot backend with a managed MySQL 8 database on **Railway**, connected to your live **Vercel** frontend.

Your repository is live at:  
👉 **`https://github.com/rithuanumula/CampusVault-backend`**

---

## 🚀 Quick Setup (3 Minutes)

### Step 1: Create a Project & Provision MySQL
1. Open **[railway.com/new](https://railway.com/new)** (Sign in with your GitHub account).
2. Click **Provision MySQL**.
   - Railway will instantly provision a high-performance managed MySQL 8 database service.
   - Wait ~10 seconds until the database shows active.

---

### Step 2: Add Backend Service from GitHub
1. In the same Railway project canvas, click **+ Create** or **+ New** (top right) &rarr; Select **GitHub Repo**.
2. Select your repository: **`CampusVault-backend`**.
3. Once the service card appears, click on it to open its **Settings**:
   - Under **General** &rarr; **Root Directory**: Set to **`/backend`** (Important!).
   - Under **Build**: It will automatically detect [`Dockerfile`](file:///Users/rithikareddy11/rithu/TT/CampusVault/backend/Dockerfile) or Nixpacks.

---

### Step 3: Configure Environment Variables
Click the **Variables** tab on your `CampusVault-backend` service and add the following:

| Variable Name | Value | Purpose |
|---|---|---|
| `JWT_SECRET` | `4c616d7075735661756c745365637572654a77745365637265744b657932303236303432314175576562` | 256-bit secure token key |
| `FRONTEND_BASE_URL` | `https://your-app.vercel.app` *(Your actual Vercel URL)* | Links QR codes to your Vercel verification page |
| `CORS_ALLOWED_ORIGINS` | `https://*.vercel.app,https://your-app.vercel.app,http://localhost:5173` | Allows cross-origin requests from Vercel |
| `SEED_SAMPLE_DATA` | `true` | Auto-creates sample events, certificates & default Admin |

#### 💡 Database Variables (Automatic!):
Because your MySQL database and backend are in the same Railway project, Railway sets MySQL variables automatically.
`application.properties` is already configured to automatically read:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

*(Optional: If you want to use Railway reference variables explicitly, you can set `SPRING_DATASOURCE_URL` to `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`)*

---

### Step 4: Generate Public Domain for Backend
1. On the backend service card, click the **Settings** tab.
2. Scroll to the **Networking** section.
3. Under **Public Networking**, click **Generate Domain**.
4. You will get a live URL like:
   ```
   https://campusvault-backend-production-xxxx.up.railway.app
   ```
5. Test that it is alive by opening:
   ```
   https://<your-railway-url>/api/public/certificates/verify/AU-WEB-2026-00421
   ```
   It will return verified certificate JSON!

---

### Step 5: Connect Frontend (Vercel) to Railway Backend
1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Open your deployed **CampusVault** project.
3. Navigate to **Settings** &rarr; **Environment Variables**.
4. Set (or update) `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://<your-railway-url>/api
   ```
   *(Be sure to include `/api` at the end and no trailing slash).*
5. Go to **Deployments** &rarr; click **Redeploy** on the latest deployment so Vite picks up the new backend URL.

---

### Step 6: Log In & Verify
- Open your live **Vercel** frontend URL.
- Go to `/login` and sign in with:
  - **Email**: `admin@campusvault.edu`
  - **Password**: `Admin@123`
- Issue a certificate, download the PDF, and scan the QR code to verify end-to-end functionality!
