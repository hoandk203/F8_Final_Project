import axios from "axios";
import { clientCookies } from "@/utils/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getIdentityDocument = async (id: number) => {
  const tokens = clientCookies.getAuthTokens();
  try {
    const response = await axios.get(`${BASE_URL}/identity-document/${id}`, {
      headers: {
        Authorization: `Bearer ${tokens?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error fetching identity document with id ${id}:`, error);
    throw error;
  }
};

export const updateIdentityDocumentStatus = async (documentId: number, status: string) => {
  const tokens = clientCookies.getAuthTokens();
  try {
    return await axios.put(
        `${BASE_URL}/identity-document/admin/${documentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${tokens?.access_token}`,
          },
        }
    );
  } catch (error) {
    console.log(`Error updating identity document status:`, error);
    throw error;
  }
}; 