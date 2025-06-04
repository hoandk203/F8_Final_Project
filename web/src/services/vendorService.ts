import apiClient from "@/utils/axiosInterceptor";

export const getVendorListForStore = async () => {
  try {
    const response = await apiClient.get(`/vendor/list-for-store`);
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Unable to fetch vendor list");
    }
    throw new Error("Server connection error");
  }
};

export const createVendor = async (vendorData: any) => {
  try {
    const response = await apiClient.post('/vendor', vendorData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create vendor");
    }
  }
}

export const updateVendor = async (vendorId: number, vendorData: any) => {
  try {
    const response = await apiClient.put(`/vendor/${vendorId}`, vendorData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update vendor");
    }
  }
}           