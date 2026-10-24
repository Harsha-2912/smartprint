import os
import shutil
import uuid
import datetime
import cv2
import numpy as np
from pathlib import Path
from pypdf import PdfReader
from PIL import Image

try:
    import pypdfium2 as pdfium
    HAS_PDFIUM = True
except ImportError:
    HAS_PDFIUM = False

from services.ai_vision_service import AIVisionService

class SessionManager:
    """
    Manages document storage, QR session tokens, page rasterization,
    real-time OpenCV computer vision inspection, and privacy auto-purging.
    """

    def __init__(self, upload_dir):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.documents = {}
        self.qr_sessions = {}

    def create_qr_session(self, kiosk_ip="127.0.0.1", port=5000):
        """Creates an ephemeral QR token for mobile phone upload."""
        token = f"QR-SYNC-{uuid.uuid4().hex[:6].upper()}"
        expires_at = datetime.datetime.now() + datetime.timedelta(seconds=300)
        
        mobile_url = f"http://{kiosk_ip}:{port}/mobile-upload?token={token}"
        
        session_info = {
            'token': token,
            'qrPayload': mobile_url,
            'status': 'WAITING_FOR_UPLOAD',
            'expiresAt': expires_at.isoformat(),
            'expiresInSeconds': 300,
            'uploadedDocId': None
        }
        self.qr_sessions[token] = session_info
        return session_info

    def get_qr_session(self, token):
        return self.qr_sessions.get(token)

    def attach_doc_to_qr_session(self, token, doc_data):
        if token in self.qr_sessions:
            self.qr_sessions[token]['status'] = 'FILE_RECEIVED'
            self.qr_sessions[token]['uploadedDocId'] = doc_data['id']
            self.qr_sessions[token]['document'] = doc_data

    def register_document(self, file_path, original_filename, file_size, mime_type):
        """
        Extracts metadata from uploaded file, rasterizes pages to high-resolution JPEGs,
        runs OpenCV pre-flight computer vision analysis, and returns document record.
        """
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"
        is_pdf = mime_type == 'application/pdf' or original_filename.lower().endswith('.pdf')
        page_count = 1

        # Create isolated previews directory for this document
        preview_dir = self.upload_dir / f"previews_{doc_id}"
        preview_dir.mkdir(parents=True, exist_ok=True)

        pages_info = []
        all_issues = []
        quality_scores = []

        if is_pdf:
            # 1. First parse metadata with PyPDF
            try:
                reader = PdfReader(str(file_path))
                page_count = len(reader.pages)
            except Exception:
                page_count = 1

            # 2. Rasterize pages with pypdfium2 if available
            pdf_doc = None
            if HAS_PDFIUM:
                try:
                    pdf_doc = pdfium.PdfDocument(str(file_path))
                    page_count = len(pdf_doc)
                except Exception as e:
                    pdf_doc = None

            for idx in range(page_count):
                p_num = idx + 1
                preview_filename = f"page_{p_num}.jpg"
                preview_file_path = preview_dir / preview_filename
                has_raster = False
                width, height = 595.0, 842.0  # Standard A4 points default
                orientation = 'portrait'
                page_issues = []
                score = 85

                if pdf_doc is not None and idx < len(pdf_doc):
                    try:
                        page = pdf_doc[idx]
                        width, height = page.get_size()
                        orientation = 'landscape' if width > height else 'portrait'

                        # Render at 1.5x scale (approx 108 DPI - fast & sharp for 10.1" kiosk)
                        pil_img = page.render(scale=1.5).to_pil()
                        pil_img.save(str(preview_file_path), format='JPEG', quality=85)
                        has_raster = True

                        # Run OpenCV Analysis on the rendered image
                        img_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                        analysis = AIVisionService.analyze_image(img_cv)
                        score = analysis['quality_score']
                        page_issues = analysis['issues']
                    except Exception as err:
                        pass

                all_issues.extend(page_issues)
                quality_scores.append(score)

                pages_info.append({
                    'pageNumber': p_num,
                    'title': f'Page {p_num} of {original_filename}',
                    'orientation': orientation,
                    'width': width,
                    'height': height,
                    'rotation': 0,
                    'hasRaster': has_raster,
                    'previewUrl': f"/api/documents/{doc_id}/pages/{p_num}/preview" if has_raster else None,
                    'issues': page_issues,
                    'previewType': 'document',
                    'contentSummary': f'PDF Vector Sheet - Page {p_num} ({int(width)}x{int(height)} pt)'
                })

        else:
            # Raster Image (JPEG, PNG, etc.)
            preview_filename = "page_1.jpg"
            preview_file_path = preview_dir / preview_filename
            width, height = 800, 1000
            orientation = 'portrait'
            has_raster = False
            page_issues = []
            score = 90

            try:
                with Image.open(str(file_path)) as img:
                    width, height = img.size
                    orientation = 'landscape' if width > height else 'portrait'
                    rgb_img = img.convert('RGB')
                    rgb_img.save(str(preview_file_path), format='JPEG', quality=85)
                    has_raster = True

                    img_cv = cv2.cvtColor(np.array(rgb_img), cv2.COLOR_RGB2BGR)
                    analysis = AIVisionService.analyze_image(img_cv)
                    score = analysis['quality_score']
                    page_issues = analysis['issues']
            except Exception:
                pass

            all_issues.extend(page_issues)
            quality_scores.append(score)

            pages_info.append({
                'pageNumber': 1,
                'title': original_filename,
                'orientation': orientation,
                'width': width,
                'height': height,
                'rotation': 0,
                'hasRaster': has_raster,
                'previewUrl': f"/api/documents/{doc_id}/pages/1/preview" if has_raster else None,
                'issues': page_issues,
                'previewType': 'image',
                'contentSummary': f'Image Scan ({width}x{height} px)'
            })

        avg_score = int(sum(quality_scores) / max(1, len(quality_scores)))
        size_mb = f"{(file_size / (1024 * 1024)):.1f} MB" if file_size >= 1024*1024 else f"{(file_size / 1024):.0f} KB"

        doc_record = {
            'id': doc_id,
            'name': original_filename,
            'displayName': original_filename,
            'type': mime_type,
            'fileSizeBytes': file_size,
            'fileSizeFormatted': size_mb,
            'filePath': str(file_path),
            'previewDir': str(preview_dir),
            'pageCount': page_count,
            'uploadedAt': datetime.datetime.now().isoformat(),
            'initialQualityScore': avg_score,
            'improvedQualityScore': 98,
            'isAnalysed': True if all_issues else False,
            'correctionsApplied': False,
            'issuesCount': len(all_issues),
            'pages': pages_info
        }

        self.documents[doc_id] = doc_record
        return doc_record

    def get_document(self, doc_id):
        return self.documents.get(doc_id)

    def get_page_preview_path(self, doc_id, page_num):
        """Returns filesystem path for rendered page JPEG."""
        doc = self.documents.get(doc_id)
        if not doc:
            return None
        preview_dir = Path(doc.get('previewDir', ''))
        path = preview_dir / f"page_{page_num}.jpg"
        if path.exists():
            return path
        return None

    def update_document(self, doc_id, updates):
        if doc_id in self.documents:
            self.documents[doc_id].update(updates)
            return self.documents[doc_id]
        return None

    def purge_all(self):
        """Security wipe: removes all files and resets session memory."""
        self.documents.clear()
        self.qr_sessions.clear()
        for item in self.upload_dir.iterdir():
            try:
                if item.is_file():
                    item.unlink()
                elif item.is_dir():
                    shutil.rmtree(item)
            except Exception:
                pass
        return True
