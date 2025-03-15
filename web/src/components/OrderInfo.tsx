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
    distance?: number;
    activeDialog?: boolean;
    driverId?: number;
    setNearbyOrders?: (orders: any) => void;
    isDetailPage?: boolean;
    stateOrderStatus?: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
    order,
    distance,
    activeDialog = true,
    driverId,
    setNearbyOrders,
    isDetailPage,
    stateOrderStatus
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
        <div className="bg-gray-200 rounded-xl border-t-[16px] border-[#303030]">
            {order?.status === "pending" && <NewOrderDialog driverId={driverId || 0} order={order} status={order?.status} open={open} handleClose={handleClose} setNearbyOrders={setNearbyOrders} />}
            <div onClick={handleClickOpen}>
                {isDetailPage
                &&
                <img src={order?.scrapImageUrl} alt="scrapImage" className='w-full h-[280px] object-cover' />
                }
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                            <div className="text-[#666] uppercase mb-1">Order #{order?.id || '12941875'}</div>
                            <div className="flex">
                                {distance !== undefined && (
                                    <span className="inline-block bg-[#303030] px-2 py-1 text-[12px] text-white rounded-md mr-2">
                                        {distance.toFixed(2)} km
                                    </span>
                                )}
                                <span className={`inline-block ${order?.status === "accepted" ? "bg-green-500" : "bg-[#303030]"} px-2 py-1 text-[12px] text-white rounded-md capitalize font-bold`}>{stateOrderStatus || order?.status}</span>
                            </div>
                    </div>
                    
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
            </div>
            
        </div>
    )
}

export default OrderInfo