"use client"
import React, {useState} from "react";
import OrderInfo from "@/components/OrderInfo";

// interface StatisticsProps {
//     data: object
// }

const OrderManager = () => {
    const [step, setStep] = useState(1)
    return (
        <div>
            <div className="flex justify-around mb-3">
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(1)
                    }}>
                    <span className={step === 1 ? "text-black" : "text-[#666]"}>Ongoing orders</span>
                    {step === 1 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(2)
                    }}>
                    <span className={step === 2 ? "text-black" : "text-[#666]"}>Orders history</span>
                    {step === 2 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
                <button
                    className="relative pb-2 px-1"
                    onClick={() => {
                        setStep(3)
                    }}>
                    <span className={step === 3 ? "text-black" : "text-[#666]"}>Cancelled orders</span>
                    {step === 3 && <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] rounded-full bg-black">
                    </div>}
                </button>
            </div>
            <div className="">
                {step === 1 &&
                    <div className="flex flex-col gap-y-3">
                        <OrderInfo type={"waiting"}/>
                        <OrderInfo type={"waiting"}/>
                        <OrderInfo type={"waiting"}/>
                    </div>
                }
                {step === 2 && <h3>Order History</h3>}
                {step === 3 && <h3>Cancelled orders</h3>}
            </div>
        </div>
    )
}

export default OrderManager