import Link from "next/link"
import VendorRegisterForm from "./components/VendorRegisterForm"

const AdminRegisterPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <h1 className="text-3xl font-bold mb-1">Welcome to Scrap Plan</h1>
                    <p className="text-[#666]">Create an account or login to join tour orders</p>
                </div>
                <VendorRegisterForm/>
            </div>
            <div className="text-center mt-8">
                <p className="text-[#666]">You have an account? <Link href={"/admin-login"} className="text-black font-semibold underline">Login here</Link></p>
            </div>
        </div>
    )
}

export default AdminRegisterPage