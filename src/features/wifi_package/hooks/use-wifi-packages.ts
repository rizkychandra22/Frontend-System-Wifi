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
      toast.success("WiFi Package successfully added");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Failed to add WiFi package");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: wifiPackageApi.deleteWifiPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("WiFi Package successfully deleted");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Failed to delete package");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; price?: number } }) =>
      wifiPackageApi.updateWifiPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wifi-packages"] });
      toast.success("WiFi Package successfully updated");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Failed to update package");
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
