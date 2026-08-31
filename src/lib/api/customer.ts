import { apiClient } from "../api-client";
import type { User } from "./users";
import type { Subscription } from "./subscription";

export interface Customer extends User {
  registered_by_id?: number;
  registered_by?: User;
}

export const customerApi = {
  getCustomerSubscription: async (customerId: number | string) => {
    const response = await apiClient.get<{ data: Subscription }>(`/customers/${customerId}/subscription`);
    return response.data.data;
  },
};
