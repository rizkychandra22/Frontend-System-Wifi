import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export function parseErrorMessage(error: AxiosError<ApiErrorResponse> | null): string {
  if (!error) return "";
  if (error.response) {
    return (
      error.response.data?.message ||
      error.response.data?.error ||
      "Terjadi kesalahan saat menghubungi server."
    );
  }
  if (error.request) {
    return "Gagal terhubung ke server. Periksa kembali koneksi internet Anda.";
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}
