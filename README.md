# SmartPrint AI — Autonomous Self-Service Printing & Xerox Kiosk

> **Smart Printing. Perfect Results.**  
> Complete full-stack autonomous self-service Xerox and printing kiosk system (React 19 Frontend + Flask Python Computer Vision Backend).

---

## 1. Project Overview

**SmartPrint AI** is an autonomous self-service printing kiosk system designed for **10.1-inch landscape touchscreens (1280×800)** and public kiosk stations. It provides:
1. **Wireless & Local Document Ingestion**: Upload documents wirelessly via dynamic QR code scanning on any smartphone, or directly from flash drives / local touchscreen files.
2. **Interactive Preview Workspace**: Multi-page thumbnail selector, zoom (60% to 180%), pan, 90° manual rotation, and selective sheet toggling.
3. **OpenCV & PIL AI Document Pre-Flight Engine**: Autonomous detection of page inversion (180° upside down), skew/tilt angle offsets (via Radon/contour minAreaRect), low-contrast/faint text (CLAHE enhancement), margin clipping guards, and blank divider sheets.
4. **Dynamic Pricing & Configurator**: Touch tiles for A4/A3/Letter, B&W (₹2.00) vs Full Colour (₹10.00), duplex paper eco-discounts, and copies stepper (+ / -).
5. **Real-time UPI Checkout**: Itemized billing breakdown and dynamic UPI QR code generator (`upi://pay?pa=...`) with countdown timer, settlement polling, and simulation controls.
6. **Xerox AltaLink Hardware Telemetry**: Live printer telemetry (toner percentages, paper feed trays, fuser temperature), physical Windows spooler detection via `win32print`, paper feed animation, and hardware fault simulation (Paper Jam / Paper Out).
7. **Digital & Paper Receipts**: Confetti celebration, printable receipt slip, and safety countdown that automatically purges customer documents for privacy.

---

## 2. Technology Stack

### Frontend (Kiosk Touchscreen UI)
- **React.js 19 + Vite**: High-performance kiosk interface.
- **JavaScript (ES6+)**: Modular component architecture with React Context.
- **Bootstrap 5**: Grid layout, responsive utilities, and flexbox containers.
- **Material UI (MUI v9)**: Professional UI components (`@mui/material`), icons (`@mui/icons-material`), and emotion styling.
- **React Router DOM (v7)**: Touchscreen route navigation and workflow state guards.
- **Axios**: HTTP client connecting to the Flask backend with resilient mock fallback.
- **qrcode.react**: High-density QR code generator for smartphone sync and UPI checkout.
- **canvas-confetti**: Celebration animations on completion.
- **CSS3 Design Tokens**: Vibrant palette (`#2563EB`, `#7C3AED`, `#06B6D4`, `#10B981`), touch targets (48–60px), and laser scan animations.

### Backend (Python Flask Server)
- **Flask (v3.1.0)**: REST API serving document, payment, printer, and job microservices.
- **Flask-CORS**: Cross-origin resource sharing for kiosk clients.
- **OpenCV (cv2) & Pillow (PIL)**: Computer vision algorithms for skew detection, orientation checks, contrast evaluation, and CLAHE enhancements.
- **PyPDF (pypdf)**: High-speed PDF vector parsing, page count extraction, and dimensions analysis.
- **PyWin32 (win32print)**: Hardware detection of local Windows printers and host spooler queues.
- **Threading**: Background worker threads for real-time print impression progress tracking.

---

## 3. Directory Structure

