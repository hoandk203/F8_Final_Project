"use client"
import React, { useState } from "react";
import OrderInfo from "@/components/OrderInfo";
import { Alert } from "@mui/material";
import Link from "next/link";

interface OrderManagerProps {
    nearbyOrders: any[];
    ordersError: string;
    driverId: number;
    setNearbyOrders: (orders: any) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({ 
    nearbyOrders, 
    ordersError,
    driverId,
    setNearbyOrders
}) => {
    const [step, setStep] = useState(1);

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
                                    <div key={order.id}>
                                        {order.status === "accepted" || order.status === "on moving"
                                        ?
                                        <div>
                                            <Link href={`/driver/order-status/${order.id}`}>
                                                <OrderInfo 
                                                    order={orderWithDefaults}
                                                    distance={order.distance}
                                                    driverId={driverId || 0}
                                                />
                                            </Link>
                                        </div>
                                        :
                                        <div>
                                            <OrderInfo 
                                                order={orderWithDefaults}
                                                distance={order.distance}
                                                driverId={driverId || 0}
                                                setNearbyOrders={setNearbyOrders}
                                            />
                                        </div>
                                        }
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
                {step === 2 && <h3>Order History</h3>}
                {step === 3 && <h3>Cancelled orders</h3>}
            </div>
        </div>
    )
}

export default OrderManager