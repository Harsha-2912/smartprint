import os
import datetime
import logging

try:
    import win32print
    import win32api
    HAS_WIN32PRINT = True
except ImportError:
    HAS_WIN32PRINT = False

logger = logging.getLogger(__name__)

class PrinterManager:
    """
    Manages Xerox kiosk printer hardware telemetry, tray paper counters,
    toner levels, error diagnostics, and local Windows spooler integration.
    """

    def __init__(self):
        self.model = 'Xerox AltaLink® C8170 Pro Multifunction Kiosk Engine'
        self.ip_address = '192.168.1.140'
        self.serial_number = 'XER-AL8170-88492K'
        self.firmware = '101.008.019.23100'
        self.hardware_status = 'READY'  # 'READY', 'PRINTING', 'PAPER_JAM', 'PAPER_OUT', 'OFFLINE'
        self.status_message = 'Ready to print documents'
        self.connection_status = 'ONLINE'  # 'ONLINE', 'DISCONNECTED', 'DEGRADED'
        self.dpi = '1200 x 2400 DPI Ultra High Res'
        self.speed_ppm = '70 ppm'

        self.trays = [
            {'id': 1, 'name': 'Tray 1', 'size': 'A4', 'status': 'OK', 'capacityPercent': 92, 'sheetsLeft': 460},
            {'id': 2, 'name': 'Tray 2', 'size': 'A3', 'status': 'OK', 'capacityPercent': 78, 'sheetsLeft': 390},
            {'id': 3, 'name': 'Tray 3', 'size': 'Letter', 'status': 'OK', 'capacityPercent': 100, 'sheetsLeft': 500}
        ]

        self.toner = {
            'black': {'levelPercent': 94, 'status': 'GOOD', 'color': '#172033'},
            'cyan': {'levelPercent': 88, 'status': 'GOOD', 'color': '#06B6D4'},
            'magenta': {'levelPercent': 91, 'status': 'GOOD', 'color': '#EC4899'},
            'yellow': {'levelPercent': 89, 'status': 'GOOD', 'color': '#FACC15'}
        }

        self.fuser_temp = '185°C (Optimal)'
        self.drum_life_percent = 96
        self.last_updated = datetime.datetime.now().isoformat()

    def get_real_windows_printers(self):
        """Returns list of real Windows printers installed on the host system."""
        printers = []
        if HAS_WIN32PRINT:
            try:
                flags = win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS
                enum_list = win32print.EnumPrinters(flags)
                for item in enum_list:
                    printers.append({
                        'name': item[2],
                        'port': item[1],
                        'description': item[3]
                    })
            except Exception as e:
                logger.warning(f"Could not enumerate Windows printers: {e}")
        return printers

    def get_telemetry(self):
        """Returns current comprehensive printer telemetry payload."""
        real_printers = self.get_real_windows_printers()
        default_printer = None
        if HAS_WIN32PRINT:
            try:
                default_printer = win32print.GetDefaultPrinter()
            except Exception:
                pass

        return {
            'model': self.model,
            'ipAddress': self.ip_address,
            'serialNumber': self.serial_number,
            'firmware': self.firmware,
            'hardwareStatus': self.hardware_status,
            'statusMessage': self.status_message,
            'connectionStatus': self.connection_status,
            'dpi': self.dpi,
            'speedPpm': self.speed_ppm,
            'trays': self.trays,
            'toner': self.toner,
            'fuserTemp': self.fuser_temp,
            'drumLifePercent': self.drum_life_percent,
            'hasPhysicalSpooler': HAS_WIN32PRINT,
            'defaultHostPrinter': default_printer,
            'detectedHostPrinters': real_printers,
            'lastUpdated': datetime.datetime.now().isoformat()
        }

    def print_document_to_spooler(self, file_path, printer_name=None, copies=1):
        """
        Dispatches physical print job to the Windows default or target printer spooler.
        """
        if not HAS_WIN32PRINT:
            return {'success': False, 'message': 'PyWin32 spooler module not loaded', 'spooled': False}

        if not file_path or not os.path.exists(file_path):
            return {'success': False, 'message': f'File not found: {file_path}', 'spooled': False}

        try:
            target_printer = printer_name or win32print.GetDefaultPrinter()
            if not target_printer:
                return {'success': False, 'message': 'No default Windows printer configured', 'spooled': False}

            for _ in range(max(1, copies)):
                win32api.ShellExecute(0, "print", str(file_path), None, ".", 0)
                
            return {
                'success': True, 
                'message': f'Job spooled to Windows printer: {target_printer}', 
                'spooled': True,
                'printer': target_printer
            }
        except Exception as e:
            logger.warning(f"Error spooling physical print job: {e}")
            return {'success': False, 'message': str(e), 'spooled': False}

    def set_simulated_status(self, new_status):
        """Allows testing hardware fault states (JAM, OUT, OFFLINE, READY)."""
        new_status = new_status.upper()
        if new_status == 'PAPER_JAM':
            self.hardware_status = 'PAPER_JAM'
            self.status_message = 'Paper jam detected in Tray 1 feed roller. Open side door B to clear.'
            self.connection_status = 'ONLINE'
        elif new_status == 'PAPER_OUT':
            self.hardware_status = 'PAPER_OUT'
            self.status_message = 'Tray 1 (A4) is out of paper. Please reload 75 GSM paper.'
            self.connection_status = 'ONLINE'
            self.trays[0]['sheetsLeft'] = 0
            self.trays[0]['capacityPercent'] = 0
        elif new_status == 'OFFLINE':
            self.hardware_status = 'OFFLINE'
            self.status_message = 'Printer communication lost. Check USB / LAN cabling.'
            self.connection_status = 'DISCONNECTED'
        else:
            self.hardware_status = 'READY'
            self.status_message = 'Ready to print documents'
            self.connection_status = 'ONLINE'
            self.trays[0]['sheetsLeft'] = 460
            self.trays[0]['capacityPercent'] = 92

        self.last_updated = datetime.datetime.now().isoformat()
        return self.get_telemetry()

    def deduct_sheets(self, sheet_count):
        """Simulates paper consumption when a job prints."""
        if self.trays[0]['sheetsLeft'] > sheet_count:
            self.trays[0]['sheetsLeft'] -= sheet_count
            self.trays[0]['capacityPercent'] = max(0, int((self.trays[0]['sheetsLeft'] / 500) * 100))
        self.last_updated = datetime.datetime.now().isoformat()

# Singleton instance for kiosk lifecycle
printer_manager = PrinterManager()
