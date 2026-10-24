import random
import time
import threading
import datetime
from flask import Blueprint, request, jsonify
from services.printer_manager import printer_manager
from routes.document_routes import session_manager

job_bp = Blueprint('jobs', __name__)

# In-memory jobs registry
ACTIVE_JOBS = {}
JOB_LOCK = threading.Lock()

def _simulate_job_execution(job_id, total_impressions):
    """
    Background worker thread that progresses job through realistic printing stages.
    """
    stages = [
        ('PREPARING', 15),
        ('SENDING', 35),
    ]

    for stage_name, target_pct in stages:
        time.sleep(1.2)
        with JOB_LOCK:
            job = ACTIVE_JOBS.get(job_id)
            if not job or job['status'] == 'CANCELLED':
                return
            job['status'] = stage_name
            job['progressPercent'] = target_pct

    # Print impressions page by page
    for imp in range(1, total_impressions + 1):
        time.sleep(1.0)
        with JOB_LOCK:
            job = ACTIVE_JOBS.get(job_id)
            if not job or job['status'] == 'CANCELLED':
                return

            # Check if printer entered an error state
            telemetry = printer_manager.get_telemetry()
            if telemetry['hardwareStatus'] in ['PAPER_JAM', 'PAPER_OUT', 'OFFLINE']:
                job['status'] = telemetry['hardwareStatus'].lower()
                job['errorMessage'] = telemetry['statusMessage']
                # Wait until cleared
                while True:
                    time.sleep(1.0)
                    with JOB_LOCK:
                        cur_job = ACTIVE_JOBS.get(job_id)
                        if not cur_job or cur_job['status'] == 'CANCELLED':
                            return
                        tel = printer_manager.get_telemetry()
                        if tel['hardwareStatus'] == 'READY':
                            job['errorMessage'] = None
                            break

            job['status'] = 'PRINTING'
            job['currentPage'] = imp
            pct = 40 + int((imp / total_impressions) * 55)
            job['progressPercent'] = min(95, pct)

    # Finishing
    time.sleep(1.0)
    with JOB_LOCK:
        job = ACTIVE_JOBS.get(job_id)
        if job and job['status'] != 'CANCELLED':
            job['status'] = 'COMPLETED'
            job['progressPercent'] = 100
            job['currentPage'] = total_impressions
            job['completedAt'] = datetime.datetime.now().isoformat()
            # Deduct physical sheets from printer tray
            printer_manager.deduct_sheets(job.get('totalSheets', total_impressions))

@job_bp.route('/submit', methods=['POST'])
def submit_job():
    """
    Submits an authorized print job and initiates background print queue.
    """
    data = request.get_json() or {}
    job_id = f"SP-JOB-{random.randint(100000, 999999)}"
    
    total_pages = data.get('totalPages', 1)
    copies = data.get('copies', 1)
    total_impressions = total_pages * copies
    print_sides = data.get('printSides', 'single')
    
    sheets_per_copy = (total_pages + 1) // 2 if print_sides == 'double' else total_pages
    total_sheets = sheets_per_copy * copies

    job_data = {
        'jobId': job_id,
        'documentId': data.get('documentId'),
        'status': 'PREPARING',
        'progressPercent': 5,
        'currentPage': 1,
        'totalPages': total_pages,
        'copies': copies,
        'totalImpressions': total_impressions,
        'totalSheets': total_sheets,
        'colorMode': data.get('colorMode', 'bw'),
        'paperSize': data.get('paperSize', 'a4'),
        'printSides': print_sides,
        'submittedAt': datetime.datetime.now().isoformat(),
        'completedAt': None,
        'errorMessage': None
    }

    with JOB_LOCK:
        ACTIVE_JOBS[job_id] = job_data

    # Check for real physical print dispatch to Windows default printer
    doc_id = data.get('documentId')
    spool_result = None
    if doc_id and data.get('dispatchToPhysicalPrinter', False):
        doc = session_manager.get_document(doc_id)
        if doc and doc.get('filePath'):
            spool_result = printer_manager.print_document_to_spooler(
                file_path=doc['filePath'],
                copies=copies
            )
            job_data['spoolResult'] = spool_result

    # Spawn asynchronous background progress thread
    worker = threading.Thread(
        target=_simulate_job_execution, 
        args=(job_id, total_impressions),
        daemon=True
    )
    worker.start()

    return jsonify({
        'success': True,
        'jobId': job_id,
        'status': 'PREPARING',
        'submittedAt': job_data['submittedAt'],
        'totalPages': total_pages,
        'copies': copies,
        'totalImpressions': total_impressions,
        'totalSheets': total_sheets,
        'spoolResult': spool_result
    })


@job_bp.route('/<job_id>/status', methods=['GET'])
def get_job_status(job_id):
    """
    Returns real-time execution telemetry for active or completed print job.
    """
    with JOB_LOCK:
        job = ACTIVE_JOBS.get(job_id)
        if not job:
            return jsonify({
                'jobId': job_id,
                'status': 'PRINTING',
                'progressPercent': 50
            })

        return jsonify({
            'success': True,
            'jobId': job['jobId'],
            'status': job['status'],
            'progressPercent': job['progressPercent'],
            'currentPage': job['currentPage'],
            'totalImpressions': job['totalImpressions'],
            'errorMessage': job.get('errorMessage')
        })

@job_bp.route('/<job_id>/cancel', methods=['POST'])
def cancel_job(job_id):
    """
    Cancels an active print job.
    """
    with JOB_LOCK:
        job = ACTIVE_JOBS.get(job_id)
        if job:
            job['status'] = 'CANCELLED'
            job['errorMessage'] = 'Print job cancelled by customer.'

    return jsonify({
        'success': True,
        'jobId': job_id,
        'status': 'CANCELLED',
        'message': 'Print job cancelled by customer.'
    })
