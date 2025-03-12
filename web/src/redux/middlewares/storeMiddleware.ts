import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchStoreList = createAsyncThunk('store/fetchStoreList', async () => {
    try {
        const response= await axios.get(`${API_BASE_URL}/store`)
        return response.data
    }catch (e) {
        console.log(e)
        return e
    }
})

export {fetchStoreList}