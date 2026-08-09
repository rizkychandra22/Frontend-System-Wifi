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
  profile_picture?: string;
}

export const updateProfileApi = async (data: UpdateProfilePayload) => {
  const response = await apiClient.put("/auth/profile", data);
  return response.data;
};

export const uploadFileApi = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await apiClient.post<{ url: string }>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
