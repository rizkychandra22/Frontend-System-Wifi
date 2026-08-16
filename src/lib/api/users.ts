import { apiClient } from "../api-client";

export interface User {
  id: number;
  name: string;
  phone: string;
  role: "admin" | "employee" | "customer";
  address: string | null;
  device_id: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
  registered_by?: { id: number; name: string; role: string };
  created_at: string;
  updated_at: string;
}

export interface AdminContact {
  name: string;
  phone: string;
}

export const usersApi = {
  // Get all users
  getUsers: async (all?: boolean): Promise<User[]> => {
    const url = all ? "/users?all=true" : "/users";
    const response = await apiClient.get<{ data: User[] }>(url);
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: string | number): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },

  // Create new user
  createUser: async (data: {
    name: string;
    phone: string;
    role: string;
    address?: string;
  }): Promise<User> => {
    const response = await apiClient.post<{ message: string; data: User }>("/users", data);
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
    const response = await apiClient.put<{ message: string; data: User }>(`/users/${id}`, data);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Reset user IP address
  resetUserIP: async (id: string | number): Promise<void> => {
    await apiClient.put(`/users/${id}/reset-ip`);
  },

  // Get admin contact
  getAdminContact: async (): Promise<AdminContact> => {
    const response = await apiClient.get<{ data: AdminContact }>("/auth/admin-contact");
    return response.data.data;
  },
};
