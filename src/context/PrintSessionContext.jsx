import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { calculatePrintPrice } from '../config/pricingConfig';
import { MOCK_SAMPLE_DOCUMENTS } from '../config/mockDocuments';
import { KIOSK_CONFIG } from '../config/printerConfig';
import { printerService } from '../services/printerService';
import { paymentService } from '../services/paymentService';
import { jobService } from '../services/jobService';
import { documentService } from '../services/documentService';
import apiClient from '../services/api';

const PrintSessionContext = createContext(null);

const DEFAULT_SETTINGS = {
  paperSize: 'a4',
  colorMode: 'bw',
  printSides: 'single',
  orientation: 'auto',
  pageRangeMode: 'all',
  customPageRange: '',
  selectedPages: [], // Empty means all pages
  copies: 1,
  fitToPage: true,
  margins: 'normal',
  collate: true
};

export function PrintSessionProvider({ children }) {
  // Document State
  const [document, setDocument] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('device');

  // AI State
  const [aiAnalysis, setAiAnalysis] = useState({
    isAnalysed: false,
    isScanning: false,
    qualityScore: 74,
    improvedScore: 98,
    correctionsApplied: false,
    appliedIssueIds: [],
    excludedPages: [] // e.g. blank pages removed
  });

  // Settings State
  const [printSettings, setPrintSettings] = useState(DEFAULT_SETTINGS);

  // Kiosk Hardware Telemetry
  const [printerTelemetry, setPrinterTelemetry] = useState(KIOSK_CONFIG.printer);

  // Order & Payment State
  const [order, setOrder] = useState({
    orderId: null,
    upiString: null,
    status: 'idle', // 'idle' | 'awaiting_payment' | 'verifying' | 'payment_success' | 'payment_failed'
    transactionRef: null,
    paidAt: null,
    errorMessage: null
  });

  // Print Execution State
  const [job, setJob] = useState({
    jobId: null,
    status: 'idle', // 'idle' | 'preparing' | 'waiting_for_printer' | 'sending_job' | 'printing' | 'completed' | 'paused' | 'paper_out' | 'paper_jam' | 'failed'
    progressPercent: 0,
    currentPage: 0,
    totalImpressions: 0,
    estimatedSecondsRemaining: 0,
    errorMessage: null
  });

  // Poll printer telemetry periodically or on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchPrinter() {
      const res = await printerService.getPrinterStatus();
      if (res && res.data && isMounted) {
        setPrinterTelemetry(res.data);
      }
    }
    fetchPrinter();
    const interval = setInterval(fetchPrinter, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Update effective selected pages when document changes
  useEffect(() => {
    if (document) {
      if (printSettings.pageRangeMode === 'all') {
        // Exclude pages that were removed by AI (e.g., blank pages)
        const allPages = Array.from({ length: document.pageCount }, (_, i) => i + 1)
          .filter(p => !aiAnalysis.excludedPages.includes(p));
        setPrintSettings(prev => ({ ...prev, selectedPages: allPages }));
      }
    } else {
      setPrintSettings(DEFAULT_SETTINGS);
    }
  }, [document, aiAnalysis.excludedPages]);

  // Recalculate price dynamically whenever settings change
  const pricing = useMemo(() => {
    if (!document) {
      return calculatePrintPrice({
        totalPages: 1,
        selectedPages: [1],
        copies: 1,
        colorMode: 'bw',
        paperSize: 'a4',
        printSides: 'single'
      });
    }

    return calculatePrintPrice({
      totalPages: document.pageCount,
      selectedPages: printSettings.selectedPages,
      copies: printSettings.copies,
      colorMode: printSettings.colorMode,
      paperSize: printSettings.paperSize,
      printSides: printSettings.printSides
    });
  }, [document, printSettings]);

  // Set single setting helper
  const updateSetting = (key, value) => {
    setPrintSettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // If switching pageRangeMode to 'all', restore all non-excluded pages
      if (key === 'pageRangeMode' && value === 'all' && document) {
        updated.selectedPages = Array.from({ length: document.pageCount }, (_, i) => i + 1)
          .filter(p => !aiAnalysis.excludedPages.includes(p));
      }
      return updated;
    });
  };

  // Toggle page inclusion/exclusion
  const togglePageSelection = (pageNumber) => {
    setPrintSettings(prev => {
      const exists = prev.selectedPages.includes(pageNumber);
      let nextPages = [];
      if (exists) {
        // Cannot deselect all pages
        if (prev.selectedPages.length <= 1) return prev;
        nextPages = prev.selectedPages.filter(p => p !== pageNumber);
      } else {
        nextPages = [...prev.selectedPages, pageNumber].sort((a, b) => a - b);
      }
      return {
        ...prev,
        pageRangeMode: 'custom',
        selectedPages: nextPages
      };
    });
  };

  // Rotate a page manually in the document
  const rotateDocumentPage = (pageNumber) => {
    if (!document) return;
    setDocument(prev => {
      if (!prev) return prev;
      const updatedPages = prev.pages.map(p => {
        if (p.pageNumber === pageNumber) {
          const currentRotation = p.rotation || 0;
          return { ...p, rotation: (currentRotation + 90) % 360 };
        }
        return p;
      });
      return { ...prev, pages: updatedPages };
    });
  };

  // Load sample document for fast kiosk testing
  const loadSampleDocument = (sampleIndex = 0) => {
    const sample = MOCK_SAMPLE_DOCUMENTS[sampleIndex] || MOCK_SAMPLE_DOCUMENTS[0];
    const cloned = JSON.parse(JSON.stringify(sample));
    setDocument(cloned);
    setAiAnalysis({
      isAnalysed: false,
      isScanning: false,
      qualityScore: cloned.initialQualityScore || 74,
      improvedScore: cloned.improvedQualityScore || 98,
      correctionsApplied: false,
      appliedIssueIds: [],
      excludedPages: []
    });
    setOrder({
      orderId: null,
      upiString: null,
      status: 'idle',
      transactionRef: null,
      paidAt: null,
      errorMessage: null
    });
    setJob({
      jobId: null,
      status: 'idle',
      progressPercent: 0,
      currentPage: 0,
      totalImpressions: 0,
      estimatedSecondsRemaining: 0,
      errorMessage: null
    });
  };

  // Trigger AI analysis scan
  const startAIAnalysis = async () => {
    if (!document) return;
    setAiAnalysis(prev => ({ ...prev, isScanning: true }));
    try {
      const res = await documentService.analyzeDocument(document.id);
      setAiAnalysis(prev => ({
        ...prev,
        isScanning: false,
        isAnalysed: true,
        qualityScore: res?.score || document.initialQualityScore || 74
      }));
    } catch (e) {
      setAiAnalysis(prev => ({
        ...prev,
        isScanning: false,
        isAnalysed: true,
        qualityScore: document.initialQualityScore || 74
      }));
    }
  };

  // Apply all AI corrections
  const applyAllAICorrections = async () => {
    if (!document) return;
    
    // Identify issues to fix
    const appliedIds = [];
    const blankPageNums = [];
    const updatedPages = document.pages.map(page => {
      const fixedIssues = (page.issues || []).map(issue => {
        appliedIds.push(issue.id);
        if (issue.type === 'blank_page') {
          blankPageNums.push(page.pageNumber);
        }
        return { ...issue, fixApplied: true };
      });

      let rotation = page.rotation || 0;
      if (page.issues?.some(i => i.type === 'rotation')) {
        rotation = 0; // Fix upright
      }

      return {
        ...page,
        rotation,
        deskewed: true,
        contrastEnhanced: true,
        issues: fixedIssues
      };
    });

    // Notify backend
    try {
      await documentService.applyCorrections(document.id, appliedIds);
    } catch (err) {
      // Handled in service
    }

    setDocument(prev => ({ ...prev, pages: updatedPages }));
    setAiAnalysis({
      isAnalysed: true,
      isScanning: false,
      qualityScore: document.improvedQualityScore || 98,
      improvedScore: document.improvedQualityScore || 98,
      correctionsApplied: true,
      appliedIssueIds: appliedIds,
      excludedPages: blankPageNums
    });
  };

  // Demo Payment Actions
  const initPaymentOrder = async () => {
    const res = await paymentService.createPaymentOrder({
      totalAmount: pricing.grandTotal,
      documentName: document?.displayName || 'Document',
      pages: pricing.effectivePagesCount,
      copies: printSettings.copies
    });
    setOrder({
      orderId: res.orderId,
      upiString: res.upiString,
      status: 'awaiting_payment',
      transactionRef: null,
      paidAt: null,
      errorMessage: null
    });
    return res;
  };

  const simulatePaymentSuccess = async () => {
    if (!order.orderId) await initPaymentOrder();
    setOrder(prev => ({ ...prev, status: 'verifying' }));
    const res = await paymentService.simulateSuccessfulPayment(order.orderId, pricing.grandTotal);
    setOrder({
      orderId: res.orderId,
      upiString: null,
      status: 'payment_success',
      transactionRef: res.transactionRef,
      paidAt: res.paidAt,
      errorMessage: null
    });
    return res;
  };

  const simulatePaymentFailure = async () => {
    if (!order.orderId) await initPaymentOrder();
    setOrder(prev => ({ ...prev, status: 'verifying' }));
    const res = await paymentService.simulateFailedPayment(order.orderId);
    setOrder(prev => ({
      ...prev,
      status: 'payment_failed',
      errorMessage: res.errorMessage
    }));
    return res;
  };

  // Job Execution Simulation
  const startPrintExecution = async () => {
    if (order.status !== 'payment_success') {
      console.warn('Cannot print without verified payment confirmation.');
      return;
    }

    const jobRes = await jobService.submitPrintJob({
      documentId: document.id,
      totalPages: pricing.effectivePagesCount,
      copies: printSettings.copies,
      colorMode: printSettings.colorMode,
      paperSize: printSettings.paperSize,
      printSides: printSettings.printSides
    });

    const totalImp = pricing.totalImpressions;

    setJob({
      jobId: jobRes.jobId,
      status: 'preparing',
      progressPercent: 5,
      currentPage: 1,
      totalImpressions: totalImp,
      estimatedSecondsRemaining: Math.max(5, totalImp * 2),
      errorMessage: null
    });
  };

  const updateJobStatus = (newStatus, progress = 0, currPage = 1, error = null) => {
    setJob(prev => ({
      ...prev,
      status: newStatus,
      progressPercent: progress,
      currentPage: currPage,
      errorMessage: error
    }));
  };

  // Hardware Status Controls (for demo simulation)
  const setHardwareDiagnostic = async (status) => {
    const updated = await printerService.setSimulatedHardwareStatus(status);
    if (updated) {
      setPrinterTelemetry({ ...updated });
    }
  };

  // Full Reset (Cleans up previous user session data)
  const resetSession = async () => {
    setDocument(null);
    setUploadMethod('device');
    setAiAnalysis({
      isAnalysed: false,
      isScanning: false,
      qualityScore: 74,
      improvedScore: 98,
      correctionsApplied: false,
      appliedIssueIds: [],
      excludedPages: []
    });
    setPrintSettings(DEFAULT_SETTINGS);
    setOrder({
      orderId: null,
      upiString: null,
      status: 'idle',
      transactionRef: null,
      paidAt: null,
      errorMessage: null
    });
    setJob({
      jobId: null,
      status: 'idle',
      progressPercent: 0,
      currentPage: 0,
      totalImpressions: 0,
      estimatedSecondsRemaining: 0,
      errorMessage: null
    });
    
    // Purge backend session
    try {
      await apiClient.post('/session/reset');
    } catch (err) {
      // Offline fallback
    }

    await printerService.resetSimulatedHardware();
    setPrinterTelemetry(KIOSK_CONFIG.printer);
  };

  const value = {
    // State
    document,
    setDocument,
    uploadMethod,
    setUploadMethod,
    aiAnalysis,
    printSettings,
    pricing,
    printerTelemetry,
    order,
    job,

    // Guards
    canProceedToPreview: !!document,
    canProceedToSettings: !!document,
    canProceedToPayment: !!document && pricing.grandTotalNumber > 0,
    canProceedToPrinting: order.status === 'payment_success',
    canProceedToSuccess: job.status === 'completed',

    // Actions
    updateSetting,
    togglePageSelection,
    rotateDocumentPage,
    loadSampleDocument,
    startAIAnalysis,
    applyAllAICorrections,
    initPaymentOrder,
    simulatePaymentSuccess,
    simulatePaymentFailure,
    startPrintExecution,
    updateJobStatus,
    setHardwareDiagnostic,
    resetSession
  };

  return (
    <PrintSessionContext.Provider value={value}>
      {children}
    </PrintSessionContext.Provider>
  );
}

export function usePrintSession() {
  const context = useContext(PrintSessionContext);
  if (!context) {
    throw new Error('usePrintSession must be used within a PrintSessionProvider');
  }
  return context;
}
