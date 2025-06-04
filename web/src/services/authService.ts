import axios from "axios";
import { clientCookies, AuthTokens } from "@/utils/cookies";

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
    const tokens = clientCookies.getAuthTokens();
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/verification-status`, {
            headers: {
                Authorization: `Bearer ${tokens?.access_token}`
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

export const createAdmin = async (adminData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin`, adminData, {
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.put(`${API_BASE_URL}/auth/update-profile`, profileData, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
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
    const tokens = clientCookies.getAuthTokens();
    
    if (!tokens?.access_token) {
      throw new Error("Authentication required");
    }
    
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
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

// Helper functions for authentication management
export const setAuthTokens = (tokens: AuthTokens) => {
    clientCookies.setAuthTokens(tokens);
};

export const getAuthTokens = (): AuthTokens | null => {
    return clientCookies.getAuthTokens();
};

export const clearAuthTokens = () => {
    clientCookies.clearAuthTokens();
};

export const isAuthenticated = (): boolean => {
    const tokens = getAuthTokens();
    return Boolean(tokens?.access_token && tokens?.refresh_token);
};

// Logout function that clears tokens and redirects
export const logout = async () => {
    try {
        const tokens = getAuthTokens();
        if (tokens?.refresh_token) {
            // Call logout API
            await axios.post(`${API_BASE_URL}/auth/logout`, 
                { refresh_token: tokens.refresh_token },
                {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        }
    } catch (error) {
        console.error('Error during logout API call:', error);
    } finally {
        // Always clear tokens regardless of API call success
        clearAuthTokens();
    }
};