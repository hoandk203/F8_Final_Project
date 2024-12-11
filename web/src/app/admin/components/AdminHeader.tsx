"use client"

import React from "react";
import { usePathname } from 'next/navigation'

import LocalShippingIcon from '@mui/icons-material/LocalShipping';


interface props{
    showSidebar: boolean,
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
const AdminHeader= ({showSidebar, setShowSidebar}: props) => {
    let pathname = usePathname()
    pathname = pathname.split("/")[2]
    return (
        <div className={"shadow"}>
            <div className={"container mx-auto p-4 ps-0 lg:ps-4"}>
                <div className={"text-[28px] font-[900] capitalize inline- hidden lg:block"}>{pathname} management</div>
                <span onClick={() => setShowSidebar(!showSidebar)} className={"inline-block cursor-pointer lg:hidden"}>
                    <div className={"flex items-center gap-2"}>
                        <span
                            className={"bg-[#d3f9d9] p-3 border border-green-900 rounded-xl inline-block"}><LocalShippingIcon
                            className={"text-[#075822]"}/></span>
                        <p className="text-[28px] font-[900] uppercase inline-block">Scrapplan</p>
                    </div>
                </span>
            </div>
        </div>
    )
}

export default AdminHeader