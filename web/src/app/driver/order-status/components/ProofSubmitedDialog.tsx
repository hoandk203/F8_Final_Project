"use client"

import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CustomButton from "@/components/CustomButton";
import OrderInfo from '@/components/OrderInfo';
import { createPayment } from '@/services/paymentService';
import { toast } from 'react-toastify';

interface ProofSubmitedDialogProps {
    open: boolean
    handleClose: () => void
    order: any
    stateOrderStatus: string
    paymentUrl: string
}

const ProofSubmitedDialog = ({ open, handleClose, order, stateOrderStatus, paymentUrl }: ProofSubmitedDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoHome = () => {
    handleClose();
    window.location.href = "/driver";
  };
  
  const handleGoToPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Nếu có payment URL, chuyển hướng người dùng đến trang thanh toán
      window.location.href = paymentUrl || "";
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Something went wrong when creating payment');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="py-0 px-4">
          <div className="text-[14px] text-center">
            <div>
              <LocalShippingOutlinedIcon className="text-[100px]"/>
            </div>
            <div className='mb-2'>
              <h3 className="font-bold text-xl">Proof submited</h3>
              <span>Thank for picking up the order!</span>
            </div>
            <OrderInfo order={order} stateOrderStatus={stateOrderStatus}/>
          </div>
        </DialogTitle>
        <DialogActions className="grid grid-cols-1 font-semibold pt-4 pb-4 px-4 gap-y-2">
            <CustomButton 
              label={isProcessing ? "Loading..." : "Go to payment"} 
              variant={"dark"} 
              size={"large"}
              disabled={isProcessing}
              handleGoToPayment={handleGoToPayment}
            />
            <CustomButton 
              handleCloseDialog={handleGoHome} 
              label={"Home"} 
              variant={"light"} 
              size={"large"}
              disabled={isProcessing}
            />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProofSubmitedDialog;