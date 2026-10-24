import apiClient from './api';

/**
 * Payment Service for handling kiosk UPI checkout and digital transactions.
 * Integrates directly with Flask backend and handles verification & simulation.
 */

export const paymentService = {
  /**
   * Create a payment order for the print session
   * @param {Object} orderDetails 
   */
  async createPaymentOrder(orderDetails) {
    try {
      const res = await apiClient.post('/payments/create-order', orderDetails);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn('Backend payment order creation unavailable, using local generator:', err.message);
    }

    const orderId = 'ORD-SP-' + Math.floor(100000 + Math.random() * 900000);
    const upiString = `upi://pay?pa=smartprint.kiosk@icici&pn=SmartPrintAI&am=${orderDetails.totalAmount}&cu=INR&tn=KioskPrint_${orderId}`;

    return {
      success: true,
      orderId,
      upiString,
      amount: orderDetails.totalAmount,
      currency: 'INR',
      status: 'AWAITING_PAYMENT',
      expiresInSeconds: 300
    };
  },

  /**
   * Check payment status
   * @param {string} orderId 
   */
  async checkPaymentStatus(orderId) {
    try {
      const res = await apiClient.get(`/payments/${orderId}/status`);
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      // Offline fallback
    }

    return {
      orderId,
      status: 'AWAITING_PAYMENT'
    };
  },

  /**
   * Simulate a successful test payment for kiosk demonstration
   * @param {string} orderId 
   * @param {number} amount 
   */
  async simulateSuccessfulPayment(orderId, amount) {
    try {
      const res = await apiClient.post(`/payments/${orderId}/simulate`, { outcome: 'SUCCESS' });
      if (res && res.success) {
        return res;
      }
    } catch (err) {
      console.warn('Backend payment simulation unavailable, using local settlement:', err.message);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId,
          transactionRef: 'UPI-TXN-' + Math.floor(100000000000 + Math.random() * 900000000000),
          amount,
          status: 'SUCCESS',
          paidAt: new Date().toISOString(),
          paymentMethod: 'UPI (Google Pay / PhonePe / Paytm / BHIM)',
          demoMode: true
        });
      }, 1200);
    });
  },

  /**
   * Simulate a failed test payment to demonstrate error recovery
   * @param {string} orderId 
   */
  async simulateFailedPayment(orderId) {
    try {
      const res = await apiClient.post(`/payments/${orderId}/simulate`, { outcome: 'FAILED' });
      if (res) {
        return res;
      }
    } catch (err) {
      console.warn('Backend payment failure simulation unavailable, using local response:', err.message);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          orderId,
          status: 'FAILED',
          errorCode: 'BANK_TIMEOUT_OR_USER_DECLINED',
          errorMessage: 'Bank server response timeout or cancelled on mobile app.',
          demoMode: true
        });
      }, 800);
    });
  }
};
