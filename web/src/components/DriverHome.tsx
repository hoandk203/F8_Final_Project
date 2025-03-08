"use client"

import Statistics from "@/components/Statistics";
import OrderManager from "@/components/OrderManager";
import {useEffect} from "react";
import {getProfile, refreshToken} from "@/services/authService";
import {useRouter} from "next/navigation";


const DriverHome = () => {
    console.log("driver home")
    const router= useRouter()

    useEffect(() => {
        const checkAuth= async () => {
            const accessToken= localStorage.getItem("access_token")
            if(!accessToken){
                router.push("/login")
            }
            try {
                const profile= await getProfile(accessToken || "")
                console.log(profile)
            }catch (errorGetProfile) {
                if (errorGetProfile instanceof Error && errorGetProfile.message === "Access token expired") {
                    try {
                        const oldRefreshToken= localStorage.getItem("refresh_token")
                        const newTokens= await refreshToken(oldRefreshToken || "")
                        console.log(newTokens)
                        localStorage.setItem("access_token", newTokens.access_token)
                        localStorage.setItem("refresh_token", newTokens.refresh_token)
                    }
                    catch (errorRefreshToken) {
                        if (errorRefreshToken instanceof Error) {
                            localStorage.removeItem("access_token")
                            localStorage.removeItem("refresh_token")
                            router.push("/login")
                        } else {
                            throw errorRefreshToken
                        }
                    }
                }
                throw errorGetProfile
            }
        }
        checkAuth()
    }, [])


    return (
        <div className="container mx-auto">
            <div
                className="flex flex-col gap-4 px-4 pt-8 pb-4 text-white text-[14px] font-medium bg-zinc-900 rounded-b-xl">
                <div>
                    <h1 className="text-2xl mb-1">Welcome, Driver</h1>
                    <p className="text-[#666]">Statistics from October, 2024</p>
                </div>
                <Statistics/>
                <div className="text-[14px]">
                    <span>72.894 INR</span>
                    <span className="text-[#666] mx-2">available to withdraw</span>
                    <button>Withdraw</button>
                </div>
            </div>
            <div className="px-4 text-[14px] font-medium pt-6 pb-4">
                <OrderManager/>
            </div>
        </div>
    )
}

export default DriverHome