import axios from "axios";

export const sendVerificationEmail = async (userData: any) => {
    try {
        const response = await axios.post("http://localhost:3000/users/send-mail",userData,{
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response)
        if (response.data) {
            return response.data;
        } else {
            throw new Error("Failed to send email");
        }
    } catch (error: any) {
        if(error.response){
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};