import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { PrintSessionProvider } from './context/PrintSessionContext';
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';
import StepIndicator from './components/common/StepIndicator';
import KioskInactivityGuard from './components/common/KioskInactivityGuard';


import Home from './pages/Home';
import Upload from './pages/Upload';
import Preview from './pages/Preview';
import AIAnalysis from './pages/AIAnalysis';
import PrintSettings from './pages/PrintSettings';
import Payment from './pages/Payment';
import Printing from './pages/Printing';
import Success from './pages/Success';
import Help from './pages/Help';

// Custom MUI Theme tuned for SmartPrint AI Kiosk
const kioskTheme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      light: '#EFF6FF',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#7C3AED',
      light: '#F5F3FF',
      dark: '#6D28D9',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#10B981',
      light: '#ECFDF5',
      dark: '#059669',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#F59E0B',
      light: '#FFFBEB',
      dark: '#D97706',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#F43F5E',
      light: '#FFF1F2',
      dark: '#E11D48',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F5F7FF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#172033',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 14
  }
});

function KioskLayout({ children }) {
  return (
    <div className="kiosk-shell">
      <KioskInactivityGuard />
      <AppHeader />
      <StepIndicator />
      <main className="kiosk-main-content">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}


export default function App() {
  return (
    <ThemeProvider theme={kioskTheme}>
      <CssBaseline />
      <PrintSessionProvider>
        <BrowserRouter>
          <KioskLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/ai-analysis" element={<AIAnalysis />} />
              <Route path="/settings" element={<PrintSettings />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/printing" element={<Printing />} />
              <Route path="/success" element={<Success />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </KioskLayout>
        </BrowserRouter>
      </PrintSessionProvider>
    </ThemeProvider>
  );
}
