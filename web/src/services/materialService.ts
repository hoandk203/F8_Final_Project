import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMaterials = () => {
  return axios.get(`${API_BASE_URL}/material`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });
};

export const getMaterialById = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/material/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch material");
    }
    throw new Error("Server connection error");
  }
};

export const createMaterial = async (materialData: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.post(`${API_BASE_URL}/material`, materialData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create material");
    }
    throw new Error("Server connection error");
  }
};

export const updateMaterial = async (id: number, materialData: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/material/${id}`, materialData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update material");
    }
    throw new Error("Server connection error");
  }
};

export const deleteMaterial = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.delete(`${API_BASE_URL}/material/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to delete material");
    }
    throw new Error("Server connection error");
  }
}; 