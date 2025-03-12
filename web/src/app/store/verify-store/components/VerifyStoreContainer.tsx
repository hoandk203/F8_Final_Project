"use client"

import VerifyEmail from "@/components/VerifyEmail"
import { useState } from "react";
import ConfirmStoreInfo from "./ConfirmStoreInfo";


const VerifyStoreContainer = () => {
    const [stepVerifyStore, setStepVerifyStore] = useState(0);
    return (
        <div>
            {stepVerifyStore === 0 && <VerifyEmail stepVerifyStore={setStepVerifyStore} />}
            {stepVerifyStore === 1 && <ConfirmStoreInfo />}
        </div>
    )
}

export default VerifyStoreContainer