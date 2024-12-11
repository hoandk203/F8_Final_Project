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
    handleCloseDialog?: () => void
    handleOpenDialog?: () => void
    setVerifyStep?: () => void
    changeVerifyIdStep?: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({label, type= "button", disabled, variant= "dark", size= "medium", handleCloseDialog, handleOpenDialog, setVerifyStep, changeVerifyIdStep}) => {
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
        if (setVerifyStep) {
            setVerifyStep();
        }
        if (changeVerifyIdStep) {
            changeVerifyIdStep();
        }
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