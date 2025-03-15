"use client"

import React from "react";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';


const Contact = () => {
    return (
        <div className="flex justify-around items-center">
            <button className="flex flex-col items-center" onClick={() => window.location.href = "/driver"}>
                <HomeOutlinedIcon/>
                <p>Home</p>
            </button>
            <button className="flex flex-col items-center">
                <PhoneOutlinedIcon/>
                <p>Call Vendor</p>
            </button>
        </div>
    )
}

export default Contact