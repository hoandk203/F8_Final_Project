"use client"

import { useEffect } from 'react';
import VerifyEmail from "../../../../components/VerifyEmail"
import VerifyIdentity from "./VerifyIdentity";
import VerifyVehicle from "./VerifyVehicle";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";

// components này để bọc components con rồi dùng useSelector để VerifyDriverPage giữ server side
const VerifyDriverContainer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const verifyDriverStep = useSelector((state: RootState) => state.verifyDriverStep.step);

    useEffect(() => {
        // Đảm bảo code chỉ chạy ở client side
        if (typeof window !== 'undefined') {
            const localStep = localStorage.getItem("verifyDriverStep");
            if (localStep) {
                dispatch(setVerifyDriverStep(Number(localStep)));
            }
        }
    }, [dispatch]); // Thêm dispatch vào dependencies

    return (
        <>
            {verifyDriverStep === 0 && <VerifyEmail/>}
            {verifyDriverStep === 1 && <VerifyIdentity/>}
            {verifyDriverStep === 2 && <VerifyVehicle/>}
        </>
    );
};

export default VerifyDriverContainer;