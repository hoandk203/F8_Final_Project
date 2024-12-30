import Link from "next/link";

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

const AdminSidebar = () => {
    return (
        <div className="flex flex-col gap-y-10 p-4">
            <div className={"flex items-center gap-2"}>
                <span
                    className={"bg-[#d3f9d9] p-2 border border-green-900 rounded-xl inline-block"}><LocalShippingIcon
                    className={"text-[#075822]"}/></span>
                <p className="text-[24px] font-[900] uppercase inline-block">Scrapplan</p>
            </div>
            <div className={"flex flex-col gap-y-2"}>
                <Link href={"/admin/orders"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <ContentPasteIcon/>Orders
                </Link>
                <Link href={"/admin/drivers"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <GroupOutlinedIcon/>Drivers
                </Link>
                <Link href={"/admin/stores"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <StoreOutlinedIcon/>Stores
                </Link>
                <Link href={"/admin/vendors"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <ApartmentOutlinedIcon/>Vendors
                </Link>
                <Link href={"/admin/escalations"} className={"flex items-center gap-2 p-3 hover:text-white hover:bg-[#555] rounded-md"}>
                    <AssessmentOutlinedIcon/>Escalations
                </Link>
            </div>
        </div>
    )
}

export default AdminSidebar;