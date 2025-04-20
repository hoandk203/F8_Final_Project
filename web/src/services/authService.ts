import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



export const loginAPI = async (userData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData, {
            headers: {
                "Content-Type": "application/json"
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

export const verificationStatusAPI = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/verification-status`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const getProfile = async (accessToken: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const refreshToken = async (refreshToken: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh_token: refreshToken}, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const sendVerificationEmail = async (userData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/send-mail`,userData,{
            headers: {
                "Content-Type": "application/json"
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

export const verifyEmail = async (userData: any) => {
    try {
        const response= await axios.post(`${API_BASE_URL}/users`,userData,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const createDriver = async (userData: any) => {
    try {
        const response= await axios.post(`${API_BASE_URL}/driver`,userData,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const createStore = async (storeData: any) => {
    try {
        const response= await axios.post(`${API_BASE_URL}/store`,storeData,{
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const createVendor = async (vendorData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/vendor`, vendorData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const updateUserProfile = async (profileData: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/auth/update-profile`, profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update user profile");
    }
    throw new Error("Server connection error");
  }
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    
    if (!accessToken) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to change password");
    }
    throw new Error("Server connection error");
  }
};

export const resetPassword = async (userData: any) => {
    try {
        const response= await axios.post(`${API_BASE_URL}/auth/reset-password`, userData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.data
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}