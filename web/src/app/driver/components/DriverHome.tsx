"use client"

import Statistics from "@/components/Statistics";
import OrderManager from "@/components/OrderManager";
import DriverBottomNav from "./DriverBottomNav";
import {useEffect} from "react";
import {refreshToken} from "@/services/authService";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserProfile} from "@/redux/middlewares/authMiddleware";
import {AppDispatch, RootState} from "@/redux/store";

interface User {
    driver?: {
        fullname: string;
    };
}

const DriverHome = () => {
    console.log("driver home")
    const router= useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const {user, status, error} = useSelector((state: RootState) => state.auth as { user: User | null, status: string, error: string | null })

    useEffect(() => {
        const checkAuth= async () => {
            const accessToken= localStorage.getItem("access_token")
            if(!accessToken){
                router.push("/login")
                return
            }
            if(!user){
                try {
                    // Dispatch action để lấy thông tin profile và lưu vào Redux store
                    await dispatch(fetchUserProfile(accessToken)).unwrap()
                }catch (err: any) {
                    if (err?.message === "Access token expired") {
                        try {
                            const oldRefreshToken= localStorage.getItem("refresh_token")
                            const newTokens= await refreshToken(oldRefreshToken || "")
                            localStorage.setItem("access_token", newTokens.access_token)
                            localStorage.setItem("refresh_token", newTokens.refresh_token)

                            // Thử lại với token mới
                            await dispatch(fetchUserProfile(newTokens.access_token)).unwrap()
                        }
                        catch (refreshError) {
                            localStorage.removeItem("access_token")
                            localStorage.removeItem("refresh_token")
                            router.push("/login")
                        }
                    } else {
                        localStorage.removeItem("access_token")
                        localStorage.removeItem("refresh_token")
                        router.push("/login")
                    }
                }
            }

        }
        checkAuth()
    }, [dispatch, router])
    
    // Hiển thị tên tài xế từ thông tin người dùng trong Redux store
    const driverName = user?.driver?.fullname || "Tài xế";

    return (
        <div className="container mx-auto pb-20"> {/* Thêm padding-bottom để tránh nội dung bị che bởi thanh điều hướng */}
            <div
                className="flex flex-col gap-4 px-4 pt-8 pb-4 text-white text-[14px] font-medium bg-zinc-900 rounded-b-xl">
                <div>
                    <h1 className="text-2xl mb-1">Xin chào, {driverName}</h1>
                    <p className="text-[#666]">Thống kê từ tháng 10, 2024</p>
                </div>
                <Statistics/>
                <div className="text-[14px]">
                    <span>72.894 INR</span>
                    <span className="text-[#666] mx-2">có thể rút</span>
                    <button>Rút tiền</button>
                </div>
            </div>
            <div className="px-4 text-[14px] font-medium pt-6 pb-4">
                <OrderManager/>
            </div>
            
            {/* Thêm thanh điều hướng dưới cùng */}
            <DriverBottomNav />
        </div>
    )
}

export default DriverHome