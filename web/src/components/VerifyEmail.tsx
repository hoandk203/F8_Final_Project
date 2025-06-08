"use client";

import {useEffect, useState} from "react";

import OTPInput from "@/components/OTPInput";
import CustomButton from "@/components/CustomButton";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";
import {createAdmin, createVendor, resetPassword, sendVerificationEmail, verifyEmail} from "@/services/authService";
import {useRouter} from "next/navigation";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LoadingOverlay from "./LoadingOverlay";

interface VerifyEmailProps {
    stepVerifyStore?: (step: number) => void;
    email?: string;
    changePassword?: boolean;
}

const VerifyEmail = ({stepVerifyStore, email, changePassword}: VerifyEmailProps) => {
    const router= useRouter()
    const dispatch= useDispatch<AppDispatch>()
    const [otp, setOtp] = useState('');
    const [error, setError] = useState("");
    const [isLoading, setIsLoading]= useState(false)
    const [countDown, setCountDown] = useState(10);
    const [resend, setResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const changeOtp = (otp: string) => {
        setOtp(otp)
    }

    const handleVerifyEmail = async () => {
        if(!changePassword){
            setIsLoading(true)
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");

            try {
                const response= await verifyEmail({...userData, otp: otp})
                
                if(userData.role === "vendor"){
                    try {
                        const vendorData= {
                            userId: response.id,
                            name: userData.name,
                            email: userData.email
                        }
                        await createVendor(vendorData)
                        localStorage.removeItem("userData")
                        router.push("/vendor-login")
                        setIsLoading(false)
                    } catch (error: any) {
                        setIsLoading(false)
                        setError(error.message)
                    }
                }

                if(userData.role === "admin"){
                    try {
                        const adminData= {
                            userId: response.id,
                            email: userData.email
                        }
                        await createAdmin(adminData)
                        localStorage.removeItem("userData")
                        router.push("/vendor-login")
                        setIsLoading(false)
                    } catch (error: any) {
                        setIsLoading(false)
                        setError(error.message)
                    }
                }

                // lay userId cho vao verifyIdentity
                localStorage.setItem("userId", JSON.stringify(response.id));

                setIsLoading(false)
                if (stepVerifyStore) {
                    stepVerifyStore(1)
                }
                dispatch(setVerifyDriverStep(1))
                // xoa localStorage khi verify thanh cong
                localStorage.removeItem("userData")
            } catch (error: any) {
                setIsLoading(false)
                setError(error.message)
            }
        }else{
            try {
                setIsLoading(true)
                const response= await resetPassword({email, otp})
                if(response.role === "vendor"){
                    router.push("/vendor-login")
                }else if(response.role === "store"){
                    router.push("/store-login")
                }else if(response.role === "admin"){
                    router.push("/vendor-login")
                }else {
                    router.push("/login")
                }
                localStorage.removeItem("userData")
            } catch (error: any) {
                setIsLoading(false)
                setError(error.message)
            }
        }
    }

    const resendOtp= async () => {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const resendUserData={
            ...userData,
            resend: true
        }
        setIsResending(true)
        try {
            await sendVerificationEmail(resendUserData)
            setIsResending(false)
        }catch (error: any) {
            setIsResending(false)
            setError(error.message)
        }
    }

    // COUNT DOWN
    useEffect(() => {
        if(countDown > 0){
            const timer= setTimeout(() => {
                setCountDown(countDown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }else{
            setResend(true)
        }
    }, [countDown])

    // Xóa localStorage khi đóng trang nếu chưa verify OTP
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("userData");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div className="max-w-md mx-auto">
            {isResending && <LoadingOverlay/>}
            <h1 className="text-3xl font-bold mb-1">Verify your email</h1>
            <p className="text-[#666]">Enter the 6-digit code we sent to {
                (() => {
                    const emailValue = email || JSON.parse(localStorage.getItem("userData") || "{}").email || "";
                    if (!emailValue) return "";
                    const atIndex = emailValue.indexOf('@');
                    if (atIndex <= 0) return emailValue;
                    const username = emailValue.substring(0, atIndex);
                    const domain = emailValue.substring(atIndex);
                    const maskedUsername = username.length <= 4 
                        ? "****" 
                        : username.substring(0, username.length - 4) + "****";
                    return maskedUsername + domain;
                })()
            }</p>

            <div className={"flex justify-center gap-2 mt-8"}><OTPInput changeOtp={changeOtp}/></div>
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="text-center mt-5">
                <p className="text-[#666]">Didn't receive the code?</p>
                {resend ? <p onClick={resendOtp} className={`${isResending ? "text-[#666] pointer-events-none" : "text-black"} underline cursor-pointer font-semibold`}><RestartAltIcon/>Resend code</p> : <p className="text-black font-semibold">Resend in {countDown} seconds</p>}
            </div>
            <div className={"grid grid-cols-1 mt-5"}>
                <CustomButton isLoading={isLoading} disabled={isLoading} label="Verify Code" variant="dark" size="large" handleVerifyEmail={handleVerifyEmail}/>
            </div>
            <div className="text-center mt-5">
                Need help? <a href="/contact-us" className="text-black underline font-semibold">Contact support</a>
            </div>
        </div>
    )
}

export default VerifyEmail;