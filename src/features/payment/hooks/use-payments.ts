import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi, type Payment } from "@/lib/api/payment";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";

export function useCustomerPayments(customerId: number | null) {
  const query = useQuery<Payment[], AxiosError<ApiErrorResponse>>({
    queryKey: ["payments", customerId],
    queryFn: () => paymentApi.getCustomerPayments(customerId!),
    enabled: !!customerId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    ...query,
    payments: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useAllPayments() {
  const query = useQuery<Payment[], AxiosError<ApiErrorResponse>>({
    queryKey: ["payments"],
    queryFn: paymentApi.getAllPayments,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    ...query,
    payments: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    Payment,
    AxiosError<ApiErrorResponse>,
    { customer_id: number; wifi_package_id: number; payment_method: string }
  >({
    mutationFn: paymentApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil dicatat");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal mencatat tagihan");
    },
  });

  const updateMutation = useMutation<
    Payment,
    AxiosError<ApiErrorResponse>,
    { id: number; data: { customer_id: number; wifi_package_id: number; payment_method: string } }
  >({
    mutationFn: ({ id, data }) => paymentApi.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal memperbarui tagihan");
    },
  });

  const deleteMutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: paymentApi.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil dihapus");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menghapus tagihan");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
