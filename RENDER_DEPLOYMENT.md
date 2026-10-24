# Render Deployment Blueprint (Frontend + Backend Only)

This blueprint configures **only the Frontend and Backend** on [Render](https://render.com). No managed database will be automatically created or billed by Render — you can connect your own manually created database (PostgreSQL, MySQL, Supabase, Neon, etc.).

---

## 🏗️ Services Architecture

```mermaid
graph LR
    subgraph Render Platform
        Frontend["smartprint-frontend (Static Site)"] -->|REST API| Backend["smartprint-backend (Python Web Service)"]
    end
    Backend -.->|DATABASE_URL| ExternalDB["Your Manually Created Database (PostgreSQL / MySQL)"]
```

1. **`smartprint-backend` (Web Service)**:
   - Python 3.11 + Gunicorn + Flask + OpenCV + PyPDF
   - Runs on Render Free Tier
   - Accepts manual `DATABASE_URL` via environment variable
2. **`smartprint-frontend` (Static Site)**:
   - React 19 + Vite + MUI + Bootstrap
   - Free static site hosting with client-side SPA routing (`/* -> /index.html`)

---

## 🚀 How to Deploy on Render

### Step 1: Push Blueprint to GitHub
The `render.yaml` file is already committed and pushed to your repository:
```text
https://github.com/Harsha-2912/smartprint.git
```

### Step 2: Launch via Render Blueprint
1. Open your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** > **Blueprint**.
3. Select your repository: `Harsha-2912/smartprint`.
4. Render will read `render.yaml` and show 2 services:
   - `smartprint-backend` (Web Service)
   - `smartprint-frontend` (Static Site)
5. During setup, Render will prompt for the manual database variable:
   - **`DATABASE_URL`**: Paste your manually created database connection string (or leave empty if using SQLite/in-memory).
   - **`VITE_API_BASE_URL`**: Pre-configured to `https://smartprint-backend-8cyj.onrender.com/api` in `render.yaml`.
6. Click **Apply**.

---

## 🗄️ Connecting Your Manual Database

Whenever your manual database is ready (e.g. from Render PostgreSQL, Neon, Supabase, or AWS RDS):

1. Go to **Render Dashboard** > Select **`smartprint-backend`**.
2. Click **Environment**.
3. Add or edit the `DATABASE_URL` variable:
   ```text
   DATABASE_URL = postgresql://username:password@hostname:5432/dbname
   ```
4. Click **Save Changes**. The backend will automatically restart and pick up your manual database connection.

---

## 🔗 Live Backend Verification

Your live backend is deployed and verified at:
- **Service URL**: `https://smartprint-backend-8cyj.onrender.com`
- **Health Check**: `https://smartprint-backend-8cyj.onrender.com/api/health`
- **Printer Telemetry**: `https://smartprint-backend-8cyj.onrender.com/api/printer/status`
