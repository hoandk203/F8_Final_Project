import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchVendorList = createAsyncThunk('vendor/fetchVendorList', async () => {
    try {
        const response= await axios.get(`http://localhost:3000/vendor`)
        return response.data
    }catch (e) {
        console.log(e)
        return e
    }
})

export {fetchVendorList}