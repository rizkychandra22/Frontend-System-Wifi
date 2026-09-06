import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { allowanceApi, type AllowanceInput } from "@/lib/api/allowance";
import { toast } from "sonner";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import type { AxiosError } from "axios";

export const ALLOWANCES_QUERY_KEY = ["allowances"] as const;

export function useAllowances(month?: string) {
  return useQuery({
    queryKey: [...ALLOWANCES_QUERY_KEY, month || "all"],
    queryFn: () => allowanceApi.getAllowances(month),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });
}

export function useAllowanceMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: AllowanceInput) => allowanceApi.createAllowance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOWANCES_QUERY_KEY });
      toast.success("Tunjangan / bonus berhasil diberikan");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal menambahkan tunjangan / bonus", {
        description: parseErrorMessage(error),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AllowanceInput }) =>
      allowanceApi.updateAllowance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOWANCES_QUERY_KEY });
      toast.success("Data tunjangan / bonus berhasil diperbarui");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal memperbarui tunjangan / bonus", {
        description: parseErrorMessage(error),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => allowanceApi.deleteAllowance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALLOWANCES_QUERY_KEY });
      toast.success("Data tunjangan / bonus berhasil dihapus");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal menghapus tunjangan / bonus", {
        description: parseErrorMessage(error),
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
