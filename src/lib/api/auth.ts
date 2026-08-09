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

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}

export const updateProfileApi = async (data: UpdateProfilePayload) => {
  const response = await apiClient.put("/auth/profile", data);
  return response.data;
};
