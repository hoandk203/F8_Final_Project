import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clientCookies } from "@/utils/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const fetchMaterialList = createAsyncThunk(
  "material/fetchMaterialList",
  async () => {
    const tokens = clientCookies.getAuthTokens();
    try {
      const response = await axios.get(`${BASE_URL}/material`, {
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
); 