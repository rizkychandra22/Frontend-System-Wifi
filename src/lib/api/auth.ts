import apiClient from "../api-client";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

export const loginApi = async (phone: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", { phone });
  return response.data;
};
