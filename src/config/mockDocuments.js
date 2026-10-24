/**
 * Realistic Mock Document Library for Self-Service Kiosk Demo & Testing
 * Each mock document includes multi-page structures, SVG preview blueprints,
 * and deterministic AI quality flaws for demonstration.
 */

export const MOCK_SAMPLE_DOCUMENTS = [
  {
    id: 'doc-sample-1',
    name: 'Project_Proposal_Executive_Brief.pdf',
    displayName: 'Executive Project Proposal (6 Pages)',
    type: 'application/pdf',
    fileSizeFormatted: '2.4 MB',
    fileSizeBytes: 2516582,
    uploadedAt: new Date().toISOString(),
    pageCount: 6,
    initialQualityScore: 74,
    improvedQualityScore: 98,
    pages: [
      {
        pageNumber: 1,
        title: 'Cover Sheet & Executive Summary',
        orientation: 'portrait',
        aspectRatio: '0.707', // A4
        issues: [
          {
            id: 'skew-p1',
            type: 'skew',
            severity: 'warning',
            title: 'Slight Page Skew Detected',
            description: 'The scan is rotated approximately 3.4° clockwise.',
            suggestedFix: 'Auto-deskew document alignment to 0.0°',
            fixApplied: false
          }
        ],
        previewType: 'cover',
        contentSummary: 'CONFIDENTIAL EXECUTIVE PROPOSAL - Smart AI Printing & Hardware Infrastructure 2026'
      },
      {
        pageNumber: 2,
        title: 'Market Opportunity & Architecture',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'rotation-p2',
            type: 'rotation',
            severity: 'action_required',
            title: 'Inverted Page Orientation (180°)',
            description: 'Document orientation analysis shows this page is upside down.',
            suggestedFix: 'Rotate 180° clockwise to correct upright reading',
            fixApplied: false
          }
        ],
        previewType: 'charts',
        contentSummary: 'Architecture Diagram & Microservices Layer: Flask API, Redis Queue, Agent Controller'
      },
      {
        pageNumber: 3,
        title: 'Financial Projections & Costing',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'margin-p3',
            type: 'margin_clip',
            severity: 'warning',
            title: 'Content Close to Printable Margin (1.2mm)',
            description: 'Bottom table borders are within 1.5mm of the paper edge.',
            suggestedFix: 'Scale down by 3% and re-center to safe printable margin (5mm)',
            fixApplied: false
          }
        ],
        previewType: 'table',
        contentSummary: 'Financial Model: Unit Economics, Kiosk Lease, Consumables & Maintenance Projections'
      },
      {
        pageNumber: 4,
        title: 'Legacy Technical Specs (Scanned)',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'contrast-p4',
            type: 'low_contrast',
            severity: 'attention',
            title: 'Faint / Low Contrast Text',
            description: 'Average contrast ratio is 3.1:1 with faint scanner pencil marks.',
            suggestedFix: 'Apply adaptive dynamic binarization & text darkener',
            fixApplied: false
          }
        ],
        previewType: 'scan',
        contentSummary: 'Hardware Spec Sheet: AltaLink C8170 Duty Cycle & Optical Scanner Tolerances'
      },
      {
        pageNumber: 5,
        title: 'Divider / Section Break',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'blank-p5',
            type: 'blank_page',
            severity: 'notice',
            title: 'Blank Page Detected (99.4% White)',
            description: 'This page appears to be an accidental blank divider sheet.',
            suggestedFix: 'Exclude page 5 from print queue to save paper & cost',
            fixApplied: false
          }
        ],
        previewType: 'blank',
        contentSummary: 'Blank sheet (scanner bleed through only)'
      },
      {
        pageNumber: 6,
        title: 'Appendix & Signatures',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [],
        previewType: 'signatures',
        contentSummary: 'Authorized Signatures, Seal & Regulatory Verification Certificates'
      }
    ]
  },
  {
    id: 'doc-sample-2',
    name: 'College_ID_Card_and_Certificates.pdf',
    displayName: 'Identity Card & Marks Card (2 Pages)',
    type: 'application/pdf',
    fileSizeFormatted: '1.1 MB',
    fileSizeBytes: 1153433,
    uploadedAt: new Date().toISOString(),
    pageCount: 2,
    initialQualityScore: 82,
    improvedQualityScore: 100,
    pages: [
      {
        pageNumber: 1,
        title: 'Government ID Card Front & Back',
        orientation: 'landscape',
        aspectRatio: '1.414',
        issues: [
          {
            id: 'skew-p1-id',
            type: 'skew',
            severity: 'warning',
            title: 'Card Angle Offset (2.1°)',
            description: 'ID card placed slightly tilted on flatbed glass.',
            suggestedFix: 'Auto-align horizontal edges',
            fixApplied: false
          }
        ],
        previewType: 'id_card',
        contentSummary: 'NATIONAL IDENTITY VERIFICATION CARD — HARSH V. (DOB: 12-04-2004)'
      },
      {
        pageNumber: 2,
        title: 'Academic Grade Transcript',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [],
        previewType: 'table',
        contentSummary: 'SEMESTER VIII CONSOLIDATED GRADE SHEET — RESULT: FIRST CLASS WITH DISTINCTION'
      }
    ]
  },
  {
    id: 'doc-sample-3',
    name: 'Architectural_Floor_Plan_A3.pdf',
    displayName: 'Blueprint Floor Plan A3 (1 Page)',
    type: 'application/pdf',
    fileSizeFormatted: '4.8 MB',
    fileSizeBytes: 5033164,
    uploadedAt: new Date().toISOString(),
    pageCount: 1,
    initialQualityScore: 88,
    improvedQualityScore: 99,
    pages: [
      {
        pageNumber: 1,
        title: 'Robotics Kiosk Assembly Blueprint',
        orientation: 'landscape',
        aspectRatio: '1.414',
        issues: [
          {
            id: 'size-p1-a3',
            type: 'paper_size',
            severity: 'notice',
            title: 'High Resolution CAD Drawing',
            description: 'Vector artwork designed for A3 Presentation size.',
            suggestedFix: 'Recommend A3 paper & High-definition color mode',
            fixApplied: false
          }
        ],
        previewType: 'blueprint',
        contentSummary: 'AUTONOMOUS XEROX MACHINE HARDWARE SCHEMATIC - 1:50 SCALE'
      }
    ]
  }
];

