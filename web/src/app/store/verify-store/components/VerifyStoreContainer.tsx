"use client"

import VerifyEmail from "@/components/VerifyEmail"
import {useEffect, useState} from "react";
import ConfirmStoreInfo from "./ConfirmStoreInfo";
import {useRouter} from "next/navigation";


const VerifyStoreContainer = () => {
    const [stepVerifyStore, setStepVerifyStore] = useState(0);
    const router= useRouter()

    useEffect(() => {
        if(localStorage.getItem("stepVerifyStore")){
            setStepVerifyStore(Number(localStorage.getItem("stepVerifyStore")))
        }
    }, []);

    return (
        <div>
            {stepVerifyStore === 0 && <VerifyEmail stepVerifyStore={setStepVerifyStore} />}
            {stepVerifyStore === 1 && <ConfirmStoreInfo />}
        </div>
    )
}

export default VerifyStoreContainer