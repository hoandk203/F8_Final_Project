import axios from "axios";
import { clientCookies } from "@/utils/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getOrdersByStore = async () => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/byStore`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
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

export const getOrdersUnpaidByStore = async (storeId: number) => {
  try {
    const tokens = clientCookies.getAuthTokens();

    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_BASE_URL}/order/unpaid/byStore/${storeId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch unpaid orders");
    }
    throw new Error("Server connection error");
  }
}

export const getOrderByDriverId = async (driverId: number) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/driver/${driverId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch orders by driver ID");
    }
    throw new Error("Server connection error");
  }
};

export const cancelOrder = async (orderId: number, driverId: number) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/order/${orderId}/cancel/${driverId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to cancel order");
    }
    throw new Error("Server connection error");
  }
};





export const adminGetOrders = async () => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/admin`, {
      headers: {
          Authorization: `Bearer ${tokens?.access_token}`
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/${id}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/order/${id}`, orderData, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.delete(`${API_BASE_URL}/order/${id}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
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

export const getVendorOrders = async (vendorId: number) => {
  try {
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.get(`${API_BASE_URL}/order/vendor/${vendorId}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch vendor orders");
    }
    throw new Error("Server connection error");
  }
}; 