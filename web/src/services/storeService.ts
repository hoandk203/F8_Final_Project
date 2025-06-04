import axios from "axios";
import { clientCookies } from "@/utils/cookies";
import apiClient from "@/utils/axiosInterceptor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createStore = async (storeData: any) => {
  try {
    const response = await apiClient.post('/store', storeData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create store");
    }
  }
}

export const updateStore = async (storeId: number, storeData: any) => {
  try {
    const response = await apiClient.put(`/store/${storeId}`, storeData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update store");
    }
    throw new Error("Server connection error");
  }
}

export const uploadStoreLogo = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("logo", file);
    
    const response = await apiClient.post(`/store/upload-logo`, formData, {
      headers: {
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