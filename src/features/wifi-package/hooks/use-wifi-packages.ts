import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wifiPackageApi, type WifiPackage } from "@/lib/api/wifi_package";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";

export function useWifiPackages() {
  const queryClient = useQueryClient();

  const query = useQuery<WifiPackage[], AxiosError<ApiErrorResponse>>({
    queryKey: ["wifi-packages"],
    queryFn: wifiPackageApi.getWifiPackages,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const createMutation = useMutation<
    WifiPackage,
    AxiosError<ApiErrorResponse>,
    { name: string; price: number }
  >({
    mutationFn: wifiPackageApi.createWifiPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("Paket WiFi berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menambahkan paket WiFi");
    },
  });

  const deleteMutation = useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    number
  >({
    mutationFn: wifiPackageApi.deleteWifiPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("Paket WiFi berhasil dihapus");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal menghapus paket");
    },
  });

  const updateMutation = useMutation<
    WifiPackage,
    AxiosError<ApiErrorResponse>,
    { id: number; data: { name?: string; price?: number } }
  >({
    mutationFn: ({ id, data }) => wifiPackageApi.updateWifiPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("Paket WiFi berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error) || "Gagal memperbarui paket");
    },
  });

  return {
    query,
    errorMessage: parseErrorMessage(query.error),
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
