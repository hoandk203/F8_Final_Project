"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography, Paper, Box, Button, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getPaymentsByOrderId } from '@/services/paymentService';

const PaymentResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (orderId) {
        try {
          const orderIdNumber = parseInt(orderId);
          
          if (isNaN(orderIdNumber)) {
            setError('Invalid order ID');
            setLoading(false);
            return;
          }
          
          const payments = await getPaymentsByOrderId(orderIdNumber);
          // Lấy payment gần nhất
          if (payments && payments.length > 0) {
            // Sắp xếp theo thời gian tạo giảm dần và lấy mục đầu tiên
            const sortedPayments = [...payments].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPayment(sortedPayments[0]);
          } else {
            setError('Payment information not found');
          }
        } catch (error: any) {
          console.error('Error fetching payment details:', error);
          setError(error.message || 'Error loading payment information');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Order ID not found');
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const handleGoHome = () => {
    router.push('/driver');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isSuccess = status === 'success' || (payment && payment.status === 'success');
  const isError = status === 'error' || status === 'failed' || (payment && payment.status === 'failed');
  const isCanceled = status === 'canceled' || (payment && payment.status === 'canceled');

  return (
    <Box sx={{ p: 2, maxWidth: '600px', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {isSuccess ? (
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green' }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: 80, color: isError ? 'red' : 'orange' }} />
          )}
          
          <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
            {isSuccess ? 'Payment Successful' : isError ? 'Payment Failed' : isCanceled ? 'Payment Canceled' : 'Payment Status'}
          </Typography>
          
          {message && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}
        </Box>

        {payment && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Order ID:</strong> #{payment.orderId}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Amount:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Method:</strong> {payment.method === 'vnpay' ? 'VNPay' : payment.method}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Time:</strong> {new Date(payment.createdAt).toLocaleString('en-US')}
            </Typography>
            {payment.transactionId && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Transaction ID:</strong> {payment.transactionId}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="contained"
            className='bg-[#303030]'
            onClick={handleGoHome}
            sx={{ flex: 1, mr: 1 }}
          >
            Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentResultPage; 