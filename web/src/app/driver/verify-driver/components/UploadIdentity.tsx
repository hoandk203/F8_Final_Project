"use client"

import {useCallback, useState} from "react";
import CustomButton from "@/components/CustomButton";
import UploadImages from "@/components/UploadImages";
import {uploadIdCard} from "@/services/imageService";

interface Props {
    setStep: (step: number) => void
    userId: number,
    setIdentityDocumentId: (id: number) => void
}

const UploadIdentity = ({setStep, userId, setIdentityDocumentId}:Props) => {

    const [error, setError] = useState("")
    const [frontSide, setFrontSide] = useState("")
    const [backSide, setBackSide] = useState("")

    const setFrontSideCallback = useCallback((value: string) => {
        setError("")
        setFrontSide(value)
    }, []);
    const setBackSideCallback = useCallback((value: string) => {
        setError("")
        setBackSide(value)
    }, []);

    const handleUploadIdCard = async () => {
        localStorage.removeItem("verifyIdStep")
        localStorage.removeItem("verifyDriverStep")
        try {
            if (frontSide && backSide) {
                const identityData= {
                    userId,
                    frontImageUrl: frontSide,
                    backImageUrl: backSide,
                    status: "pending"
                }
                const response= await uploadIdCard(identityData)
                setIdentityDocumentId(response.id)
                setStep(1)
                localStorage.removeItem("userId")
            }else{
                setError("Please upload Front side & Back side")
            }
        } catch (e) {
            console.log(e)
        }

    }


    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify driver identity</h1>
            <p className="text-[#666]">Please upload a photo of your ID card & drive license to confirm your identity</p>
            <div className="mt-8">
                <p className="text-start font-semibold mb-2">Upload driver's license</p>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <UploadImages setFrontSide={setFrontSideCallback}/>
                        <p className="mt-2">Front side</p>
                    </div>
                    <div>
                        <UploadImages setBackSide={setBackSideCallback}/>
                        <p className="mt-2">Back side</p>
                    </div>
                </div>
            </div>
            <div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
            <div className={"grid grid-cols-1 mt-10"}>
                <CustomButton label="Verify ID card" variant="dark" size="large" handleUploadIdCard={handleUploadIdCard}/>
            </div>
        </div>
    )
}

export default UploadIdentity;