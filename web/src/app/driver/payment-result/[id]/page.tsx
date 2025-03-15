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
  
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (orderId) {
        try {
          const payments = await getPaymentsByOrderId(Number(orderId));
          // Lấy payment gần nhất
          if (payments && payments.length > 0) {
            setPayment(payments[payments.length - 1]);
          }
        } catch (error) {
          console.error('Error fetching payment details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const handleGoHome = () => {
    router.push('/driver');
  };

  const handleViewOrder = () => {
    if (orderId) {
      router.push(`/driver/orders/${orderId}`);
    } else {
      router.push('/driver/orders');
    }
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
            {isSuccess ? 'Thanh toán thành công' : isError ? 'Thanh toán thất bại' : isCanceled ? 'Thanh toán đã hủy' : 'Trạng thái thanh toán'}
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
              <strong>Mã đơn hàng:</strong> #{payment.orderId}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Phương thức:</strong> {payment.method === 'vnpay' ? 'VNPay' : payment.method}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Thời gian:</strong> {new Date(payment.createdAt).toLocaleString('vi-VN')}
            </Typography>
            {payment.transactionId && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mã giao dịch:</strong> {payment.transactionId}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={handleGoHome}
            sx={{ flex: 1, mr: 1 }}
          >
            Về trang chủ
          </Button>
          <Button 
            variant="contained" 
            onClick={handleViewOrder}
            sx={{ flex: 1, ml: 1, bgcolor: '#1F2937', '&:hover': { bgcolor: '#111827' } }}
          >
            Xem đơn hàng
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentResultPage; 