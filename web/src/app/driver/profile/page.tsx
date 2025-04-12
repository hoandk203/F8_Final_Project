"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import DriverBottomNav from "../components/DriverBottomNav";
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchUserProfile, logoutUser } from "@/redux/middlewares/authMiddleware";
import DriverInfomation from "../components/DriverInfomation";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import VehicleInfo from "../components/VehicleInfo";
import IdentityDocumentInfo from "../components/IdentityDocumentInfo";
import { getProfile, refreshToken } from "@/services/authService";

interface User {
    fullname?: string;
    phoneNumber?: string;
    user?: {
      email?: string;
    }
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth as { user: User | null, isAuthenticated: boolean });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [showIdentityInfo, setShowIdentityInfo] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            router.push("/login");
            return;
        }
        
        try {
            // Dispatch action để lấy thông tin profile và lưu vào Redux store
            if (!user) {
                const userData = await dispatch(fetchUserProfile(accessToken)).unwrap();
                if(userData.user.role !== "driver"){
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("driverId");
                    router.push("/login");
                }
              }
        } catch (err: any) {
            
            if (err?.message === "Access token expired") {
                try {
                    const oldRefreshToken = localStorage.getItem("refresh_token");
                    const newTokens = await refreshToken(oldRefreshToken || "");
                    localStorage.setItem("access_token", newTokens.access_token);
                    localStorage.setItem("refresh_token", newTokens.refresh_token);

                    // Thử lại với token mới
                    const userData = await dispatch(fetchUserProfile(newTokens.access_token)).unwrap();
                    
                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("driverId");
                    router.push("/login");
                }
            } else {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("driverId");
                router.push("/login");
            }
        }
    };
    
    checkAuth();
}, [dispatch, router, user]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    if (accessToken && refreshToken) {
      await dispatch(logoutUser({ accessToken, refreshToken }));
    }
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("driverId");
    router.push("/login");
  };

  const toggleVehicleInfo = () => {
    setShowVehicleInfo(!showVehicleInfo);
  };

  const toggleIdentityInfo = () => {
    setShowIdentityInfo(!showIdentityInfo);
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
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
              <h1 className="text-xl font-bold">{user?.fullname || "Driver"}</h1>
              <p className="text-gray-400">{user?.user?.email || "email@example.com"}</p>
              <p className="text-gray-400">{user?.phoneNumber || "No phone number"}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <DriverInfomation />

          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={toggleVehicleInfo}
            >
              <div className="flex items-center space-x-3">
                <DirectionsCarIcon className="text-gray-500" />
                <span>Vehicle information</span>
              </div>
              <div>
                {showVehicleInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </div>
            
            {showVehicleInfo && (
              <div className="px-4 pb-4">
                <VehicleInfo />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={toggleIdentityInfo}
            >
              <div className="flex items-center space-x-3">
                <BadgeIcon className="text-gray-500" />
                <span>Identity document</span>
              </div>
              <div>
                {showIdentityInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </div>
            
            {showIdentityInfo && (
              <div className="px-4 pb-4">
                <IdentityDocumentInfo />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={togglePasswordForm}
            >
              <div className="flex items-center space-x-3">
                <LockIcon className="text-gray-500" />
                <span>Change password</span>
              </div>
              <div>
                {showPasswordForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
            </div>
            
            {showPasswordForm && (
              <div className="px-4 pb-4">
                <ChangePasswordForm />
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full p-4 bg-red-500 text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <ExitToAppIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <DriverBottomNav />
    </div>
  );
} 