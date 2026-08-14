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

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pembayaran berhasil dicatat");
      paymentApi.downloadPaymentPDF(data.id);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal mencatat pembayaran");
    },
  });

  return {
    createMutation,
  };
}
