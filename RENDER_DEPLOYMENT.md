# Render Deployment Blueprint & Guide — SmartPrint AI

This guide explains how to deploy **SmartPrint AI Autonomous Xerox Machine** on **[Render](https://render.com)** using the included `render.yaml` blueprint or manual dashboard setup.

---

## Architecture on Render

Render hosts the system as two complementary microservices:

1. **`smartprint-backend` (Web Service - Python)**:
   - Serves document uploads, OpenCV document pre-flight analysis, page previews, and UPI payments.
   - Run Command: `gunicorn --chdir backend wsgi:app --bind 0.0.0.0:$PORT`
2. **`smartprint-frontend` (Static Site - React 19 + Vite)**:
   - Serves the touchscreen UI, preview workspace, pricing configurator, and printer visualizer.
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

---

## Method 1: Deploy with Render Blueprint (Recommended)

1. **Log in to [Render](https://dashboard.render.com/)**.
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub account and select your repository:
   ```text
   Harsha-2912/smartprint
   ```
4. Render will automatically detect `render.yaml` and configure:
   - `smartprint-backend` (Python Web Service)
   - `smartprint-frontend` (Static Site)
5. Click **Apply**. Render will start building both services.
6. Once `smartprint-backend` is deployed, copy its URL (e.g. `https://smartprint-backend.onrender.com`).
7. In `smartprint-frontend` settings, go to **Environment Variables**, set:
   ```text
   VITE_API_BASE_URL = https://smartprint-backend.onrender.com/api
   ```
8. Click **Save Changes** and trigger a re-deploy of the frontend.

---

## Method 2: Manual Dashboard Setup

If you prefer setting up the services manually via the Render Web UI:

### Step A: Deploy Backend Web Service
1. In Render Dashboard, click **New + > Web Service**.
2. Select repository: `Harsha-2912/smartprint`.
3. Configure the following fields:
   - **Name**: `smartprint-backend`
   - **Region**: Oregon (or nearest to your audience)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend wsgi:app --bind 0.0.0.0:$PORT`
   - **Plan**: `Free`
4. Under **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.9`
   - `FLASK_DEBUG`: `False`
   - `HOST`: `0.0.0.0`
5. Click **Create Web Service**. Wait for the status to show **Live**.
6. Copy your live backend URL (e.g. `https://smartprint-backend.onrender.com`).

---

### Step B: Deploy Frontend Static Site
1. In Render Dashboard, click **New + > Static Site**.
2. Select repository: `Harsha-2912/smartprint`.
3. Configure:
   - **Name**: `smartprint-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://smartprint-backend.onrender.com/api` (use your actual backend URL from Step A)
   - `VITE_ENABLE_MOCK_FALLBACK`: `true`
6. Click **Create Static Site**.

---

## Verification Checklist

Once deployed:
1. Open your live frontend URL (e.g. `https://smartprint-frontend.onrender.com`).
2. Test uploading a PDF or test sample — verify that OpenCV pre-flight checks run and page preview images load.
3. Test UPI Checkout and simulated payment settlement.
4. Test hardware diagnostics modal and help guides.
