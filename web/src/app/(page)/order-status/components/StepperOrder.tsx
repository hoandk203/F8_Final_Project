"use client"

import {useState} from 'react';
import {Stepper, Step, StepButton} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { stepOrderSlice } from '@/redux/slice/stepOrderSlice';


const steps = [
    'Accepted order',
    'On moving',
    'Picked up',
    'Completed',
  ];

const StepperOrder = () => {
    const step = useSelector((state: any) => state.stepOrder.step)
    const dispatch= useDispatch()

    const handleStep = (updateStep: number) => () => {
        dispatch(stepOrderSlice.actions.setStep(updateStep))
    };

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