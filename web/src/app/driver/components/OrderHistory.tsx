import OrderInfo from "@/components/OrderInfo";
import { getOrderHistory } from "@/services/driverService";
import { Alert } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

interface Props {
    ordersError: string;
    driverId: number;
}

const OrderHistory = ({ordersError, driverId}: Props) => {

    const [nearbyOrders, setNearbyOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchNearbyOrders = async () => {
            const response = await getOrderHistory(driverId);
            setNearbyOrders(response);
        };
        fetchNearbyOrders();
    }, [driverId]);
    
    return (
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
                            <OrderInfo 
                                order={orderWithDefaults}
                                distance={order.distance}
                                driverId={driverId || 0}
                            />
                        </div>
                    );
                })
            )}
        </div>
    )
}

export default OrderHistory;