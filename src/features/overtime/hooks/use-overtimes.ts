import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { overtimeApi, type CreateOvertimeData, type UpdateOvertimeData } from "@/lib/api/overtime";
import { useToast } from "@/hooks/use-toast";
import { parseErrorMessage } from "@/lib/api-error";

export const OVERTIMES_QUERY_KEY = ["overtimes"] as const;

export function useOvertimes() {
  return useQuery({
    queryKey: OVERTIMES_QUERY_KEY,
    queryFn: overtimeApi.getAll,
  });
}

export function useOvertimeMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: overtimeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast({
        title: "Berhasil",
        description: "Form lembur berhasil dibuat",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal membuat form lembur",
        description: parseErrorMessage(error),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOvertimeData }) => overtimeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast({
        title: "Berhasil",
        description: "Data lembur berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal memperbarui form lembur",
        description: parseErrorMessage(error),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: overtimeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERTIMES_QUERY_KEY });
      toast({
        title: "Berhasil",
        description: "Data lembur berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal menghapus form lembur",
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
