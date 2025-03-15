"use client"

import { useState } from "react";
import CustomButton from "@/components/CustomButton";

const ActionOrder = () => {

    const [open, setOpen] = useState(false);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-y-2">
            <CustomButton label="Mask as moving" variant="dark" size="medium" handleOpenDialog={handleOpenDialog}/>
            <CustomButton label="Mask as arrived" variant="light" size="medium"/>
            <CustomButton label="Cancel ride" variant="light" size="medium"/>
        </div>
    )
}

export default ActionOrder