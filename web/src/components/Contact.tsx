"use client"

import React from "react";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Contact = () => {
    return (
        <div className="flex justify-around items-center">
            <button className="flex flex-col items-center" onClick={() => {console.log(1)}}>
                <ChatBubbleOutlineIcon/>
                <p>Chat</p>
            </button>
            <button className="flex flex-col items-center">
                <PhoneOutlinedIcon/>
                <p>Call</p>
            </button>
            <button className="flex flex-col items-center">
                <HelpOutlineIcon/>
                <p>Help Center</p>
            </button>
        </div>
    )
}

export default Contact