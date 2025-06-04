import axios from 'axios';
import { Issue, IssueStatus } from '@/types/issue';
import { clientCookies } from '@/utils/cookies';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Lấy danh sách issues
export const getIssues = async (): Promise<Issue[]> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Lấy chi tiết issue
export const getIssue = async (id: number): Promise<Issue> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/${id}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Tạo issue mới
export const createIssue = async (data: any): Promise<Issue> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.post(`${API_URL}/issues`, data, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Cập nhật issue
export const updateIssue = async ({ id, data }: { id: number, data: any }): Promise<Issue> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.patch(`${API_URL}/issues/${id}`, data, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Xóa issue
export const deleteIssue = async (id: number): Promise<void> => {
  const tokens = clientCookies.getAuthTokens();
  await axios.delete(`${API_URL}/issues/${id}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
};

export const searchIssueByName = async (name: string): Promise<any> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/search?name=${name}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response;
};

export const storeSearchIssueByName = async (name: string, storeId: number): Promise<any> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/store/search?name=${name}&storeId=${storeId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response;
};

// Lấy issues theo cửa hàng
export const getIssuesByStore = async (storeId: number): Promise<Issue[]> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/store/${storeId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Lấy issues theo tài xế
export const getIssuesByDriver = async (driverId: number): Promise<Issue[]> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/driver/${driverId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
};

// Lấy issues theo đơn hàng
export const getIssuesByOrder = async (orderId: number): Promise<Issue[]> => {
  const tokens = clientCookies.getAuthTokens();
  const response = await axios.get(`${API_URL}/issues/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.access_token}`
    }
  });
  return response.data;
}; 