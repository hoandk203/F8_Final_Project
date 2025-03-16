"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import DriverBottomNav from "../components/DriverBottomNav";
import { logout } from "@/redux/slice/authSlice";
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logoutUser } from "@/redux/middlewares/authMiddleware";
import {refreshToken} from "@/services/authService";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
interface User {
    driver?: {
        fullname: string;
    };
    email?: string;
    phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth as { user: User | null, isAuthenticated: boolean });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (accessToken && refreshToken) {
      await dispatch(logoutUser({ accessToken, refreshToken }));
    }
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  return (
    <div className="container mx-auto pb-20">
      <div className="p-4">
        <div className="bg-zinc-900 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <PersonIcon style={{ fontSize: 48, color: '#4B5563' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{user?.driver?.fullname || "Tài xế"}</h1>
              <p className="text-gray-400">{user?.email || "email@example.com"}</p>
              <p className="text-gray-400">{user?.phone || "0123456789"}</p>
            </div>
          </div>
          <PWAInstallPrompt />
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <DirectionsCarIcon className="text-gray-500" />
              <span>Thông tin phương tiện</span>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <BadgeIcon className="text-gray-500" />
              <span>Giấy phép lái xe</span>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <HistoryIcon className="text-gray-500" />
              <span>Lịch sử thu gom</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full p-4 bg-red-500 text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <ExitToAppIcon />
            <span>Đăng xuất</span>
          </button>
        </div>
        
      </div>
      
      <DriverBottomNav />
    </div>
  );
} 