import OTPInput from "@/components/OTPInput";
import CustomButton from "@/components/CustomButton";

const VerifyEmail = () => {
    return (
        <>
            <h1 className="text-3xl font-bold mb-1">Verify your email</h1>
            <p className="text-[#666]">Enter the 6-digit code we sent to h*******@gmail.com</p>

            <div className={"flex justify-center gap-2 mt-8"}><OTPInput/></div>


            <div className="text-center mt-5">
                <p className="text-[#666]">Didn't receive the code?</p>
                <p className="text-black font-semibold">Resend in 30 seconds</p>
            </div>
            <div className={"grid grid-cols-1 mt-5"}>
                <CustomButton label="Verify Code" variant="dark" size="large"/>
            </div>
            <div className="text-center mt-5">
                Need help? <a href="/contact-us" className="text-black underline font-semibold">Contact support</a>
            </div>
        </>
    )
}

export default VerifyEmail;