"use client"

import {useState} from 'react';
import {Stepper, Step, StepButton} from '@mui/material';

const steps = [
    'Accepted order',
    'On moving',
    'Picked up',
    'Completed',
  ];

const StepperOrder = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <div>
            <Stepper activeStep={activeStep} alternativeLabel
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