```text
d:/MainProject-Autonomous Xerox Machine/
├── backend/
│   ├── app.py                     # Main Flask Application & Blueprint Registration
│   ├── config.py                  # Server configuration (host, port 5000, pricing, kiosk info)
│   ├── requirements.txt           # Python dependencies
│   ├── routes/
│   │   ├── document_routes.py     # Upload, QR mobile sync, OpenCV AI vision & corrections
│   │   ├── payment_routes.py      # UPI payment order generation, verification, status check
│   │   ├── printer_routes.py      # Telemetry, toner, trays, diagnostic simulator
│   │   └── job_routes.py          # Print job submission, background impression tracker
│   ├── services/
│   │   ├── ai_vision_service.py   # OpenCV deskew, contrast, blank & margin detection
│   │   ├── payment_gateway.py     # UPI intent builder, order ledger & verification
│   │   ├── printer_manager.py     # Xerox AltaLink telemetry & win32print spooler
│   │   └── session_manager.py     # Document storage, PDF parsing & privacy purge
│   └── uploads/                   # Temporary upload sandbox (auto-purged on reset)
├── src/
│   ├── config/
│   │   ├── pricingConfig.js       # Client pricing rules
│   │   ├── printerConfig.js       # Hardware specifications & trays
│   │   └── mockDocuments.js       # Pre-configured test documents
│   ├── services/
│   │   ├── api.js                 # Central Axios client
│   │   ├── documentService.js     # Document API client
│   │   ├── paymentService.js      # Payment API client
│   │   ├── printerService.js      # Printer telemetry API client
│   │   └── jobService.js          # Job execution API client
│   ├── context/
│   │   └── PrintSessionContext.jsx# Global session store & navigation guards
│   ├── components/                # Reusable common, upload, preview, AI, settings, payment & printing components
│   ├── pages/                     # Home, Upload, Preview, AIAnalysis, PrintSettings, Payment, Printing, Success, Help
│   ├── styles/                    # Kiosk tokens, touch targets, and keyframe animations
│   ├── App.jsx                    # Router & MUI ThemeProvider
│   └── main.jsx
├── .env                           # Environment variables
├── package.json
└── README.md
```

---

## 4. How to Run the System

### Step 1: Start the Flask Backend Server
In a terminal window:
```powershell
python backend/app.py
```
*The backend starts at `http://127.0.0.1:5000`.*  
Health check endpoint: `http://127.0.0.1:5000/api/health`

### Step 2: Start the React Frontend Kiosk
In another terminal window:
```powershell
npm run dev
```
*The kiosk UI is available at `http://localhost:5173/`.*

---

## 5. End-to-End Workflow & Interactive Features

1. **Welcome Screen (`/`)**: 
   - View live Xerox hardware status pill, clock, and primary service cards (*Print*, *Scan*, *Photocopy*).
   - Click **"Start Printing Now"** or **"1-Tap Demo Walkthrough"**.
2. **Upload Screen (`/upload`)**:
   - **Method A:** Drag & drop any PDF/image or click one of the 3 pre-loaded test buttons.
   - **Method B:** Scan the QR code with a phone camera to open `/mobile-upload` on mobile, or click **"Simulate Phone Upload"**.
3. **Preview Screen (`/preview`)**:
   - Zoom in/out, rotate 90°, toggle pages with checkboxes, and click **"Analyse with AI"**.
4. **AI Vision Analysis (`/ai-analysis`)**:
   - OpenCV algorithms evaluate the document and display the circular quality score gauge.
   - 6 inspection cards show status pills (Rotation, Skew, Contrast, Blank, Margins, Dimensions).
   - Tap **"Review Changes"** for side-by-side Before/After inspection, then tap **"Apply Suggested Corrections"**.
5. **Print Settings (`/settings`)**:
   - Choose Paper Size, B&W vs Full Colour, Duplex eco-savings, and Copies stepper (+ / -).
   - The **Live Price Summary** panel updates pricing in real-time.
6. **Checkout & UPI Payment (`/payment`)**:
   - Review itemized invoice and scan dynamic UPI QR code.
   - Tap **"Simulate Pay"** to simulate instant bank settlement.
7. **Printing Progress (`/printing`)**:
   - Animated Xerox printer SVG with physical paper feed cycle.
   - Real-time background job progress (Preparing → Sending → Printing page X of Y → Finishing).
   - Hardware test controls: Click **"Simulate Mid-Print Jam"** and test paper jam recovery.
8. **Success / Receipt (`/success`)**:
   - Confetti celebration, printable digital receipt preview, and 60-second safety auto-reset.
