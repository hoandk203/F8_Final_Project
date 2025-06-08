import apiClient from "@/utils/axiosInterceptor";
import axios from "axios";

// Public function for home page (no auth required)
export const getPublicMaterials = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/material/public`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching public materials:", error);
    throw error;
  }
};

export const getMaterials = async () => {
  try {
    const response = await apiClient.get('/material');
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
};

export const getMaterialById = async (id: number) => {
  try {
    const response = await apiClient.get(`/material/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching material with id ${id}:`, error);
    throw error;
  }
};

export const createMaterial = async (data: any) => {
  try {
    const response = await apiClient.post('/material', data);
    return response.data;
  } catch (error) {
    console.error("Error creating material:", error);
    throw error;
  }
};

export const updateMaterial = async (id: number, data: any) => {
  try {
    const response = await apiClient.put(`/material/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating material with id ${id}:`, error);
    throw error;
  }
};

export const deleteMaterial = async (id: number) => {
  try {
    const response = await apiClient.delete(`/material/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting material with id ${id}:`, error);
    throw error;
  }
};

export const searchMaterial = async (name: string) => {
  try {
    const response = await apiClient.get(`/material/search?name=${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching materials with name ${name}:`, error);
    throw error;
  }
}; 