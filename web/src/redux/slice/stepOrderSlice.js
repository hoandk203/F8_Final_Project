const {createSlice} = require("@reduxjs/toolkit");

const initialState= {
    step: 0
}

export const stepOrderSlice= createSlice({
    name: 'stepOrder',
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step= action.payload
        }
    }
})

export const {setStep}= stepOrderSlice.actions