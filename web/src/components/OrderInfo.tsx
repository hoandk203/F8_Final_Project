"use client"

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import InboxIcon from '@mui/icons-material/Inbox';
import React, { useEffect } from 'react';
import NewOrderDialog from './NewOrderDialog';
import { Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface OrderInfoProps {
    order: any;
    status: string;
    distance?: number;
    activeDialog?: boolean;
    onAccept?: (orderId: number) => void;
    onDecline?: (orderId: number) => void;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
    order,
    status,
    distance,
    activeDialog = true,
    onAccept,
    onDecline
}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (!activeDialog) return;
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="bg-gray-200 rounded-xl p-4">
            {status === "pending" && <NewOrderDialog order={order} status={status} open={open} handleClose={handleClose} />}
            <div onClick={handleClickOpen}>
                {status === "pending" ? (
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-start">
                            <div className="text-[#666] uppercase mb-1">Order #{order?.id || '12941875'}</div>
                            <span className="inline-block bg-[#303030] px-2 py-1 text-[12px] text-white rounded-md capitalize">{status}</span>
                            {distance !== undefined && (
                                <span className="inline-block bg-[#303030] px-2 py-1 text-[12px] text-white rounded-md ml-2">
                                    {distance} km
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-[#666] uppercase mb-1">Order #{order?.id || '12941875'}</div>
                        <span className="inline-block bg-black px-2 py-1 text-[12px] text-white rounded-md capitalize">{status}</span>
                    </div>
                )}
                
                <div className="flex flex-col gap-2 text-start">
                    <h3 className="capitalize text-[16px] font-bold">{order?.store?.name || "Spice Haven Restaurant"}</h3>
                    <div className="flex gap-2 items-center">
                        <LocationOnOutlinedIcon />
                        <p>{order?.store?.location || "14/2 Connaught Cirus, Block M, Concaught Place, New Delhi, Delhi 110001, India"}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <PhoneOutlinedIcon />
                        <p>{order?.store?.phone || "(+91) 9812345678"}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <InboxIcon />
                        <p>~{order?.orderDetails?.[0]?.weight || 15}kg - {order?.orderDetails?.[0]?.materialname || "Scrap carton"}</p>
                    </div>
                </div>
            </div>
            
            {/* Nút chấp nhận/từ chối chỉ hiển thị cho đơn hàng đang chờ */}
            {status === "pending" && onAccept && onDecline && (
                <div className="flex justify-between mt-4">
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => onAccept(order.id)}
                        className="w-[48%] bg-[#303030] text-white"
                    >
                        Accept
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => onDecline(order.id)}
                        className="w-[48%] bg-[#efeef3] text-[#303030]"
                    >
                        Decline
                    </Button>
                </div>
            )}
        </div>
    )
}

export default OrderInfo