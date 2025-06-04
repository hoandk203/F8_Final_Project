import axios from 'axios';
import { clientCookies } from '@/utils/cookies';
import { IssueMessage } from '@/types/issue';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Lấy danh sách tin nhắn của issue
export const getIssueMessages = async (
  issueId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<{ messages: IssueMessage[], total: number }> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/${issueId}/messages`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Tạo tin nhắn mới
export const createIssueMessage = async (data: {
  issueId: number;
  message: string;
  senderId: number;
  fileIds?: string[];
}): Promise<IssueMessage> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.post(`${API_URL}/issues/${data.issueId}/messages`, data, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};