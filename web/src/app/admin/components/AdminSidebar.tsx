import Link from "next/link";

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { logoutUser } from "@/redux/middlewares/authMiddleware";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import RecyclingIcon from '@mui/icons-material/Recycling';
import { clearAuthTokens, getAuthTokens } from "@/services/authService";

const AdminSidebar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        const tokens = getAuthTokens();
        
        if (tokens?.access_token && tokens?.refresh_token) {
            await dispatch(logoutUser({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token }) as any);
        }
        
        clearAuthTokens();
        window.location.href =("/vendor-login");
    };

    return (
        <div className="h-screen flex flex-col gap-y-10 p-4">
            <div className={"flex items-center gap-2"}>
                <Link href={"/admin/drivers"} className="flex items-center py-3">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="ml-2 text-xl font-bold">Scraplan</span>
                </Link>
            </div>
            <div className={"flex flex-col gap-y-2 flex-1"}>
                <Link href={"/admin/drivers"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <GroupOutlinedIcon/>Drivers
                </Link>
                <Link href={"/admin/stores"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <StoreOutlinedIcon/>Stores
                </Link>
                <Link href={"/admin/vendors"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <ApartmentOutlinedIcon/>Vendors
                </Link>
                <Link href={"/admin/issues"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <ReportProblemIcon/>Issues
                </Link>
                <Link href={"/admin/material"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <RecyclingIcon/>Material
                </Link>
            </div>
            <div className="p-4">
                <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-200">
                    <LogoutIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-3" onClick={handleLogout}>Logout</span>
                </button>
                <div className="flex items-center py-4 border-t mt-2">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 py-1">Scraplan</p>
                        <p className="text-xs text-gray-500 py-1">Email: hoanyttv@gmail.com</p>
                        <p className="text-xs text-gray-500 py-1">Hotline: 0842500199</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar;