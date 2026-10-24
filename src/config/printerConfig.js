/**
 * Hardware Kiosk Specifications & Printer Status Registry
 * Provides realistic hardware metadata and diagnostic states for testing and integration.
 */

export const KIOSK_CONFIG = {
  kioskId: 'KIOSK-BLR-04',
  terminalName: 'SmartPrint AI Self-Service Station #4',
  facility: 'Innovation Tech Hub & Library',
  floor: 'Ground Floor Atrium',
  supportPhone: '+91 1800 572 8900',
  supportEmail: 'kiosk-support@smartprint.ai',
  softwareVersion: 'v2.4.0-Production',
  sessionTimeoutSeconds: 120, // Auto-reset inactive kiosk screen after 2 minutes
  
  printer: {
    model: 'Xerox AltaLink® C8170 Pro Multifunction Kiosk Engine',
    ipAddress: '192.168.1.140',
    serialNumber: 'XER-AL8170-88492K',
    firmware: '101.008.019.23100',
    hardwareStatus: 'READY', // 'READY', 'PRINTING', 'PAPER_JAM', 'PAPER_OUT', 'OFFLINE'
    statusMessage: 'Ready to print documents',
    connectionStatus: 'ONLINE', // 'ONLINE', 'DISCONNECTED', 'DEGRADED'
    dpi: '1200 x 2400 DPI Ultra High Res',
    speedPpm: '70 ppm',
    
    trays: [
      { id: 1, name: 'Tray 1', size: 'A4', status: 'OK', capacityPercent: 92, sheetsLeft: 460 },
      { id: 2, name: 'Tray 2', size: 'A3', status: 'OK', capacityPercent: 78, sheetsLeft: 390 },
      { id: 3, name: 'Tray 3', size: 'Letter', status: 'OK', capacityPercent: 100, sheetsLeft: 500 }
    ],

    toner: {
      black: { levelPercent: 94, status: 'GOOD', color: '#172033' },
      cyan: { levelPercent: 88, status: 'GOOD', color: '#06B6D4' },
      magenta: { levelPercent: 91, status: 'GOOD', color: '#EC4899' },
      yellow: { levelPercent: 89, status: 'GOOD', color: '#FACC15' }
    },

    fuserTemp: '185°C (Optimal)',
    drumLifePercent: 96
  },

  supportedFileFormats: [
    { ext: '.pdf', mime: 'application/pdf', label: 'PDF Document' },
    { ext: '.jpg', mime: 'image/jpeg', label: 'JPEG Image' },
    { ext: '.jpeg', mime: 'image/jpeg', label: 'JPEG Image' },
    { ext: '.png', mime: 'image/png', label: 'PNG Image' }
  ],

  maxFileSizeMB: 25,
  maxPagesPerJob: 150
};
