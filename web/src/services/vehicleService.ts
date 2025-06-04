import axios from "axios";
import { clientCookies } from "@/utils/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getVehicleById= async (id: number) => {
    const tokens = clientCookies.getAuthTokens();
    try {
        const response= await axios.get(`${BASE_URL}/vehicle/${id}`, {
            headers: {
                Authorization: `Bearer ${tokens?.access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(`Error fetching vehicle with id ${id}:`, error);
        throw error;
    }
}

export const updateVehicleStatus= async (id: number, status: string) => {
    const tokens = clientCookies.getAuthTokens();
    try {
        const response= await axios.put(`${BASE_URL}/vehicle/admin/${id}`, { status }, {
            headers: {
                Authorization: `Bearer ${tokens?.access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(`Error updating vehicle status with id ${id}:`, error);
        throw error;
    }
}