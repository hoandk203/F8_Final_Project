"use client"

import { useEffect, useState } from 'react';
import VerifyEmail from "../../../../components/VerifyEmail"
import VerifyIdentity from "./VerifyIdentity";
import VerifyVehicle from "./VerifyVehicle";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {setStep as setVerifyDriverStep} from "@/redux/slice/verifyDriverStepSlice";
import { CircularProgress } from '@mui/material';

// components này để bọc components con rồi dùng useSelector để VerifyDriverPage giữ server side
const VerifyDriverContainer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const verifyDriverStep = useSelector((state: RootState) => state.verifyDriverStep.step);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const localStep = window?.localStorage?.getItem("verifyDriverStep");
        if (localStep) {
            dispatch(setVerifyDriverStep(Number(localStep)));
        }
    }, []);

    if (!isMounted) {
        return <div className="flex justify-center items-center">
            <CircularProgress />
        </div>;
    }

    return (
        <>
            {verifyDriverStep === 0 && <VerifyEmail/>}
            {verifyDriverStep === 1 && <VerifyIdentity/>}
            {verifyDriverStep === 2 && <VerifyVehicle/>}
        </>
    );
};

export default VerifyDriverContainer;