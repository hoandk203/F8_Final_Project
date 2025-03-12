"use client"

import React, {useState} from "react";
import StoreSidebar from "./components/StoreSidebar";
import StoreHeader from "./components/StoreHeader";
import store from "@/redux/store";
import { usePathname } from "next/navigation";


const StoreLayout = ({children}: {children: React.ReactNode}) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const pathname = usePathname();

    // Bỏ layout nếu là VerifyStorePage
    if (pathname === "/store/verify-store") {
        return children;
    }

    return (
        <div>
            {showSidebar && <div onClick={() => {
                setShowSidebar(false)
            }} className={"fixed inset-0 bg-black opacity-50 z-10 lg:hidden"}></div>}
            <div className="flex relative">
                <div
                    className={`fixed max-w-[250px] bg-white lg:static top-0 bottom-0 z-10 -left-full lg:left-0 transition-all duration-300 ease-in-out ${showSidebar ? "!left-0" : ""}`}>
                    <StoreSidebar/>
                </div>

                <div className={"flex-1"}>
                    <StoreHeader showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
                    <div className="flex-1 p-4">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default StoreLayout