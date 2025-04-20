"use client"

import StatisticsBox from "@/components/StatisticsBox";
import { getOrderByDriverId } from "@/services/orderService";
import React, { useEffect, useState } from "react";

interface Props {
    driverId: number;
}

const Statistics = ({driverId}: Props) => {
    const [orders, setOrders] = useState<any[]>([]);

    const fetchOrderByDriverId = async () => {
        if (!driverId) return;
        try {
            const response = await getOrderByDriverId(driverId);
            setOrders(response);
        } catch (error) {
            console.log("Error fetching order history:", error);
        }
    }

    const totalAmountDelivered = orders.reduce((total, order) => {
        // Lấy tháng hiện tại
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Kiểm tra xem đơn hàng có phải trong tháng hiện tại không
        const orderDate = new Date(order.modifiedAt);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();
        
        // Chỉ tính tổng cho các đơn hàng trong tháng hiện tại
        if (orderMonth === currentMonth && orderYear === currentYear) {
            return total + order.amount;
        }
        return total;
    }, 0);

    const totalOrders = orders.length;

    useEffect(() => {
        fetchOrderByDriverId().catch();
    }, [driverId]);
    
    

    return (
        <div className="grid grid-cols-2 gap-3 text-black">
            <StatisticsBox label={"Amount delivered (m)"} data={totalAmountDelivered} unit={"dollars"}/>
            <StatisticsBox label={"Total orders"} data={totalOrders} unit={"orders"}/>
        </div>
    )
}

export default Statistics