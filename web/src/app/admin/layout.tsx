"use client"

import React, {useState} from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "@/app/admin/components/AdminHeader";


const AdminLayout = ({children}: {children: React.ReactNode}) => {
    const [showSidebar, setShowSidebar]= useState(false);


    return (
        <div>
            {showSidebar && <div onClick={() => {
                setShowSidebar(false)
            }} className={"fixed inset-0 bg-black opacity-50 z-10 lg:hidden"}></div>}
            <div className="flex relative">
                <div
                    className={`fixed max-w-[250px] bg-white lg:static top-0 bottom-0 z-10 -left-full lg:left-0 transition-all duration-300 ease-in-out ${showSidebar ? "!left-0" : ""}`}>
                    <AdminSidebar/>
                </div>

                <div className={"flex-1"}>
                    <AdminHeader showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
                    <div className="flex-1 p-4">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout