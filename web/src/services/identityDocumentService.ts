import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getIdentityDocument = async (id: number) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axios.get(`${BASE_URL}/identity-document/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error fetching identity document with id ${id}:`, error);
    throw error;
  }
};

export const updateIdentityDocumentStatus = async (documentId: number, status: string) => {
  const accessToken = localStorage.getItem("access_token");
  try {
    return await axios.put(
        `${BASE_URL}/identity-document/admin/${documentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
    );
  } catch (error) {
    console.log(`Error updating identity document status:`, error);
    throw error;
  }
}; 