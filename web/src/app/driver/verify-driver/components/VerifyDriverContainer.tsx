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
        // Chỉ truy cập localStorage ở phía client
        const localStep = localStorage.getItem("verifyDriverStep");
        if (localStep) {
            dispatch(setVerifyDriverStep(Number(localStep)));
        }
    }, []); // Empty dependency array means this runs once on mount

    return (
        <>
            {verifyDriverStep === 0 && <VerifyEmail/>}
            {verifyDriverStep === 1 && <VerifyIdentity/>}
            {verifyDriverStep === 2 && <VerifyVehicle/>}
        </>
    );
};

export default VerifyDriverContainer;