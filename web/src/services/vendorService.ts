import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const getVendorListForStore = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/list-for-store`);
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Unable to fetch vendor list");
    }
    throw new Error("Server connection error");
  }
};
