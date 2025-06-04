import apiClient from "@/utils/axiosInterceptor";

export const createUser = async (userData: any) => {
  try {
    const response = await apiClient.post('users/admin/create', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create user");
    }
  }
}