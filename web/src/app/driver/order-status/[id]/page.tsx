"use client"

import CustomButton from "@/components/CustomButton";
import Contact from "@/components/Contact";
import StepperOrder from "../components/StepperOrder";
import OrderInfo from "@/components/OrderInfo";
import ActionOrder from "../components/ActionOrder";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/redux/middlewares/authMiddleware";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter, useParams } from "next/navigation";
import { refreshToken } from "@/services/authService";
import { getOrderById, updateOrder } from "@/services/orderService";
import { stepOrderSlice } from '@/redux/slice/stepOrderSlice';
import UploadImages from "@/components/UploadImages";
import ProofSubmitedDialog from "../components/ProofSubmitedDialog";
import { updateDriver } from "@/services/driverService";


interface Order {
    id: number;
    distance: number;
    store: any;
    orderDetails: any[];
    status: string;
    driverId: number;
}

const OrderDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [order, setOrder] = useState<Order | null>(null);
    const step = useSelector((state: any) => state.stepOrder.step)
    const [isDetailPage, setIsDetailPage] = useState(true)
    const [proofImage, setProofImage] = useState<string | null>(null)
    const [openProofSubmitedDialog, setOpenProofSubmitedDialog] = useState(false)
    const [stateOrderStatus, setStateOrderStatus] = useState("")
    useEffect(() => {
        const checkAuth= async () => {
            const accessToken= localStorage.getItem("access_token")
            if(!accessToken){
                router.push("/login")
                return
            }
            if(!order){
                try {
                    const order = await getOrderById(Number(id))
                    if(order.status === "completed"){
                        router.push("/driver")
                    }
                    if(!order.driverId){
                        router.push("/driver")
                    }
                    setOrder(order)
                }catch (err: any) {
                    if (err?.message === "Access token expired") {
                        try {
                            const oldRefreshToken= localStorage.getItem("refresh_token")
                            const newTokens= await refreshToken(oldRefreshToken || "")
                            localStorage.setItem("access_token", newTokens.access_token)
                            localStorage.setItem("refresh_token", newTokens.refresh_token)
    
                            
                            const order = await getOrderById(Number(id))
                            setOrder(order)
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
    }, [dispatch, router]);

    useEffect(() => {
        if(order?.status === "on moving"){
            dispatch(stepOrderSlice.actions.setStep(1))
        }
    }, [order])

    const handleStep = (updateStep: number) => () => {
        dispatch(stepOrderSlice.actions.setStep(updateStep))
    };

    const handleStatusOnMoving = async () => {
        try {
            await updateOrder(Number(id), {status: "on moving"})
            dispatch(stepOrderSlice.actions.setStep(1))
            setStateOrderStatus("on moving")
        } catch (error) {
            console.log(error)
        }
    }

    const handleStepCompleted = async () => {
        dispatch(stepOrderSlice.actions.setStep(2))
        setIsDetailPage(false)
    }

    const handleProofSubmit = async () => {
        try {
            await updateOrder(Number(id), {status: "completed", proofImage: proofImage})
            await updateDriver(order?.driverId || 0, {status: "idle"})
            dispatch(stepOrderSlice.actions.setStep(3))
            setOpenProofSubmitedDialog(true)
            setStateOrderStatus("completed")
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseProofSubmitedDialog = () => {
        setOpenProofSubmitedDialog(false)
    }

    if(step === 3){
        return (
            <div className="container">
                <ProofSubmitedDialog order={order} stateOrderStatus={stateOrderStatus} open={openProofSubmitedDialog} handleClose={handleCloseProofSubmitedDialog}/>
            </div>
        )
    }

    return (
        <>
            <div className="container">
                <div className="px-4 pt-8 text-[14px]">
                    <h1 className="font-bold mb-4 text-xl text-center">Order #{order?.id}</h1>
                    <StepperOrder/>
                    <div className="flex flex-col gap-y-3 mt-4 overflow-y-auto h-[calc(100%-131px)]"> {/* 2 nút 83px */}
                        <OrderInfo order={order} isDetailPage={isDetailPage} stateOrderStatus={stateOrderStatus}/>
                    </div>
                </div>
                {step === 2
                &&
                <div className="px-4 pt-8 text-[14px]">
                    <p className="font-semibold text-lg mb-2">Upload proof image</p>
                    <UploadImages setProofImage={setProofImage} imageHeight={"500px"}/>
                </div>
                }

                <div className="bg-white fixed bottom-0 left-0 right-0 px-4 py-4">
                    <div className="flex flex-col gap-y-8">
                        <div className="flex flex-col gap-y-2">
                            {step === 0 && <CustomButton label="Mask as moving" variant="dark" size="medium" handleStatusOnMoving={handleStatusOnMoving}/>}
                            {step === 1 && <CustomButton label="Completed" variant="dark" size="medium" handleStepCompleted={handleStepCompleted}/>}
                            {step === 2 && <CustomButton label="Proof Submit" variant="dark" size="medium" handleProofSubmit={handleProofSubmit}/>}
                            <CustomButton label="Cancel ride" variant="light" size="medium"/>
                        </div>
                        <Contact/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetailPage
