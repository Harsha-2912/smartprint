import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app import create_app
from config import Config

app = create_app()

if __name__ == '__main__':
    try:
        from waitress import serve
        print(f"[INFO] Starting SmartPrint AI Waitress Production Server on http://{Config.HOST}:{Config.PORT}")
        serve(app, host=Config.HOST, port=Config.PORT, threads=8)
    except ImportError:
        print("[WARNING] Waitress not installed. Falling back to development server. Run: pip install waitress")
        app.run(host=Config.HOST, port=Config.PORT, debug=False)
