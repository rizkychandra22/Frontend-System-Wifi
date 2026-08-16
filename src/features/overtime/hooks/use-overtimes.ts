import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { overtimeApi, type UpdateOvertimeData } from "@/lib/api/overtime";
import { toast } from "sonner";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import type { AxiosError } from "axios";

export const OVERTIMES_QUERY_KEY = ["overtimes"] as const;

export function useOvertimes() {
  return useQuery({
    queryKey: OVERTIMES_QUERY_KEY,
    queryFn: overtimeApi.getAll,
  });
}

export function useOvertimeMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: overtimeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast.success("Form lembur berhasil dibuat");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal membuat form lembur", {
        description: parseErrorMessage(error),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOvertimeData }) => overtimeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast.success("Data lembur berhasil diperbarui");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal memperbarui form lembur", {
        description: parseErrorMessage(error),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: overtimeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast.success("Data lembur berhasil dihapus");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error("Gagal menghapus form lembur", {
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
