import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMaterials = async () => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${BASE_URL}/material`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
};

export const getMaterialById = async (id: number) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${BASE_URL}/material/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching material with id ${id}:`, error);
    throw error;
  }
};

export const createMaterial = async (data: any) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.post(`${BASE_URL}/material`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating material:", error);
    throw error;
  }
};

export const updateMaterial = async (id: number, data: any) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.put(`${BASE_URL}/material/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating material with id ${id}:`, error);
    throw error;
  }
};

export const deleteMaterial = async (id: number) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.delete(`${BASE_URL}/material/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting material with id ${id}:`, error);
    throw error;
  }
};

export const searchMaterial = async (name: string) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${BASE_URL}/material/search?name=${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching materials with name ${name}:`, error);
    throw error;
  }
}; 