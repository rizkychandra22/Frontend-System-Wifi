import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment";
import { toast } from "sonner";

export function useCustomerPayments(customerId: number | null) {
  return useQuery({
    queryKey: ["payments", customerId],
    queryFn: () => paymentApi.getCustomerPayments(customerId!),
    enabled: !!customerId,
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.getAllPayments,
  });
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil dicatat");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal mencatat tagihan");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { customer_id: number; wifi_package_id: number } }) => 
      paymentApi.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil diperbarui");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal memperbarui tagihan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: paymentApi.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Tagihan berhasil dihapus");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal menghapus tagihan");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
