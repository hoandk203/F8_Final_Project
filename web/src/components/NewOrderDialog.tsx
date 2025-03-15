"use client"

import * as React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import OrderInfo from "@/components/OrderInfo";
import CustomButton from "@/components/CustomButton";
import { acceptOrder, declineOrder, updateDriver } from "@/services/driverService";
import { useRouter } from "next/navigation";

interface NewOrderDialogProps {
    open: boolean
    handleClose: () => void
    status: string
    order: any
    driverId: number
    setNearbyOrders?: (orders: any) => void;
}

const NewOrderDialog: React.FC<NewOrderDialogProps> = ({open, handleClose, status, order, driverId, setNearbyOrders}) => {
    const router = useRouter();
    // Xử lý chấp nhận đơn hàng
    const handleAcceptOrder = async () => {
      try {
        await acceptOrder(order.id, driverId);
        await updateDriver(driverId, {status: "busy"});
        router.push(`/driver/order-status/${order.id}`);
      } catch (error) {
        console.error('Error accepting order:', error);
      }
    };

  // Xử lý từ chối đơn hàng
  const handleDeclineOrder = async () => {
      try {
        await declineOrder(order.id, driverId);
        // Cập nhật state để ẩn order khỏi giao diện ngay lập tức
        order.status = 'declined';
        handleClose();
        if (setNearbyOrders) {
          setNearbyOrders((prevOrders: any) => prevOrders.filter((o: any) => o.id !== order.id));
        }
      } catch (error) {
        console.error('Error declining order:', error);
      }
  };
    
    return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '90%',
            maxWidth: '700px',
            margin: '0 auto',
          },
        }}
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
            <div>
              <h3 className="font-bold text-xl">You got new order!</h3>
              <span>Check information carefully before accept</span>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="!p-4">
          <div id="alert-dialog-description" className="text-black text-[14px]">
            <OrderInfo activeDialog={false} order={order}/>
          </div>
        </DialogContent>
        <DialogActions className="grid grid-cols-2 gap-3 font-semibold pt-0 pb-4 px-4">
              <CustomButton handleDeclineOrder={handleDeclineOrder} label={"Decline"} variant={"light"} size={"large"}/>
              <CustomButton handleAcceptOrder={handleAcceptOrder} label={"Accept"} variant={"dark"} size={"large"}/>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewOrderDialog;
