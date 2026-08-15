import { apiClient } from "../api-client";
import type { User } from "./users";
import type { WifiPackage } from "./wifi_package";

export interface Customer extends User {
  registered_by_id?: number;
  registered_by?: User;
}

export const customerApi = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get<{ data: Customer[] }>("/customers");
    return response.data.data;
  },
  createCustomer: async (data: {
    name: string;
    phone: string;
    address?: string;
  }): Promise<Customer> => {
    const response = await apiClient.post<{ message: string; data: Customer }>("/customers", data);
    return response.data.data;
  },
  getCustomerSubscription: async (customerId: number | string) => {
    const response = await apiClient.get<{ data: WifiPackage }>(`/customers/${customerId}/subscription`);
    return response.data.data;
  },
};
