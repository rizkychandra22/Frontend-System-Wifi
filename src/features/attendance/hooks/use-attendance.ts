import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  clockInApi,
  clockOutApi,
  requestIzinApi,
  getTodayAttendanceApi,
  getAttendanceHistoryApi,
  getAllAttendanceApi,
  type AttendanceRecord,
  type AttendanceActionResponse,
} from "@/lib/api/attendance";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { toast } from "sonner";

export function useTodayAttendance(options?: { enabled?: boolean }) {
  const query = useQuery<AttendanceRecord | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["attendance", "today"],
    queryFn: () => getTodayAttendanceApi(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) return false;
      return failureCount < 3;
    },
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    todayAttendance: query.data,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useAttendanceHistory(options?: { enabled?: boolean }) {
  const query = useQuery<AttendanceRecord[], AxiosError<ApiErrorResponse>>({
    queryKey: ["attendance", "history"],
    queryFn: () => getAttendanceHistoryApi(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) return false;
      return failureCount < 3;
    },
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    history: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useClockIn() {
  const queryClient = useQueryClient();

  return useMutation<
    AttendanceActionResponse,
    AxiosError<ApiErrorResponse>,
    { lat: number; lng: number }
  >({
    mutationFn: ({ lat, lng }) => clockInApi(lat, lng),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(data.message || "Berhasil absen masuk");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal absen masuk");
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation<
    AttendanceActionResponse,
    AxiosError<ApiErrorResponse>,
    { lat: number; lng: number }
  >({
    mutationFn: ({ lat, lng }) => clockOutApi(lat, lng),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(data.message || "Berhasil absen keluar");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal absen keluar");
    },
  });
}

export function useRequestIzin() {
  const queryClient = useQueryClient();

  return useMutation<
    AttendanceActionResponse,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: (notes) => requestIzinApi(notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success(data.message || "Berhasil mengajukan izin");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal mengajukan izin");
    },
  });
}

export function useAllAttendance(options?: { enabled?: boolean }) {
  const query = useQuery<AttendanceRecord[], AxiosError<ApiErrorResponse>>({
    queryKey: ["attendance", "all"],
    queryFn: () => getAllAttendanceApi(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) return false;
      return failureCount < 3;
    },
    enabled: options?.enabled ?? true,
  });

  return {
    ...query,
    attendances: query.data ?? [],
    errorMessage: parseErrorMessage(query.error),
  };
}
