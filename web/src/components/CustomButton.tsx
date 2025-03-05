"use client"

import React from "react";
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface CustomButtonProps {
    label: string,
    type?: "button" | "submit" | "reset"
    disabled?: boolean,
    variant: 'dark' | 'light',
    size?: "small" | "medium" | "large",
    isLoading?: boolean,
    handleCloseDialog?: () => void
    handleOpenDialog?: () => void
    handleVerifyDriverStep?: () => void
    handleVerifyIdStep?: () => void
    handleVerifyEmail?: () => void
    handleUploadIdCard?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({label, type= "button", disabled, variant= "dark", size= "medium", isLoading, handleCloseDialog, handleOpenDialog, handleVerifyDriverStep, handleVerifyIdStep, handleVerifyEmail, handleUploadIdCard}) => {
    const buttonStyles = {
        dark: {
            backgroundColor: "#303030",
        },
        light: {
            backgroundColor: "#efeef3",
            color: "black",
        },
    }

    const handleClick = () => {
        if (handleCloseDialog) {
            handleCloseDialog();
        }
        if (handleOpenDialog) {
            handleOpenDialog();
        }
        if (handleVerifyDriverStep) {
            handleVerifyDriverStep();
        }
        if (handleVerifyIdStep) {
            handleVerifyIdStep();
        }
        if (handleVerifyEmail) {
            handleVerifyEmail();
        }
        if (handleUploadIdCard){
            handleUploadIdCard()
        }
    }
    if(isLoading){
        label= "Loading..."
    }
    return (
        <Button variant="contained"
                type={type}
                disabled={disabled}
                sx={buttonStyles[variant]}
                size={size}
                className="!ml-0 font-medium shadow-none normal-case text-[16px] flex items-center gap-x-1"
                onClick={handleClick}>
            {label.includes("Add") && <AddIcon/>}{label}
        </Button>
    );
};

export default CustomButton;