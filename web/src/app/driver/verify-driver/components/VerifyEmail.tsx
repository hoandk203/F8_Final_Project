"use client";

import {useEffect, useState} from "react";

import OTPInput from "@/components/OTPInput";
import CustomButton from "@/components/CustomButton";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";
import {sendVerificationEmail, verifyEmail} from "@/services/authService";

import RestartAltIcon from '@mui/icons-material/RestartAlt';



const VerifyEmail = () => {
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

    // const handleVerifyDriverStep = () => {
    //     dispatch(setVerifyDriverStep(1))
    // }

    const handleVerifyEmail = async () => {
        setIsLoading(true)
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        try {
            const response= await verifyEmail({...userData, otp: otp})
            // lay userId cho vao verifyIdentity
            localStorage.setItem("userId", JSON.stringify(response.id));
            setIsLoading(false)
            dispatch(setVerifyDriverStep(1))
            // xoa localStorage khi verify thanh cong
            localStorage.removeItem("userData")
        } catch (error: any) {
            setIsLoading(false)
            setError(error.message)
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

    return (
        <>
            <h1 className="text-3xl font-bold mb-1">Verify your email</h1>
            <p className="text-[#666]">Enter the 6-digit code we sent to h*******@gmail.com</p>

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
        </>
    )
}

export default VerifyEmail;