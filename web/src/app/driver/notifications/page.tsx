"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DriverBottomNav from "../components/DriverBottomNav";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getUnpaidPayments } from "@/services/driverService";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto pb-20">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <NotificationsIcon className="mr-2" />
          <h1 className="text-2xl font-bold">Thông báo</h1>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Đơn hàng mới trong khu vực của bạn</h3>
                <p className="text-sm text-gray-500">Có 3 đơn hàng mới cần thu gom</p>
              </div>
              <span className="text-xs text-gray-400">2 giờ trước</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Thanh toán thành công</h3>
                <p className="text-sm text-gray-500">Bạn đã nhận được 50.000 VND cho đơn hàng #12345</p>
              </div>
              <span className="text-xs text-gray-400">Hôm qua</span>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Cập nhật hệ thống</h3>
                <p className="text-sm text-gray-500">Hệ thống sẽ bảo trì từ 23:00 - 01:00 ngày mai</p>
              </div>
              <span className="text-xs text-gray-400">3 ngày trước</span>
            </div>
          </div>
        </div>
      </div>
      
      <DriverBottomNav />
    </div>
  );
} 