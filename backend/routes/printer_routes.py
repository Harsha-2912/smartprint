from flask import Blueprint, request, jsonify
from services.printer_manager import printer_manager

printer_bp = Blueprint('printer', __name__)

@printer_bp.route('/status', methods=['GET'])
def get_printer_status():
    """
    Returns live hardware diagnostics, toner, paper levels, and detected printers.
    """
    telemetry = printer_manager.get_telemetry()
    return jsonify({
        'success': True,
        'data': telemetry
    })

@printer_bp.route('/simulate', methods=['POST'])
def simulate_hardware_status():
    """
    Testing hook: allows tester to simulate paper jam, paper out, offline, or ready.
    """
    data = request.get_json() or {}
    new_status = data.get('status', 'READY')
    updated = printer_manager.set_simulated_status(new_status)
    return jsonify({
        'success': True,
        'message': f'Printer hardware status changed to {new_status}',
        'data': updated
    })

@printer_bp.route('/reset', methods=['POST'])
def reset_hardware():
    """
    Resets printer back to operational READY status.
    """
    updated = printer_manager.set_simulated_status('READY')
    return jsonify({
        'success': True,
        'message': 'Printer hardware diagnostics reset to READY',
        'data': updated
    })
