import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const fetchDriverList = createAsyncThunk(
    'driver/fetchDriverList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/driver`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
); 