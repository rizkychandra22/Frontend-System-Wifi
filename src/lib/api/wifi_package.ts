import { apiClient } from "../api-client";

export interface WifiService {
  id: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export const wifiServiceApi = {
  getWifiServices: async (): Promise<WifiService[]> => {
    const response = await apiClient.get<{ data: WifiService[] }>("/admin/wifi-services");
    return response.data.data;
  },
  createWifiService: async (data: { name: string; price: number }): Promise<WifiService> => {
    const response = await apiClient.post<{ message: string; data: WifiService }>("/admin/wifi-services", data);
    return response.data.data;
  },
  updateWifiService: async (id: number, data: { name?: string; price?: number }): Promise<WifiService> => {
    const response = await apiClient.put<{ message: string; data: WifiService }>(`/admin/wifi-services/${id}`, data);
    return response.data.data;
  },
  deleteWifiService: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/wifi-services/${id}`);
  },
};
