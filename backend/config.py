import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Config:
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    UPLOAD_FOLDER = str(UPLOAD_DIR)
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25 MB
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
    
    # Kiosk Identity
    KIOSK_ID = os.environ.get('KIOSK_ID', 'KIOSK-BLR-04')
    TERMINAL_NAME = 'SmartPrint AI Self-Service Station #4'
    FACILITY = 'Innovation Tech Hub & Library'
    LOCATION = 'Ground Floor Atrium'
    SUPPORT_PHONE = '+91 1800 572 8900'
    SUPPORT_EMAIL = 'kiosk-support@smartprint.ai'

    # Pricing Engine Configuration (INR)
    PRICING = {
        'currency_symbol': '₹',
        'currency_code': 'INR',
        'bw_per_page': 2.00,
        'color_per_page': 10.00,
        'paper_surcharges': {
            'a4': 0.00,
            'a3': 3.00,
            'letter': 0.50
        },
        'duplex_discount_pct': 0.10,
        'min_charge': 2.00,
        'tax_rate': 0.00
    }
