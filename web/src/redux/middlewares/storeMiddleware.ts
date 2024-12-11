import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchStoreList = createAsyncThunk('store/fetchStoreList', async () => {
    try {
        const response= await axios.get(`http://localhost:3000/store`)
        return response.data
    }catch (e) {
        console.log(e)
        return e
    }
})

export {fetchStoreList}
