import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadIdCard = async (file: any) => {
    try {
        const image= {payload: file}
        const response = await axios.post(`${API_BASE_URL}/image`, image, {
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