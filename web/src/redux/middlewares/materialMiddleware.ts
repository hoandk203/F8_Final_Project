import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const fetchMaterialList = createAsyncThunk(
  "material/fetchMaterialList",
  async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const response = await axios.get(`${BASE_URL}/material`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
); 