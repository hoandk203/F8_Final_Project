import Link from "next/link"
import StoreLoginForm from "@/app/(auth)/store-login/components/StoreLoginForm";



const StoreLoginPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <h1 className="text-3xl font-bold mb-1">Welcome to Scraplan</h1>
                    <p className="text-[#666]">Create an account or login to join tour orders</p>
                </div>
                <StoreLoginForm/>
            </div>
            <div className="text-center mt-8">
                <p className="text-[#666]">Don't have account? <Link href={"/store-register"} className="text-black font-semibold underline">Register here</Link></p>
            </div>
        </div>
    )
}

export default StoreLoginPage