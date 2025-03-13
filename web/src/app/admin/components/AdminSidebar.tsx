import Link from "next/link";

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser } from "@/redux/middlewares/authMiddleware";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const AdminSidebar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (accessToken && refreshToken) {
            await dispatch(logoutUser({ accessToken, refreshToken }) as any);
        }
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
    };

    return (
        <div className="h-screen flex flex-col gap-y-10 p-4">
            <div className={"flex items-center gap-2"}>
                <span
                    className={"bg-[#d3f9d9] p-2 border border-green-900 rounded-xl inline-block"}><LocalShippingIcon
                    className={"text-[#075822]"}/></span>
                <p className="text-[24px] font-[900] uppercase inline-block">Scrapplan</p>
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
            </div>
            <div className="p-4">
                <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                    <LogoutIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-3" onClick={handleLogout}>Logout</span>
                </button>
                <div className="flex items-center py-4 border-t mt-2">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 py-1">Amazon VN</p>
                        <p className="text-xs text-gray-500 py-1">Email: store@example.com</p>
                        <p className="text-xs text-gray-500 py-1">Hotline: 0972193812</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar;