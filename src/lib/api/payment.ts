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
  payment_method: string;
  status: string;
  invoice_number?: string;
  created_by_id?: number;
  created_by?: User;
  created_at: string;
  updated_at: string;
}

export const paymentApi = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await apiClient.get<{ data: Payment[] }>("/payments/invoice");
    return response.data.data;
  },
  createPayment: async (data: { customer_id: number; wifi_package_id: number; payment_method: string }): Promise<Payment> => {
    const response = await apiClient.post<{ message: string; data: Payment }>("/payments/invoice", data);
    return response.data.data;
  },
  updatePayment: async (id: number, data: { customer_id: number; wifi_package_id: number; payment_method: string }): Promise<Payment> => {
    const response = await apiClient.put<{ message: string; data: Payment }>(`/payments/invoice/${id}`, data);
    return response.data.data;
  },
  deletePayment: async (id: number): Promise<void> => {
    await apiClient.delete(`/payments/invoice/${id}`);
  },
  getCustomerPayments: async (customerId: number | string): Promise<Payment[]> => {
    const response = await apiClient.get<{ data: Payment[] }>(`/payments/history/${customerId}`);
    return response.data.data;
  },
  downloadPaymentPDF: async (paymentId: number, filename: string) => {
    const response = await apiClient.get(`/payments/invoice/${paymentId}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }
};
