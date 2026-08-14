import { apiClient } from "../api-client";

export interface User {
  id: number;
  name: string;
  phone: string;
  role: "admin" | "employee" | "customer";
  address: string | null;
  ip_address: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
  registered_by?: { id: number; name: string; role: string };
  created_at: string;
  updated_at: string;
}

export const usersApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<{ data: User[] }>("/admin/users");
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: string | number): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(`/admin/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (data: {
    name: string;
    phone: string;
    role: string;
    address?: string;
  }): Promise<User> => {
    const response = await apiClient.post<{ message: string; data: User }>("/admin/users", data);
    return response.data.data;
  },

  // Update existing user
  updateUser: async (
    id: string | number,
    data: {
      name?: string;
      phone?: string;
      role?: string;
      address?: string;
    }
  ): Promise<User> => {
    const response = await apiClient.put<{ message: string; data: User }>(`/admin/users/${id}`, data);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Reset user IP address
  resetUserIP: async (id: string | number): Promise<void> => {
    await apiClient.put(`/admin/users/${id}/reset-ip`);
  },
};
