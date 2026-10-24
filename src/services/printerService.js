import apiClient from './api';
import { KIOSK_CONFIG } from '../config/printerConfig';

/**
 * Printer Service: Manages hardware diagnostics, status telemetry, and error recovery.
 * Connects to Flask backend /api/printer endpoints.
 */

let currentPrinterState = {
  ...KIOSK_CONFIG.printer,
  lastUpdated: new Date().toISOString()
};

export const printerService = {
  /**
   * Fetch current printer status telemetry from Flask backend
   */
  async getPrinterStatus() {
    try {
      const res = await apiClient.get('/printer/status');
      if (res && res.success && res.data) {
        currentPrinterState = { ...res.data };
        return res;
      }
    } catch (err) {
      // Backend offline, return local telemetry
    }

    return {
      success: true,
      data: { ...currentPrinterState, lastUpdated: new Date().toISOString() }
    };
  },

  /**
   * Diagnostic test hook: change printer status to test kiosk error handling
   * @param {'READY'|'PAPER_JAM'|'PAPER_OUT'|'OFFLINE'} newStatus 
   */
  async setSimulatedHardwareStatus(newStatus) {
    try {
      const res = await apiClient.post('/printer/simulate', { status: newStatus });
      if (res && res.success && res.data) {
        currentPrinterState = { ...res.data };
        return currentPrinterState;
      }
    } catch (err) {
      console.warn('Backend printer simulation endpoint offline, updating locally:', err.message);
    }

    let message = 'Ready to print documents';
    let conn = 'ONLINE';

    if (newStatus === 'PAPER_JAM') {
      message = 'Paper jam detected in Tray 1 feed roller. Open side door B to clear.';
    } else if (newStatus === 'PAPER_OUT') {
      message = 'Tray 1 (A4) is out of paper. Please reload 75 GSM paper.';
    } else if (newStatus === 'OFFLINE') {
      message = 'Printer communication lost. Check USB / LAN cabling.';
      conn = 'DISCONNECTED';
    }

    currentPrinterState = {
      ...currentPrinterState,
      hardwareStatus: newStatus,
      statusMessage: message,
      connectionStatus: conn,
      lastUpdated: new Date().toISOString()
    };

    return currentPrinterState;
  },

  /**
   * Reset printer back to READY
   */
  async resetSimulatedHardware() {
    try {
      const res = await apiClient.post('/printer/reset');
      if (res && res.success && res.data) {
        currentPrinterState = { ...res.data };
        return currentPrinterState;
      }
    } catch (err) {
      // Local fallback
    }
    return this.setSimulatedHardwareStatus('READY');
  }
};
