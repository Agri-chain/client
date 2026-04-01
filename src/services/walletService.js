import api from "./api.js";

const API_URL = import.meta.env.PROD
  ? 'https://smartkissann.vercel.app/api/v1'
  : (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1");

export const walletService = {
  // Get wallet details
  getWallet: async () => {
    const response = await api.get(`${API_URL}/wallet`);
    return response.data;
  },

  // Add bank account
  addBankAccount: async (bankData) => {
    const response = await api.post(`${API_URL}/wallet/bank-account`, bankData);
    return response.data;
  },

  // Get bank accounts
  getBankAccounts: async () => {
    const response = await api.get(`${API_URL}/wallet/bank-accounts`);
    return response.data;
  },

  // Delete bank account
  deleteBankAccount: async (accountId) => {
    const response = await api.delete(`${API_URL}/wallet/bank-account/${accountId}`);
    return response.data;
  },

  // Set default bank account
  setDefaultBankAccount: async (accountId) => {
    const response = await api.put(`${API_URL}/wallet/bank-account/${accountId}/default`);
    return response.data;
  },

  // Add money to wallet (via Razorpay)
  addMoney: async (data) => {
    const response = await api.post(`${API_URL}/wallet/add-money`, data);
    return response.data;
  },

  // Withdraw money from wallet
  withdrawMoney: async (data) => {
    const response = await api.post(`${API_URL}/wallet/withdraw`, data);
    return response.data;
  },

  // Send money to another user
  sendMoney: async (data) => {
    const response = await api.post(`${API_URL}/wallet/send`, data);
    return response.data;
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const { page = 1, limit = 20, type } = params;
    const queryString = new URLSearchParams({ page, limit, ...(type && { type }) }).toString();
    const response = await api.get(`${API_URL}/wallet/transactions?${queryString}`);
    return response.data;
  },

  // Generate UPI ID
  generateUpiId: async () => {
    const response = await api.post(`${API_URL}/wallet/generate-upi`);
    return response.data;
  }
};

// Razorpay payment service
export const razorpayService = {
  // Get Razorpay key
  getKey: async () => {
    const response = await api.get(`${API_URL}/payment/key`);
    return response.data;
  },

  // Create order for adding money
  createOrder: async (amount) => {
    const response = await api.post(`${API_URL}/payment/create-order`, { amount });
    return response.data;
  },

  // Create order for sending money
  createOrderForSend: async (amount, recipientUpiId, note) => {
    const response = await api.post(`${API_URL}/payment/create-order-send`, { 
      amount, 
      recipientUpiId, 
      note 
    });
    return response.data;
  },

  // Verify payment for adding money
  verifyPayment: async (paymentData) => {
    const response = await api.post(`${API_URL}/payment/verify`, paymentData);
    return response.data;
  },

  // Verify payment for sending money
  verifyPaymentForSend: async (paymentData) => {
    const response = await api.post(`${API_URL}/payment/verify-send`, paymentData);
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`${API_URL}/payment/details/${paymentId}`);
    return response.data;
  }
};
