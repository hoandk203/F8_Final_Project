import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getOrders = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch orders");
    }
    throw new Error("Server connection error");
  }
};

export const getOrderById = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch order");
    }
    throw new Error("Server connection error");
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create order");
    }
    throw new Error("Server connection error");
  }
};

export const updateOrder = async (id: number, orderData: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/order/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update order");
    }
    throw new Error("Server connection error");
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.delete(`${API_BASE_URL}/order/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to delete order");
    }
    throw new Error("Server connection error");
  }
}; 