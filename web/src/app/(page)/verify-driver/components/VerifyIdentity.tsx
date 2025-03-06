"use client"

import {useState} from "react";

import ConfirmIdentity from "./ConfirmIdentity";
import UploadIdentity from "./UploadIdentity";


const VerifyIdentity = () => {
    const [step, setStep] = useState(0)

    return (
        <div>
            {/*<ConfirmIdentity/>*/}
            {step===0?<UploadIdentity setStep={setStep}/>:<ConfirmIdentity setStep={setStep}/>}
        </div>
    )
}

export default VerifyIdentity;