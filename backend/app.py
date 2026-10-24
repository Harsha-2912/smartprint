import os
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS

from config import Config
from routes.document_routes import document_bp, session_manager
from routes.payment_routes import payment_bp
from routes.printer_routes import printer_bp
from routes.job_routes import job_bp
from services.printer_manager import printer_manager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend Vite dev server and local network access
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register API Blueprints
    app.register_blueprint(document_bp, url_prefix='/api/documents')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(printer_bp, url_prefix='/api/printer')
    app.register_blueprint(job_bp, url_prefix='/api/jobs')
    @app.route('/', methods=['GET'])
    def root_dashboard():
        html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SmartPrint AI — Autonomous Xerox Backend</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; }
                body { background: #0F172A; color: #F8FAFC; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
                .card { background: #1E293B; border: 1px solid #334155; border-radius: 24px; padding: 2.5rem; max-width: 580px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #34D399; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; border: 1px solid rgba(16, 185, 129, 0.3); }
                .dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px #10B981; animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
                h1 { font-size: 1.75rem; font-weight: 800; margin: 1.25rem 0 0.5rem 0; background: linear-gradient(135deg, #60A5FA, #C084FC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                p { color: #94A3B8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.75rem; }
                .info-box { background: #0F172A; border: 1px solid #334155; border-radius: 12px; padding: 12px 14px; }
                .info-label { font-size: 0.72rem; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.05em; }
                .info-val { font-size: 0.92rem; font-weight: 600; color: #F1F5F9; margin-top: 2px; }
                .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 1rem; transition: transform 0.15s, opacity 0.15s; box-shadow: 0 10px 20px rgba(37,99,235,0.3); margin-bottom: 0.75rem; }
                .btn:hover { opacity: 0.95; transform: translateY(-1px); }
                .endpoints { border-top: 1px solid #334155; padding-top: 1.25rem; font-size: 0.85rem; color: #64748B; }
                .endpoint-link { color: #38BDF8; text-decoration: none; margin-right: 12px; }
                .endpoint-link:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="badge"><span class="dot"></span> SmartPrint AI Engine Active</div>
                <h1>REST API Backend Online</h1>
                <p>Autonomous Xerox & Printing kiosk backend running on Render with OpenCV computer vision and hardware diagnostics.</p>
                
                <div class="grid">
                    <div class="info-box">
                        <div class="info-label">Version</div>
                        <div class="info-val">v2.4.0 Production</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Kiosk ID</div>
                        <div class="info-val">""" + Config.KIOSK_ID + """</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Printer Model</div>
                        <div class="info-val">AltaLink® C8170 Pro</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">Speed & DPI</div>
                        <div class="info-val">70 PPM • 2400 DPI</div>
                    </div>
                </div>

                <a href="https://smartprint-frontend.onrender.com" class="btn">
                    🚀 Launch Kiosk Frontend Application ➔
                </a>

                <div class="endpoints">
                    <strong>Live API Endpoints:</strong><br>
                    <a href="/api/health" class="endpoint-link">/api/health</a>
                    <a href="/api/printer/status" class="endpoint-link">/api/printer/status</a>
                    <a href="/api/documents/qr-session" class="endpoint-link">/api/documents/qr-session</a>
                </div>
            </div>
        </body>
        </html>
        """
        return render_template_string(html)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'SmartPrint AI Autonomous Xerox Engine',
            'version': '2.4.0',
            'kioskId': Config.KIOSK_ID,
            'printerHardware': printer_manager.model
        })

    @app.route('/api/session/reset', methods=['POST'])
    def reset_kiosk_session():
        """
        Privacy wipe: purges all uploaded files and resets kiosk hardware telemetry.
        """
        session_manager.purge_all()
        printer_manager.set_simulated_status('READY')
        return jsonify({
            'success': True,
            'message': 'Kiosk session purged successfully. All user documents permanently deleted.'
        })

    @app.route('/mobile-upload', methods=['GET'])
    def mobile_upload_page():
        """
        Web page rendered on a smartphone when scanning the kiosk QR code.
        """
        token = request.args.get('token', '')
        html = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
            <title>SmartPrint AI — Mobile Upload</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: #F5F7FF; color: #172033; padding: 1.5rem; display: flex; flex-direction: column; min-height: 100vh; justify-content: center; align-items: center; }
                .card { background: #FFFFFF; border-radius: 20px; padding: 2rem; width: 100%; max-width: 420px; box-shadow: 0 10px 30px rgba(15,23,42,0.1); border: 1.5px solid #E2E8F0; text-align: center; }
                .logo { width: 54px; height: 54px; border-radius: 14px; background: linear-gradient(135deg, #2563EB, #7C3AED); display: inline-flex; align-items: center; justify-content: center; color: white; margin-bottom: 1rem; font-weight: 800; font-size: 1.4rem; }
                h2 { font-weight: 800; font-size: 1.35rem; margin-bottom: 0.5rem; }
                p { color: #64748B; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.5; }
                .upload-box { border: 2px dashed #CBD5E1; border-radius: 14px; padding: 1.75rem 1rem; margin-bottom: 1.5rem; cursor: pointer; transition: 0.2s; }
                .upload-box:active { background: #EFF6FF; border-color: #2563EB; }
                .btn { display: block; width: 100%; height: 52px; background: linear-gradient(135deg, #2563EB, #7C3AED); color: white; border: none; border-radius: 14px; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
                .btn:disabled { opacity: 0.6; }
                .status-msg { margin-top: 1rem; font-size: 0.88rem; font-weight: 600; }
                .success { color: #10B981; }
                .error { color: #F43F5E; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="logo">🖨️</div>
                <h2>SmartPrint AI Kiosk</h2>
                <p>Transfer document from your phone directly to the kiosk screen.</p>
                <form id="uploadForm" enctype="multipart/form-data">
                    <input type="hidden" name="token" value="{{ token }}">
                    <div class="upload-box" onclick="document.getElementById('fileInput').click()">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                        <span id="fileNameLabel" style="font-size: 0.95rem; font-weight: 600; color: #2563EB;">Tap to Select File</span>
                        <div style="font-size: 0.78rem; color: #94A3B8; margin-top: 4px;">PDF, JPG, PNG up to 25MB</div>
                        <input type="file" id="fileInput" name="document" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" onchange="updateFileLabel()">
                    </div>
                    <button type="button" class="btn" id="submitBtn" onclick="uploadDoc()">Send to Kiosk Screen</button>
                </form>
                <div id="statusArea" class="status-msg"></div>
            </div>

            <script>
                function updateFileLabel() {
                    const input = document.getElementById('fileInput');
                    if (input.files && input.files[0]) {
                        document.getElementById('fileNameLabel').innerText = input.files[0].name;
                    }
                }

                async function uploadDoc() {
                    const input = document.getElementById('fileInput');
                    const statusArea = document.getElementById('statusArea');
                    const btn = document.getElementById('submitBtn');

                    if (!input.files || !input.files[0]) {
                        statusArea.className = 'status-msg error';
                        statusArea.innerText = 'Please select a file first!';
                        return;
                    }

                    btn.disabled = true;
                    btn.innerText = 'Transferring...';
                    statusArea.className = 'status-msg';
                    statusArea.innerText = 'Uploading to kiosk...';

                    const formData = new FormData();
                    formData.append('token', '{{ token }}');
                    formData.append('document', input.files[0]);

                    try {
                        const res = await fetch('/api/documents/mobile-upload', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await res.json();
                        if (data.success) {
                            statusArea.className = 'status-msg success';
                            statusArea.innerText = '✅ Document transferred! Look at the kiosk screen.';
                            btn.innerText = 'Transferred Successfully';
                        } else {
                            statusArea.className = 'status-msg error';
                            statusArea.innerText = 'Error: ' + (data.error || 'Upload failed');
                            btn.disabled = false;
                            btn.innerText = 'Try Again';
                        }
                    } catch (e) {
                        statusArea.className = 'status-msg error';
                        statusArea.innerText = 'Network error transferring to kiosk.';
                        btn.disabled = false;
                        btn.innerText = 'Try Again';
                    }
                }
            </script>
        </body>
        </html>
        """
        return render_template_string(html, token=token)

    return app

if __name__ == '__main__':
    app = create_app()
    print(f"[INFO] SmartPrint AI Autonomous Backend starting on http://{Config.HOST}:{Config.PORT}")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
