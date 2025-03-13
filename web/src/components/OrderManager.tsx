"use client"
import React, { useState } from "react";
import OrderInfo from "@/components/OrderInfo";
import { Alert } from "@mui/material";

interface Order {
    id: number;
    distance: number;
    store: any;
    orderDetails: any[];
    // Các trường khác của đơn hàng
}

interface OrderManagerProps {
    nearbyOrders: Order[];
    ordersError: string;
    onRefresh: () => void;
    onAcceptOrder: (orderId: number) => void;
    onDeclineOrder: (orderId: number) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ 
    nearbyOrders, 
    ordersError, 
    onRefresh,
    onAcceptOrder,
    onDeclineOrder
}) => {
    const [step, setStep] = useState(1);
    console.log(nearbyOrders);
    return (
        <div>
            <div className="flex justify-around mb-3">
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(1)
                    }}>
                    <span className={step === 1 ? "text-black" : "text-[#666]"}>Ongoing orders</span>
                    {step === 1 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(2)
                    }}>
                    <span className={step === 2 ? "text-black" : "text-[#666]"}>Orders history</span>
                    {step === 2 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(3)
                    }}>
                    <span className={step === 3 ? "text-black" : "text-[#666]"}>Cancelled orders</span>
                    {step === 3 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
            </div>
            <div className="">
                {step === 1 && (
                    <div className="flex flex-col gap-y-3">
                        {ordersError ? (
                            <Alert severity="error" className="mb-3">
                                {ordersError}
                            </Alert>
                        ) : nearbyOrders.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                Dont have any order in 5km
                            </div>
                        ) : (
                            nearbyOrders.map((order) => {
                                // Đảm bảo order có đủ thông tin cần thiết
                                const orderWithDefaults = {
                                    ...order,
                                    store: order.store || { name: "Unknown Store", location: "Unknown Location", phone: "Unknown" },
                                    orderDetails: order.orderDetails || []
                                };
                                
                                return (
                                    <OrderInfo 
                                        key={order.id} 
                                        order={orderWithDefaults} 
                                        status="pending" 
                                        distance={order.distance}
                                        onAccept={() => onAcceptOrder(order.id)}
                                        onDecline={() => onDeclineOrder(order.id)}
                                    />
                                );
                            })
                        )}
                        <button 
                            onClick={onRefresh}
                            className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full"
                        >
                            Refresh
                        </button>
                    </div>
                )}
                {step === 2 && <h3>Order History</h3>}
                {step === 3 && <h3>Cancelled orders</h3>}
            </div>
        </div>
    )
}

export default OrderManager