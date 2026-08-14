import { apiClient } from "../api-client";

export interface WifiPackage {
  id: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export const wifiPackageApi = {
  getWifiPackages: async (): Promise<WifiPackage[]> => {
    const response = await apiClient.get<{ data: WifiPackage[] }>("/admin/wifi-packages");
    return response.data.data;
  },
  createWifiPackage: async (data: { name: string; price: number }): Promise<WifiPackage> => {
    const response = await apiClient.post<{ message: string; data: WifiPackage }>("/admin/wifi-packages", data);
    return response.data.data;
  },
  updateWifiPackage: async (id: number, data: { name?: string; price?: number }): Promise<WifiPackage> => {
    const response = await apiClient.put<{ message: string; data: WifiPackage }>(`/admin/wifi-packages/${id}`, data);
    return response.data.data;
  },
  deleteWifiPackage: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/wifi-packages/${id}`);
  },
};
