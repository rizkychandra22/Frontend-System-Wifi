import { apiClient } from "@/lib/api-client";

export interface Overtime {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    role: string;
  };
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  created_at: string;
}

export interface CreateOvertimeData {
  user_id?: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface UpdateOvertimeData extends CreateOvertimeData {}

export const overtimeApi = {
  getAll: async () => {
    const { data } = await apiClient.get<{ data: Overtime[] }>("/overtimes");
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<{ data: Overtime }>(`/overtimes/${id}`);
    return data.data;
  },

  create: async (data: CreateOvertimeData) => {
    const response = await apiClient.post<{ data: Overtime }>("/overtimes", data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateOvertimeData) => {
    const response = await apiClient.put<{ data: Overtime }>(`/overtimes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete<{ message: string }>(`/overtimes/${id}`);
    return data;
  },
};
