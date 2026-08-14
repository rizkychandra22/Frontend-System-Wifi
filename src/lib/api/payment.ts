import { apiClient } from "../api-client";
import type { User } from "./users";
import type { WifiPackage } from "./wifi_package";

export interface Payment {
  id: number;
  customer_id: number;
  customer?: User;
  wifi_package_id: number;
  wifi_package?: WifiPackage;
  package_price: number;
  ppn: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const paymentApi = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<{ data: Payment[] }>("/payments");
    return response.data.data;
  },
  createPayment: async (data: { customer_id: number; wifi_package_id: number }): Promise<Payment> => {
    const response = await apiClient.post<{ message: string; data: Payment }>("/payments", data);
    return response.data.data;
  },
  updatePayment: async (id: number, data: { customer_id: number; wifi_package_id: number }): Promise<Payment> => {
    const response = await apiClient.put<{ message: string; data: Payment }>(`/payments/${id}`, data);
    return response.data.data;
  },
  deletePayment: async (id: number): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
  },
  getCustomerPayments: async (customerId: number | string): Promise<Payment[]> => {
    const response = await apiClient.get<{ data: Payment[] }>(`/payments/history/${customerId}`);
    return response.data.data;
  },
  downloadPaymentPDF: async (paymentId: number) => {
    const response = await apiClient.get(`/payments/${paymentId}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
