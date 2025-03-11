import { createSlice } from '@reduxjs/toolkit';
import { fetchDriverList } from '@/redux/middlewares/driverMiddleware';

interface DriverState {
    driverList: any[];
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    error: string | null;
}

const initialState: DriverState = {
    driverList: [],
    status: 'idle',
    error: null,
};

const driverSlice = createSlice({
    name: 'driver',
    initialState,
    reducers: {
        searchDriverByName: (state, action) => {
            state.driverList = action.payload;
        },
        softDeleteDriver: (state, action) => {
            state.driverList = state.driverList.filter(driver => driver.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDriverList.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchDriverList.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.driverList = action.payload;
            })
            .addCase(fetchDriverList.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message || 'Có lỗi xảy ra';
            });
    }
});

export const { searchDriverByName, softDeleteDriver } = driverSlice.actions;
export default driverSlice.reducer; 