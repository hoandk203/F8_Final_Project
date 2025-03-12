"use client"

import VerifyEmail from "../../../../components/VerifyEmail"
import VerifyIdentity from "./VerifyIdentity";
import VerifyVehicle from "./VerifyVehicle";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

// components này để bọc components con rồi dùng useSelector để VerifyDriverPage giữ server side
const VerifyDriverContainer = () => {

    const verifyDriverStep= useSelector((state: RootState) => state.verifyDriverStep.step)


    return (
        <>
            {verifyDriverStep === 0 && <VerifyEmail/>}
            {verifyDriverStep === 1 && <VerifyIdentity/>}
            {verifyDriverStep === 2 && <VerifyVehicle/>}
        </>
    )
}

export default VerifyDriverContainer