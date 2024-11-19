import React from "react";
import {Button} from '@mui/material';

interface CustomButtonProps {
    label: string,
    focus: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({label, focus}) => {
    return (
        <Button variant="contained" className={focus ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}>
            {label}
        </Button>
    );
};

export default CustomButton;
