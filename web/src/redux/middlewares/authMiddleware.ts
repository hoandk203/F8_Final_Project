import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile', 
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      if (error.message === "Access token expired") {
        return rejectWithValue({ message: "Access token expired" });
      }
      return rejectWithValue({ message: "Unable to get user profile" });
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ message: "Unable to refresh token" });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, 
        { refresh_token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return { success: true };
    } catch (error) {
      return rejectWithValue({ message: "Unable to logout" });
    }
  }
); 