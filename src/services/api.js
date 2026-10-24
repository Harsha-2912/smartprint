import axios from 'axios';

/**
 * SmartPrint AI Core HTTP Client
 * Pre-configured for seamless Flask backend integration.
 * In DEMO_MODE, requests gracefully fall back to deterministic mock handlers.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';
export const BACKEND_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');
export const IS_DEMO_MODE = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'X-Client-Interface': 'SmartPrint-Kiosk-10.1'
  }
});

// Request Interceptor: Attach kiosk session or auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const sessionToken = sessionStorage.getItem('smartprint_session_token');
    if (sessionToken) {
      config.headers['X-Session-Token'] = sessionToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is not running, log cleanly
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('[SmartPrint API] Backend is currently offline or unreachable. Utilizing self-service demo mode.', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
