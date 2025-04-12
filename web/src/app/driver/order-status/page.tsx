"use client"

import CustomButton from "@/components/CustomButton";
import Contact from "@/components/Contact";
import StepperOrder from "./components/StepperOrder";
import OrderInfo from "@/components/OrderInfo";
import ActionOrder from "./components/ActionOrder";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
}

const OrderStatusPage = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth as { user: User | null, isAuthenticated: boolean });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    return (
        <>
            <div className="container mx-auto h-screen">
                <div className="px-4 pt-8 text-[14px] h-full pb-[250px]">
                    <h1 className="font-bold mb-4">Order status</h1>
                    <StepperOrder/>
                    <div className="flex flex-col gap-y-3 mt-4 overflow-y-auto h-[calc(100%-131px)]"> {/* 2 nút 83px */}
                        
                    </div>
                </div>

                <div className="bg-white fixed bottom-0 left-0 right-0 px-4 py-4">
                    <div className="flex flex-col gap-y-8">
                        <ActionOrder/>
                        <Contact/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderStatusPage
