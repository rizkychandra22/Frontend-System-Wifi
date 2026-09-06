import { apiClient } from "../api-client";

export interface Allowance {
  id: number;
  title: string;
  description: string;
  amount: number;
  month: string; // format: "YYYY-MM"
  target_type: "personal" | "global";
  user_id: number | null;
  user?: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
  created_by_id: number;
  created_by?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AllowanceInput {
  title: string;
  description?: string;
  amount: number;
  month: string;
  target_type: "personal" | "global";
  user_id?: number | null;
}

export const allowanceApi = {
  getAllowances: async (month?: string): Promise<Allowance[]> => {
    const url = month && month !== "all" ? `/allowances?month=${month}` : "/allowances";
    const response = await apiClient.get<{ data: Allowance[] }>(url);
    return response.data.data;
  },

  getAllowanceById: async (id: number | string): Promise<Allowance> => {
    const response = await apiClient.get<{ data: Allowance }>(`/allowances/${id}`);
    return response.data.data;
  },

  createAllowance: async (data: AllowanceInput): Promise<Allowance> => {
    const response = await apiClient.post<{ message: string; data: Allowance }>("/allowances", data);
    return response.data.data;
  },

  updateAllowance: async (id: number | string, data: AllowanceInput): Promise<Allowance> => {
    const response = await apiClient.put<{ message: string; data: Allowance }>(`/allowances/${id}`, data);
    return response.data.data;
  },

  deleteAllowance: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/allowances/${id}`);
  },
};
