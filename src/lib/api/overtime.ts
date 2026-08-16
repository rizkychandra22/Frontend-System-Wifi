import { api } from "./axios";

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
    const { data } = await api.get<{ data: Overtime[] }>("/overtimes");
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<{ data: Overtime }>(`/overtimes/${id}`);
    return data.data;
  },

  create: async (overtimeData: CreateOvertimeData) => {
    const { data } = await api.post<{ message: string; data: Overtime }>("/overtimes", overtimeData);
    return data;
  },

  update: async (id: number, overtimeData: UpdateOvertimeData) => {
    const { data } = await api.put<{ message: string; data: Overtime }>(`/overtimes/${id}`, overtimeData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<{ message: string }>(`/overtimes/${id}`);
    return data;
  },
};
