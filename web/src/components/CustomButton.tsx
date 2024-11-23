import React from "react";
import {Button} from '@mui/material';

interface CustomButtonProps {
    label: string,
    variant: 'dark' | 'light',
    size: "small" | "medium" | "large"
}

const CustomButton: React.FC<CustomButtonProps> = ({label, variant= "dark", size}) => {
    const buttonStyles = {
        dark: {
            backgroundColor: "#1d1d1d",
        },
        light: {
            backgroundColor: "#efeef3",
            color: "black",
        },
    }

    return (
        <Button variant="contained"
                sx={buttonStyles[variant]}
                size={size}>
            {label}
        </Button>
    );
};

export default CustomButton;