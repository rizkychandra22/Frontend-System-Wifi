import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi, type Customer } from "@/lib/api/customer";
import { toast } from "sonner";
import { type AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";

export function useCustomers() {
  const query = useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Customer,
    AxiosError<ApiErrorResponse>,
    { name: string; phone: string; address?: string }
  >({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Pelanggan berhasil ditambahkan");
    },
    onError: (error) => {
      const errorMessage = parseErrorMessage(error);
      toast.error(errorMessage || "Gagal menambahkan pelanggan");
    },
  });

  return {
    createCustomer: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Customer,
    AxiosError<ApiErrorResponse>,
    { id: number | string; data: { name: string; phone: string; address?: string } }
  >({
    mutationFn: customerApi.updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Pelanggan berhasil diperbarui");
    },
    onError: (error) => {
      const errorMessage = parseErrorMessage(error);
      toast.error(errorMessage || "Gagal memperbarui pelanggan");
    },
  });

  return {
    updateCustomer: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
