import { configureStore } from "@reduxjs/toolkit";
import {storeSlice} from "./slice/storeSlice";
import {vendorSlice} from "./slice/vendorSlice";
import {stepOrderSlice} from "./slice/stepOrderSlice";
import {verifyDriverStepSlice} from "@/redux/slice/verifyDriverStepSlice";

const store= configureStore({
    reducer: {
        store: storeSlice.reducer,
        vendor: vendorSlice.reducer,
        stepOrder: stepOrderSlice.reducer,
        verifyDriverStep: verifyDriverStepSlice.reducer
    }
})

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;