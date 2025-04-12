import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadIdCard = async (identityData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/identity-document`, identityData, {
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

export const uploadVehicle = async (vehicleData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/vehicle`, vehicleData, {
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

