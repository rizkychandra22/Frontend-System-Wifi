import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  clockInApi,
  clockOutApi,
  requestIzinApi,
  getTodayAttendanceApi,
  getAttendanceHistoryApi,
  type AttendanceRecord,
} from "@/lib/api/attendance";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { toast } from "sonner";

export function useTodayAttendance() {
  const query = useQuery<AttendanceRecord | null, AxiosError<ApiErrorResponse>>({
    queryKey: ["attendance", "today"],
    queryFn: () => getTodayAttendanceApi(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  return {
    ...query,
    todayAttendance: query.data,
    errorMessage: parseErrorMessage(query.error),
  };
}

export function useAttendanceHistory() {
  const query = useQuery<AttendanceRecord[], AxiosError<ApiErrorResponse>>({
    queryKey: ["attendance", "history"],
    queryFn: () => getAttendanceHistoryApi(),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
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
    any,
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
    retry: 3,
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
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
    retry: 3,
  });
}

export function useRequestIzin() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
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
    retry: 3,
  });
}
