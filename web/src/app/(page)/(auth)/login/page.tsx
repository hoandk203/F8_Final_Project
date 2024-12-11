import Link from "next/link"
import LoginForm from "./components/LoginForm"

const LoginPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <h1 className="text-3xl font-bold mb-1">Welcome to Scrap Plan</h1>
                    <p className="text-[#666]">Create an account or login to join tour orders</p>
                </div>
                <LoginForm/>
            </div>
            <div className="text-center mt-8">
                <p className="text-[#666]">Don't have account? <Link href={"/register"} className="text-black font-semibold underline">Register here</Link></p>
            </div>
        </div>
    )
}

export default LoginPage