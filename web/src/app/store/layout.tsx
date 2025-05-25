"use client"

import React, { useState, useEffect } from "react";
import StoreSidebar from "./components/StoreSidebar";
import StoreHeader from "./components/StoreHeader";
import store, { AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Box, Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/middlewares/authMiddleware";


const StoreLayout = ({children}: {children: React.ReactNode}) => {
    const dispatch = useDispatch<AppDispatch>();    
    const [showSidebar, setShowSidebar] = useState(false);
    const [checkedStatus, setCheckedStatus] = useState(false);
    const pathname = usePathname();
    const {user, status} = useSelector((state: RootState) => state.auth as { 
        user: {status: string, vendor_name: string, email: string, phone: string} | null, 
        status: string 
    });
    const router = useRouter();

    // Thêm useEffect để theo dõi việc kiểm tra status chỉ một lần
    useEffect(() => {
        if (user) {
            setCheckedStatus(true);
        }
    }, [user]);

    // Bỏ layout nếu là VerifyStorePage
    if (pathname === "/store/verify-store") {
        return children;
    }

    // Hiển thị loading khi đang fetch dữ liệu và chưa kiểm tra status
    if (status === 'loading' && !checkedStatus) {
        return (
            <Box className="flex justify-center items-center h-screen">
                <CircularProgress />
            </Box>
        );
    }

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (accessToken && refreshToken) {
          await dispatch(logoutUser({ accessToken, refreshToken }));
        }
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href= ("/store-login");
      };

    // Kiểm tra trạng thái cửa hàng sau khi đã load dữ liệu
    if (checkedStatus && user && user.status !== "approved" && pathname !== "/store/profile") {
        return (
            <Box className="p-8">
                <Card>
                    <CardContent>
                        <Box className="text-center py-8">
                            <Typography variant="h4" color="error" gutterBottom>
                                Store not yet approved
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Your store is currently pending approval. Please contact the provider ({user.vendor_name}) to activate your account.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your contact information:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {user.email} | Phone number: {user.phone}
                            </Typography>
                            <Box className="mt-4 flex justify-center gap-4">
                                <Button
                                    className={"text-black border-black"}
                                    variant="outlined"
                                    onClick={() => router.push("/store/profile")}
                                >
                                    View profile
                                </Button>
                                <Button
                                    className={"bg-[#303030] text-white"}
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <div>
            {showSidebar && <div onClick={() => {
                setShowSidebar(false)
            }} className={"fixed inset-0 bg-black opacity-50 z-10 lg:hidden"}></div>}
            <div className="flex relative">
                <div
                    className={`fixed max-w-[250px] bg-white lg:static top-0 bottom-0 z-10 -left-full lg:left-0 transition-all duration-300 ease-in-out ${showSidebar ? "!left-0" : ""}`}>
                    <StoreSidebar/>
                </div>

                <div className={"flex-1"}>
                    <StoreHeader showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
                    <div className="flex-1 p-4">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default StoreLayout