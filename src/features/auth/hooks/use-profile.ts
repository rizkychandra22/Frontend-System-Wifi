import { useMutation } from "@tanstack/react-query";
import { updateProfileApi, type UpdateProfilePayload } from "@/lib/api/auth";
import { type AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { getUserData, setToken, getToken } from "@/lib/auth-utils";

export function useUpdateProfile() {
  const mutation = useMutation<any, AxiosError<ApiErrorResponse>, UpdateProfilePayload>({
    mutationFn: (data) => updateProfileApi(data),
    onSuccess: (data) => {
      // Update local storage user data
      const token = getToken();
      if (token && data.data) {
        // We preserve existing properties and override with new data
        const currentUser = getUserData() || {};
        const updatedUser = { ...currentUser, ...data.data };
        setToken(token, updatedUser);
        
        // Dispatch custom event so UI can update without reload
        window.dispatchEvent(new Event("profileUpdated"));
      }
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: parseErrorMessage(mutation.error),
  };
}
