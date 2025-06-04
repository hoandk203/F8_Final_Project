import axios from "axios";
import { clientCookies } from "@/utils/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getStoreProfile = async () => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/store/profile`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch store profile");
    }
    throw new Error("Server connection error");
  }
};

export const updateStoreProfile = async (profileData: any) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/store/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update store profile");
    }
    throw new Error("Server connection error");
  }
};

export const uploadStoreLogo = async (file: File) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const formData = new FormData();
    formData.append("logo", file);
    
    const response = await axios.post(`${API_BASE_URL}/store/upload-logo`, formData, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to upload logo");
    }
    throw new Error("Server connection error");
  }
};

export const saveStoreLocation = async (storeId: number, latitude: number, longitude: number) => {
  try {
    
    const response = await axios.post(`${API_BASE_URL}/store-location`, {
      storeId,
      latitude,
      longitude
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to save store location");
    }
    throw new Error("Server connection error");
  }
};

export const getStoreLocation = async (storeId: number) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/location/store/${storeId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to get store location");
    }
    throw new Error("Server connection error");
  }
};

export const getStoreByVendorId = async (vendorId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/store/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to get store by vendor id");
    }
    throw new Error("Server connection error");
  }
}