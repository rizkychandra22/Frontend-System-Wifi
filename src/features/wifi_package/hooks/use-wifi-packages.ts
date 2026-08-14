import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wifiPackageApi } from "@/lib/api/wifi_package";
import { toast } from "sonner";

export function useWifiPackages() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["wifi-packages"],
    queryFn: wifiPackageApi.getWifiPackages,
  });

  const createMutation = useMutation({
    mutationFn: wifiPackageApi.createWifiPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("Paket WiFi berhasil ditambahkan");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal menambahkan paket wifi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: wifiPackageApi.deleteWifiPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("Paket WiFi berhasil dihapus");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Gagal menghapus paket");
    },
  });

  return {
    query,
    createMutation,
    deleteMutation,
  };
}
