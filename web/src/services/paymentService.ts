import axios from 'axios';
import { clientCookies } from '@/utils/cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CreatePaymentParams {
  orderId: number;
  amount: number;
  method: string;
  returnUrl?: string;
}

interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  method: string;
  transactionId?: string;
  transactionRef?: string;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createPayment = async (
  params: CreatePaymentParams
): Promise<PaymentResponse> => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    const response = await axios.post(`${BASE_URL}/payment`, params, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePayment = async (
  paymentId: number,
  paymentUrl: string
): Promise<PaymentResponse> => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    const response = await axios.put(`${BASE_URL}/payment/${paymentId}`, {
      paymentUrl: paymentUrl
    }, { 
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};



export const getPaymentsByOrderId = async (
  orderId: number
): Promise<PaymentResponse[]> => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    const response = await axios.get(`${BASE_URL}/payment/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentById = async (
  paymentId: number
): Promise<PaymentResponse> => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    const response = await axios.get(`${BASE_URL}/payment/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
}; 