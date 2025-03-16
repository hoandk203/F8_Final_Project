"use client"

import Statistics from "@/components/Statistics";
import OrderManager from "@/components/OrderManager";
import DriverBottomNav from "./DriverBottomNav";
import { useEffect, useState, useRef } from "react";
import { refreshToken } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { AppDispatch, RootState } from "@/redux/store";
import { updateDriverLocation, getNearbyOrders } from "@/services/driverService";
import { Alert, Snackbar, CircularProgress } from "@mui/material";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

interface User {
    id: number;
    fullname: string;
    status: "idle" | "busy"
}

interface Order {
    id: number;
    distance: number;
    store: any;
    orderDetails: any[];
    // Các trường khác của đơn hàng
}

let driverStatus = "idle";

const DriverHome = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, status, error } = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });
    const [locationUpdateError, setLocationUpdateError] = useState("");
    const [showLocationError, setShowLocationError] = useState(false);
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [driverId, setDriverId] = useState<number | null>(null);
    // State cho đơn hàng gần đó
    const [nearbyOrders, setNearbyOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState("");

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
                    
                    fetchNearbyOrders();
                    
                    // Lưu driverId vào state và localStorage nếu chưa có
                    if (userData && userData.id) {
                        setDriverId(userData.id);
                        localStorage.setItem("driverId", userData.id.toString());
                    }
                } else if (user.id) {
                    // Nếu đã có user trong Redux store, lấy ID từ đó
                    setDriverId(user.id);
                    localStorage.setItem("driverId", user.id.toString());
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
                        
                        if (userData && userData.id) {
                            setDriverId(userData.id);
                            localStorage.setItem("driverId", userData.id.toString());
                        }
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

    // Thiết lập cập nhật vị trí định kỳ
    useEffect(() => {
        // Khởi tạo driverId từ localStorage nếu có
        const storedDriverId = localStorage.getItem("driverId");
        if (storedDriverId) {
            setDriverId(parseInt(storedDriverId));
        }
        
        // Bắt đầu theo dõi vị trí chỉ khi đã có driverId
        if (driverId) {
            startLocationTracking();
            
        }

        // Cleanup khi component unmount
        return () => {
            stopLocationTracking();
        };
    }, [driverId]); // Chạy lại khi driverId thay đổi

    const startLocationTracking = () => {
        // Xóa interval cũ nếu có
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
        }

        // Cập nhật vị trí ngay lập tức
        updateLocation();

        // Thiết lập interval để cập nhật vị trí mỗi 20 giây
        locationIntervalRef.current = setInterval(() => {
            console.log("update location");
            
            updateLocation();
            
            if(driverStatus === "idle"){
                fetchNearbyOrders();
            }

        }, 10000); // 20 seconds
    };

    const stopLocationTracking = () => {
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    };

    const updateLocation = () => {
        // Ưu tiên sử dụng driverId từ state, sau đó từ localStorage
        const currentDriverId = driverId || parseInt(localStorage.getItem("driverId") || "0");
        
        if (!currentDriverId) {
            console.error("Driver ID not found");
            setLocationUpdateError("Không thể xác định ID tài xế. Vui lòng đăng nhập lại.");
            setShowLocationError(true);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        
                        await updateDriverLocation(
                            currentDriverId,
                            latitude,
                            longitude
                        );
                        
                        // Reset error state if successful
                        if (locationUpdateError) {
                            setLocationUpdateError("");
                        }
                    } catch (error: any) {
                        console.error("Failed to update driver location:", error);
                        setLocationUpdateError(error.message || "Failed to update location");
                        setShowLocationError(true);
                    }
                },
                (error) => {
                    console.error("Error getting current position:", error);
                    setLocationUpdateError(`Error getting position: ${error.message}`);
                    setShowLocationError(true);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setLocationUpdateError("Geolocation is not supported by this browser");
            setShowLocationError(true);
        }
    };

    // Hàm lấy vị trí hiện tại
    const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by this browser"));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });
    };

    useEffect(() => {
        if (user?.status) {
            driverStatus = user?.status;
        }
    }, [user?.status]);

    // Hàm lấy đơn hàng gần đó
    const fetchNearbyOrders = async () => {
        setLoadingOrders(true);
        setOrdersError("");
        
        try {
            // Lấy driverId từ localStorage hoặc state
            const currentDriverId = driverId || parseInt(localStorage.getItem("driverId") || "0");
            
            if (!currentDriverId) {
                throw new Error("Driver ID not found");
            }
            
            // Lấy vị trí hiện tại
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            
            
            
            // Gọi API để lấy đơn hàng gần đó
            const orders = await getNearbyOrders(
                driverStatus || "idle",
                currentDriverId, 
                latitude, 
                longitude, 
                5 // Bán kính 5km
            );
            setNearbyOrders(orders);
            
        } catch (err: any) {
            console.error("Error fetching nearby orders:", err);
            setOrdersError(err.message || "Không thể lấy danh sách đơn hàng gần đây");
        } finally {
            setLoadingOrders(false);
        }
    };

    // Hiển thị tên tài xế từ thông tin người dùng trong Redux store
    const driverName = user?.fullname || "Tài xế";

    return (
        <div className="container mx-auto pb-20"> {/* Thêm padding-bottom để tránh nội dung bị che bởi thanh điều hướng */}
            <div
                className="flex flex-col gap-4 px-4 pt-8 pb-4 text-white text-[14px] font-medium bg-zinc-900 rounded-b-xl">
                <div>
                    <h1 className="text-2xl mb-1">Welcome, {driverName}</h1>
                </div>
                <Statistics />
                <div className="text-[14px]">
                    <span>2.894 dollars</span>
                    <span className="text-[#666] mx-2">can be</span>
                    <button>Withdraw</button>
                </div>
            </div>
            <div className="px-4 text-[14px] font-medium pt-6 pb-4">
                {loadingOrders ? (
                    <div className="flex justify-center py-4">
                        <CircularProgress size={30} />
                    </div>
                ) : (
                    <OrderManager
                        driverId={driverId || 0}
                        nearbyOrders={nearbyOrders} 
                        setNearbyOrders={setNearbyOrders}
                        ordersError={ordersError}
                    />
                )}
            </div>
            
            {/* Thông báo lỗi cập nhật vị trí */}
            <Snackbar 
                open={showLocationError} 
                autoHideDuration={6000} 
                onClose={() => setShowLocationError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowLocationError(false)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {locationUpdateError}
                </Alert>
            </Snackbar>
            
            {/* Thêm thanh điều hướng dưới cùng */}
            <DriverBottomNav />
        </div>
    );
};

export default DriverHome;