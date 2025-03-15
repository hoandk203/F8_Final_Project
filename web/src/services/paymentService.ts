import axios from 'axios';

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
    const accessToken = localStorage.getItem('access_token');
    
    const response = await axios.post(`${BASE_URL}/payment`, params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const getPaymentsByOrderId = async (
  orderId: number
): Promise<PaymentResponse[]> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    
    const response = await axios.get(`${BASE_URL}/payment/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    const accessToken = localStorage.getItem('access_token');
    
    const response = await axios.get(`${BASE_URL}/payment/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
}; 