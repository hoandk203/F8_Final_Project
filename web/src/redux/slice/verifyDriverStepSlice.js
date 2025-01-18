const {createSlice} = require("@reduxjs/toolkit");

const initialState= {
    step: 0
}

export const verifyDriverStepSlice= createSlice({
    name: 'verifyDriverStep',
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step= action.payload
        }
    }
})

export const {setStep}= verifyDriverStepSlice.actions