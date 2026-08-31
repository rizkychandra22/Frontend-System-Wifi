import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi, type Subscription } from "@/lib/api/subscription";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";

export function useAllSubscriptions() {
  const query = useQuery<Subscription[], AxiosError<ApiErrorResponse>>({
    queryKey: ["subscriptions"],
    queryFn: subscriptionApi.getAllSubscriptions,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    query,
    subscriptions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useCustomerSubscription(customerId: number | string | undefined) {
  const query = useQuery<Subscription | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["customer-subscription", customerId],
    queryFn: () => subscriptionApi.getSubscriptionByCustomerID(customerId!),
    enabled: !!customerId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    query,
    subscription: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useSubscriptionMutations() {
  const queryClient = useQueryClient();

  const createOrUpdateMutation = useMutation<
    { message?: string; data: Subscription },
    AxiosError<ApiErrorResponse>,
    {
      customer_id: number;
      wifi_package_id: number;
      billing_day: number;
      next_due_date: string;
      status: string;
    }
  >({
    mutationFn: subscriptionApi.createOrUpdateSubscription,
    onSuccess: (response) => {
      toast.success(response.message || "Data langganan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["customer-subscription"] });
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menyimpan data langganan");
    },
  });

  const deleteMutation = useMutation<
    { message?: string },
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: subscriptionApi.deleteSubscription,
    onSuccess: (response) => {
      toast.success(response.message || "Data langganan berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["customer-subscription"] });
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menghapus data langganan");
    },
  });

  return {
    createOrUpdateMutation,
    deleteMutation,
    isPending: createOrUpdateMutation.isPending || deleteMutation.isPending,
  };
}
