import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const saveDriverLocation = async (driverId: number, latitude: number, longitude: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/location`, {
      driverId,
      latitude,
      longitude
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to save driver location");
    }
    throw new Error("Server connection error");
  }
};

export const updateDriverLocation = async (driverId: number, latitude: number, longitude: number) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/location/${driverId}`, {
      latitude,
      longitude
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update driver location");
    }
    throw new Error("Server connection error");
  }
};

export const getDriverLocation = async (driverId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/location/driver/${driverId}`);
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to get driver location");
    }
    throw new Error("Server connection error");
  }
};

export const getOrderHistory = async (driverId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/history/${driverId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to get order history");
    }
    throw new Error("Server connection error");
  }
};

export const getNearbyOrders = async (driverStatus: string, driverId: number, latitude: number, longitude: number, radius: number = 5) => {
  
  
  
  try {
    
    const response = await axios.get(
      `${API_BASE_URL}/order/nearby/${driverId}?latitude=${latitude}&longitude=${longitude}&radius=${radius}&driverStatus=${driverStatus}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching nearby orders:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to get nearby orders");
    }
    throw new Error("Server connection error");
  }
};

export const acceptOrder = async (orderId: number, driverId: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/order/${orderId}/accept/${driverId}`,
      {}
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to accept order");
    }
    throw new Error("Server connection error");
  }
};

export const declineOrder = async (orderId: number, driverId: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/order/${orderId}/decline/${driverId}`,
      {}
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to decline order");
    }
    throw new Error("Server connection error");
  }
};

export const updateDriver = async (driverId: number, data: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/driver/${driverId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update driver status");
    }
    throw new Error("Server connection error");
  }
};

export const getVehicleInfo = async (driverId: number) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/vehicle/driver/${driverId}`, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
      });
      return response.data;
  } catch (error: any) {
      if(error.response){
          throw new Error(error.response.data.message);
      }
      throw error;
  }
};

export const updateVehicleInfo = async (vehicleId: number, vehicleData: any) => {
  try {
      const response = await axios.put(`${API_BASE_URL}/vehicle/${vehicleId}`, vehicleData, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
      });
      return response.data;
  } catch (error: any) {
      if(error.response){
          throw new Error(error.response.data.message);
      }
      throw error;
  }
};

export const getIdentityDocument = async (userId: number) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/identity-document/user/${userId}`, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
      });
      return response.data;
  } catch (error: any) {
      if(error.response){
          throw new Error(error.response.data.message);
      }
      throw error;
  }
};

export const updateIdentityDocument = async (documentId: number, documentData: any) => {
  try {
        const response = await axios.put(`${API_BASE_URL}/identity-document/${documentId}`, documentData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });
      
      return response.data;
  } catch (error: any) {
      if(error.response){
          throw new Error(error.response.data.message);
      }
      throw error;
  }
};

export const getUnpaidPayments = async (driverId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/driver/${driverId}/unpaid`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Không thể lấy thông tin thanh toán");
    }
    throw new Error("Lỗi kết nối server");
  }
};
