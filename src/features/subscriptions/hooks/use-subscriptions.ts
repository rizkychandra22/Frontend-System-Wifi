import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "@/lib/api/subscription";
import { toast } from "sonner";

export function useAllSubscriptions() {
  const query = useQuery({
    queryKey: ["subscriptions"],
    queryFn: subscriptionApi.getAllSubscriptions,
  });

  return {
    query,
    subscriptions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useCustomerSubscription(customerId: number | string | undefined) {
  const query = useQuery({
    queryKey: ["customer-subscription", customerId],
    queryFn: () => subscriptionApi.getSubscriptionByCustomerID(customerId!),
    enabled: !!customerId,
  });

  return {
    query,
    subscription: query.data ?? null,
    isLoading: query.isLoading,
  };
}

export function useSubscriptionMutations() {
  const queryClient = useQueryClient();

  const createOrUpdateMutation = useMutation({
    mutationFn: subscriptionApi.createOrUpdateSubscription,
    onSuccess: (response) => {
      toast.success(response.message || "Data langganan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["customer-subscription"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      const errMsg = err.response?.data?.error || "Gagal menyimpan data langganan";
      toast.error(errMsg);
    },
  });

  return {
    createOrUpdateMutation,
    isPending: createOrUpdateMutation.isPending,
  };
}
