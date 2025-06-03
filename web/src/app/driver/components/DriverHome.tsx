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
import { updateDriverLocation, getNearbyOrders, getUnpaidPayments } from "@/services/driverService";
import { Alert, Snackbar, CircularProgress, Button } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';
import { toast } from 'react-toastify';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import MaterialPriceDialog from "./MaterialPriceDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface User {
    id: number;
    fullname: string;
    status: "idle" | "busy",
    document_status: string;
    vehicle_status: string;
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
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null });
    const [locationUpdateError, setLocationUpdateError] = useState("");
    const [showLocationError, setShowLocationError] = useState(false);
    const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [driverId, setDriverId] = useState<number | null>(null);
    // State cho đơn hàng gần đó
    const [nearbyOrders, setNearbyOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    
    // Thêm state cho thanh toán chưa hoàn thành
    const [unpaidAmount, setUnpaidAmount] = useState(0);
    const [hasUnpaidOrders, setHasUnpaidOrders] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [materialPriceDialogOpen, setMaterialPriceDialogOpen] = useState(false);
    const [pendingIdDocument, setPendingIdDocument] = useState("");
    const [pendingVehicle, setPendingVehicle] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            localStorage.removeItem("userId");
            localStorage.removeItem("identityDocumentId");
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                router.push("/login");
                return;
            }
            
            try {
                if (!user) {
                    const userData = await dispatch(fetchUserProfile(accessToken)).unwrap();
                    if(userData.user.role !== "driver"){
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("driverId");
                        router.push("/login");
                    }

                    if (userData && userData.id) {
                        setDriverId(userData.id);
                        localStorage.setItem("driverId", userData.id.toString());

                        await fetchUnpaidPayments();
                        await fetchNearbyOrders();
                    }
                } else if (user.id) {
                    if(user.document_status){
                        setPendingIdDocument(user.document_status)
                    }
                    if(user.vehicle_status){
                        setPendingVehicle(user.vehicle_status)
                    }
                    setDriverId(user.id);
                    localStorage.setItem("driverId", user.id.toString());

                    await fetchUnpaidPayments();
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
        
        checkAuth().catch(console.error);
    }, [dispatch, router, user]);

    useEffect(() => {
        if(pathname === "/driver"){
            fetchNearbyOrders().catch(console.error);
            fetchUnpaidPayments().catch(console.error);
        }
    }, []);

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
            
            updateLocation();
            
            if(driverStatus === "idle"){
                fetchNearbyOrders().catch(console.error);
            }

        }, 20000); // 20 seconds
    };

    const stopLocationTracking = () => {
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    };

    const updateLocation = () => {
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
                    console.log("Error getting current position:", error);
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
            const currentDriverId = driverId || parseInt(localStorage.getItem("driverId") || "0");
            
            if (!currentDriverId) {
                return;
            }
            
            // Lấy vị trí hiện tại
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            
            const orders = await getNearbyOrders(
                driverStatus || "idle",
                currentDriverId, 
                latitude, 
                longitude, 
                5 // Bán kính 5km
            );
            setNearbyOrders(orders);
            
        } catch (err: any) {
            console.log("Error fetching nearby orders:", err);
            setOrdersError(err.message || "Không thể lấy danh sách đơn hàng gần đây");
        } finally {
            setLoadingOrders(false);
        }
    };

    // Thêm hàm để lấy thông tin thanh toán chưa hoàn thành
    const fetchUnpaidPayments = async () => {
        try {
            if (!driverId) return;
            
            const payment = await getUnpaidPayments(driverId);
            
            if (payment) {
                const amount = payment.amount;
                setUnpaidAmount(amount);
                setPaymentUrl(payment.paymentUrl);
                setHasUnpaidOrders(true);
            } else {
                setUnpaidAmount(0);
                setHasUnpaidOrders(false);
            }
        } catch (error) {
            console.error("Error fetching unpaid payments:", error);
        }
    };

    const handlePayment = async () => {
        try {
            setLoadingPayment(true);
            
            if (!driverId) {
                toast.error("Không thể xác định ID tài xế");
                return;
            }
            
            // Nếu có payment URL, chuyển hướng người dùng đến trang thanh toán
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error('Không thể tạo URL thanh toán');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Đã xảy ra lỗi khi tạo thanh toán');
        } finally {
            setLoadingPayment(false);
        }
    };

    // Hàm mở dialog Material Price
    const handleOpenMaterialPriceDialog = () => {
        setMaterialPriceDialogOpen(true);
    };
    
    // Hàm đóng dialog Material Price
    const handleCloseMaterialPriceDialog = () => {
        setMaterialPriceDialogOpen(false);
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
                <Statistics driverId={driverId || 0}/>
                <div 
                    className="bg-gray-200 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={handleOpenMaterialPriceDialog}
                >
                    <div className="uppercase text-[#666]">Material Price</div>
                    <div className=" text-[#666]"><SubdirectoryArrowRightIcon/></div>
                </div>
                
            </div>
            <div className="px-4 text-[14px] font-medium pt-6 pb-4">
                {loadingOrders ? (
                    <div className="flex justify-center py-4">
                        <CircularProgress size={30} />
                    </div>
                ) : hasUnpaidOrders ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                        <p className="text-yellow-700 mb-2">You have a pending <span className="text-[16px]font-bold">${unpaidAmount.toLocaleString()}</span> payment.</p>
                        <p className="text-gray-600 text-sm mb-4">Please pay to continue receiving new orders</p>
                        <p className="text-gray-600 text-sm mb-4">You must complete the payment within 12 hours after the order is successfully placed.</p>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PaymentIcon />}
                            onClick={handlePayment}
                            disabled={loadingPayment}
                            sx={{ 
                                backgroundColor: '#dc2626', // bg-red-600
                                '&:hover': {
                                    backgroundColor: '#b91c1c', // bg-red-700
                                }
                            }}
                        >
                            {loadingPayment ? <CircularProgress size={24} /> : "Payment"}
                        </Button>
                    </div>
                ) : pendingIdDocument === "pending" || pendingIdDocument === "rejected" || pendingVehicle === "pending" || pendingVehicle === "rejected" ?(
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                        <p className="text-red-600 mb-2">Identity verification or vehicle verification is unapproved</p>
                        <p className="text-red-900 text-sm mb-5">Wait admin approval</p>
                        <Link href="/driver/profile" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">View profile</Link>

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
            
            {/* Dialog hiển thị danh sách Material Price */}
            <MaterialPriceDialog 
                open={materialPriceDialogOpen} 
                onClose={handleCloseMaterialPriceDialog} 
            />
            
            {/* Thêm thanh điều hướng dưới cùng */}
            <DriverBottomNav />
        </div>
    );
};

export default DriverHome;