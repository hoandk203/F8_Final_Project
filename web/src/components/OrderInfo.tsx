import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import InboxIcon from '@mui/icons-material/Inbox';
import React from "react";

interface OrderInfoProps {
    type: string
}

const OrderInfo: React.FC<OrderInfoProps> = ({type}) => {
    return (
        <div className="bg-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <div className="text-[#666] uppercase mb-1">Order #12941875</div>
                    <span
                        className="inline-block bg-black px-2 py-1 text-[12px] text-white rounded-md capitalize">{type}</span>
                </div>
                <div>
                    <span className="text-xl font-bold">04:54</span> left
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="capitalize text-[16px] font-bold">Spice Haven Restaurant</h3>
                <div className="flex gap-2 items-center">
                    <LocationOnOutlinedIcon/>
                    <p>14/2 Connaught Cirus, Block M, Concaught Place, New Delhi, Delhi 110001, India</p>
                </div>
                <div className="flex gap-2 items-center">
                    <PhoneOutlinedIcon/>
                    <p>(+91) 9812345678</p>
                </div>
                <div className="flex gap-2 items-center">
                    <InboxIcon/>
                    <p>~15kg - Scrap carton</p>
                </div>
            </div>
        </div>
    )
}

export default OrderInfo