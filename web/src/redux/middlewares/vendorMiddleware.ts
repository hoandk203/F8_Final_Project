import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchVendorList = createAsyncThunk('vendor/fetchVendorList', async () => {
    try {
        const response= await axios.get(`${API_BASE_URL}/vendor`)
        return response.data
    }catch (e) {
        console.log(e)
        return e
    }
})

export {fetchVendorList}