export const MOCK_PHONE_SYNC_PAYLOAD = {
  sessionToken: 'QR-SYNC-984210',
  qrCodeUrl: 'https://smartprint.ai/kiosk/sync?sid=QR-SYNC-984210',
  expiresInSeconds: 300,
  simulatedPhoneDoc: {
    id: 'doc-phone-upload',
    name: 'Mobile_Scanned_Notes_Oct2026.pdf',
    displayName: 'Mobile Scanned Notes (3 Pages)',
    type: 'application/pdf',
    fileSizeFormatted: '1.8 MB',
    fileSizeBytes: 1887436,
    uploadedAt: new Date().toISOString(),
    pageCount: 3,
    initialQualityScore: 78,
    improvedQualityScore: 96,
    pages: [
      {
        pageNumber: 1,
        title: 'Lecture Handwritten Notes',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'contrast-phone-p1',
            type: 'low_contrast',
            severity: 'attention',
            title: 'Phone Camera Shadow Detected',
            description: 'Corner lighting variance detected from hand shadow.',
            suggestedFix: 'Flatten background lighting and enhance ink sharpness',
            fixApplied: false
          }
        ],
        previewType: 'scan',
        contentSummary: 'Embedded Systems & Motor Drivers: Stepper Motor Pulses & Sensors'
      },
      {
        pageNumber: 2,
        title: 'Formula Reference Sheet',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [
          {
            id: 'skew-phone-p2',
            type: 'skew',
            severity: 'warning',
            title: 'Perspective Tilt (4.2°)',
            description: 'Captured at an oblique phone angle.',
            suggestedFix: 'Four-point perspective correction',
            fixApplied: false
          }
        ],
        previewType: 'charts',
        contentSummary: 'Pulse Width Modulation & Duty Cycle Equations'
      },
      {
        pageNumber: 3,
        title: 'Lab Test Bench Results',
        orientation: 'portrait',
        aspectRatio: '0.707',
        issues: [],
        previewType: 'table',
        contentSummary: 'Test Run 14: Laser scanner throughput & print drum temperature'
      }
    ]
  }
};
