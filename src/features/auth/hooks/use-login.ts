import { useMutation } from "@tanstack/react-query";
import { loginApi, type LoginResponse } from "@/lib/api/auth";
import { type AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { setToken } from "@/lib/auth-utils";

export function useLogin() {
  const mutation = useMutation<LoginResponse, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (phone: string) => loginApi(phone),
    onSuccess: (data) => {
      setToken(data.token, data.user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    errorMessage: parseErrorMessage(mutation.error),
    isSuccess: mutation.isSuccess,
  };
}
