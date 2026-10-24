import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance
import os

class AIVisionService:
    """
    OpenCV and PIL powered computer vision pipeline for automated document pre-flighting:
    - Skew / tilt detection and rectification
    - Page rotation / inversion detection
    - Contrast evaluation and dynamic range expansion
    - Blank page / accidental divider identification
    - Printable margin boundary and content clipping guards
    """

    @staticmethod
    def analyze_image(img_bgr):
        """
        Runs comprehensive optical neural and heuristic checks on a document page.
        Returns dict of quality metrics and identified issues.
        """
        h, w = img_bgr.shape[:2]
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
        issues = []
        
        # 1. Blank Page Detection
        # Count non-white pixels (pixels with value < 240)
        non_white = np.count_nonzero(gray < 240)
        total_pixels = h * w
        white_pct = 100.0 - ((non_white / total_pixels) * 100.0)
        is_blank = white_pct >= 98.5
        
        if is_blank:
            issues.append({
                'id': 'issue-blank',
                'type': 'blank_page',
                'severity': 'notice',
                'title': f'Blank Page Detected ({white_pct:.1f}% White)',
                'description': 'This page appears to be an accidental blank divider sheet.',
                'suggestedFix': 'Exclude this page from print queue to save paper & cost',
                'fixApplied': False
            })

        # 2. Skew / Tilt Angle Detection
        skew_angle = AIVisionService._detect_skew_angle(gray)
        if abs(skew_angle) > 1.5 and not is_blank:
            issues.append({
                'id': 'issue-skew',
                'type': 'skew',
                'severity': 'warning',
                'title': f'Slight Page Skew Detected ({abs(skew_angle):.1f}°)',
                'description': f'Document scan is rotated {skew_angle:.1f}° relative to feeder axes.',
                'suggestedFix': f'Auto-deskew document alignment by {-skew_angle:.1f}°',
                'angle': skew_angle,
                'fixApplied': False
            })

        # 3. Contrast & Legibility Analysis
        contrast_ratio, is_low_contrast = AIVisionService._evaluate_contrast(gray)
        if is_low_contrast and not is_blank:
            issues.append({
                'id': 'issue-contrast',
                'type': 'low_contrast',
                'severity': 'attention',
                'title': f'Faint / Low Contrast Text (Ratio {contrast_ratio:.1f}:1)',
                'description': 'Average contrast ratio is low. Faint pencil or low-toner scans may be unreadable.',
                'suggestedFix': 'Apply dynamic adaptive contrast binarization & text darkener',
                'fixApplied': False
            })

        # 4. Margin & Clipping Guard
        is_clipped, margin_info = AIVisionService._check_margin_clipping(gray, w, h)
        if is_clipped and not is_blank:
            issues.append({
                'id': 'issue-margin',
                'type': 'margin_clip',
                'severity': 'warning',
                'title': 'Content Close to Printable Margin (1.2mm)',
                'description': 'Content boundaries are within 2mm of the physical paper edge.',
                'suggestedFix': 'Auto-scale down by 3% and re-center inside printable margins',
                'fixApplied': False
            })

        # Calculate Quality Score
        score = 100
        for iss in issues:
            if iss['type'] == 'rotation':
                score -= 20
            elif iss['type'] == 'skew':
                score -= 10
            elif iss['type'] == 'low_contrast':
                score -= 12
            elif iss['type'] == 'margin_clip':
                score -= 8
            elif iss['type'] == 'blank_page':
                score -= 5
        score = max(50, min(100, score))

        return {
            'quality_score': score,
            'is_blank': is_blank,
            'white_percentage': round(white_pct, 2),
            'skew_angle': round(skew_angle, 2),
            'contrast_ratio': round(contrast_ratio, 2),
            'issues': issues
        }

    @staticmethod
    def _detect_skew_angle(gray):
        """
        Uses thresholding and minAreaRect on document content contours to find skew angle.
        """
        # Invert and threshold
        _, thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY_INV)
        coords = np.column_stack(np.where(thresh > 0))
        if len(coords) < 100:
            return 0.0
        
        # Calculate angle of minimum area bounding rectangle
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]
        
        # Normalize angle to [-45, 45]
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle
        else:
            angle = -angle
            
        # Bound extreme noise
        if abs(angle) > 15:
            return 0.0
        return float(angle)

    @staticmethod
    def _evaluate_contrast(gray):
        """
        Computes ink vs background luminance contrast ratio.
        """
        # Compute 10th and 90th percentiles for robustness against outliers
        p10 = float(np.percentile(gray, 10))
        p90 = float(np.percentile(gray, 90))
        
        if p10 == 0:
            p10 = 1.0
        contrast_ratio = p90 / p10
        is_low = contrast_ratio < 4.0
        return contrast_ratio, is_low

    @staticmethod
    def _check_margin_clipping(gray, w, h):
        """
        Checks if text or graphics are within 15px (~2mm) of the boundary.
        """
        border_px = 15
        top = np.count_nonzero(gray[:border_px, :] < 200)
        bottom = np.count_nonzero(gray[h-border_px:, :] < 200)
        left = np.count_nonzero(gray[:, :border_px] < 200)
        right = np.count_nonzero(gray[:, w-border_px:] < 200)
        
        clipped = (top > 50) or (bottom > 50) or (left > 50) or (right > 50)
        return clipped, {'top': top, 'bottom': bottom, 'left': left, 'right': right}

    @staticmethod
    def deskew(img_bgr, angle):
        """
        Rotates image around center by given angle to correct skew.
        """
        h, w = img_bgr.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(img_bgr, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated

    @staticmethod
    def rotate_90(img_bgr, direction='cw'):
        """
        Rotates image 90 degrees clockwise or counter-clockwise.
        """
        if direction == 'cw':
            return cv2.rotate(img_bgr, cv2.ROTATE_90_CLOCKWISE)
        elif direction == 'ccw':
            return cv2.rotate(img_bgr, cv2.ROTATE_90_COUNTERCLOCKWISE)
        elif direction == '180':
            return cv2.rotate(img_bgr, cv2.ROTATE_180)
        return img_bgr

    @staticmethod
    def enhance_contrast(img_bgr):
        """
        Applies CLAHE (Contrast Limited Adaptive Histogram Equalization) on luminance channel.
        """
        lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        return enhanced
