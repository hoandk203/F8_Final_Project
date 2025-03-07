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

export const getProfile = async (accessToken: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: {
                "Bearer": accessToken
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
