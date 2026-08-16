import apiClient from "../api-client";

export interface LoginPayload {
  phone: string;
  password?: string;
}

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

export const loginApi = async (phone: string, password?: string): Promise<LoginResponse> => {
  const payload: LoginPayload = { phone };
  if (password) {
    payload.password = password;
  }
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data?: Record<string, unknown>;
}

export const updateProfileApi = async (data: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put<UpdateProfileResponse>("/auth/profile", data);
  return response.data;
};

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export const updatePasswordApi = async (data: UpdatePasswordPayload): Promise<UpdatePasswordResponse> => {
  const response = await apiClient.put<UpdatePasswordResponse>("/auth/profile/password", data);
  return response.data;
};
