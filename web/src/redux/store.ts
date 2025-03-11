import { configureStore } from "@reduxjs/toolkit";
import {storeSlice} from "./slice/storeSlice";
import {vendorSlice} from "./slice/vendorSlice";
import {stepOrderSlice} from "./slice/stepOrderSlice";
import {verifyDriverStepSlice} from "@/redux/slice/verifyDriverStepSlice";
import authReducer from "./slice/authSlice";
import driverReducer from './slice/driverSlice';

const store= configureStore({
    reducer: {
        store: storeSlice.reducer,
        vendor: vendorSlice.reducer,
        stepOrder: stepOrderSlice.reducer,
        verifyDriverStep: verifyDriverStepSlice.reducer,
        auth: authReducer,
        driver: driverReducer,
    }
})

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;