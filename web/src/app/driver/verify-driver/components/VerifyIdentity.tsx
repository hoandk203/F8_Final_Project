"use client"

import {useEffect, useState} from "react";

import ConfirmIdentity from "./ConfirmIdentity";
import UploadIdentity from "./UploadIdentity";


const VerifyIdentity = () => {
    const [step, setStep] = useState(0)
    const [userId, setUserId] = useState(0)
    const [identityDocumentId, setIdentityDocumentId] = useState(0)

    useEffect(() => {
        const userIdStore = JSON.parse(localStorage.getItem("userId") || "{}");
        setUserId(userIdStore)

        const localStep= localStorage.getItem("verifyIdStep")

        if(localStep){
            setStep(Number(localStep))
        }
    }, []);



    // xoa localStorage khi thoat trang
    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("userData");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div>
            {step===0?<UploadIdentity setIdentityDocumentId={setIdentityDocumentId} userId={userId} setStep={setStep}/>:<ConfirmIdentity identityDocumentId={identityDocumentId} userId={userId} setStep={setStep}/>}
        </div>
    )
}

export default VerifyIdentity;