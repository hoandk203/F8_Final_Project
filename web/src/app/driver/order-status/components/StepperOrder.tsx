"use client"

import {useState} from 'react';
import {Stepper, Step, StepButton} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';


const steps = [
    'Accepted',
    'On moving',
    'Complete Order',
  ];

const StepperOrder = () => {
    const step = useSelector((state: any) => state.stepOrder.step)
    
    return (
        <div>
            <Stepper activeStep={step} alternativeLabel
                sx={{
                    '& .MuiStepIcon-root.Mui-active': {
                        color: '#1d1d1d',
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                        color: '#1d1d1d',
                    },
                }}
            >
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepButton>{label}</StepButton>
                            </Step>
                    )})}
            </Stepper>
        </div>
    )
}

export default StepperOrder