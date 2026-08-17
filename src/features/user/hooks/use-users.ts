import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, type User } from "@/lib/api/users";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { toast } from "sonner";

export function useUsers(all?: boolean) {
  const query = useQuery<User[], AxiosError<ApiErrorResponse>>({
    queryKey: ["users", all],
    queryFn: () => usersApi.getUsers(all),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    ...query,
    users: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useAdminContact() {
  return useQuery({
    queryKey: ["admin-contact"],
    queryFn: () => usersApi.getAdminContact(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    AxiosError<ApiErrorResponse>,
    { name: string; phone: string; role: string; address?: string }
  >({
    mutationFn: (data) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menambahkan pengguna");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    AxiosError<ApiErrorResponse>,
    {
      id: string | number;
      data: { name?: string; phone?: string; role?: string; address?: string };
    }
  >({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Perubahan berhasil disimpan");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menyimpan perubahan");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, string | number>({
    mutationFn: (id) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil dihapus");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menghapus pengguna");
    },
  });
}

export function useResetUserIP() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, string | number>({
    mutationFn: (id) => usersApi.resetUserIP(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("IP Device berhasil di-reset");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal mereset IP");
    },
  });
}
