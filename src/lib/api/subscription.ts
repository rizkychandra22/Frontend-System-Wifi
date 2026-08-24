import { apiClient } from "../api-client";
import type { User } from "./users";
import type { WifiPackage } from "./wifi_package";

export interface Subscription {
  id: number;
  customer_id: number;
  customer?: User;
  wifi_package_id: number;
  wifi_package?: WifiPackage;
  billing_day: number;
  next_due_date: string; // ISO String
  status: "active" | "suspended" | "cancelled" | string;
  created_at: string;
  updated_at: string;
}

export const subscriptionApi = {
  getAllSubscriptions: async () => {
    const response = await apiClient.get<{ data: Subscription[] }>("/subscriptions");
    return response.data.data;
  },
  createOrUpdateSubscription: async (data: {
    customer_id: number;
    wifi_package_id: number;
    billing_day: number;
    next_due_date: string;
    status: string;
  }) => {
    const response = await apiClient.post<{ message?: string; data: Subscription }>("/subscriptions", data);
    return response.data;
  },
  getSubscriptionByCustomerID: async (customerId: number | string) => {
    const response = await apiClient.get<{ data: Subscription }>(`/subscriptions/customer/${customerId}`);
    return response.data.data;
  },
  deleteSubscription: async (id: number) => {
    const response = await apiClient.delete<{ message?: string }>(`/subscriptions/${id}`);
    return response.data;
  }
};
