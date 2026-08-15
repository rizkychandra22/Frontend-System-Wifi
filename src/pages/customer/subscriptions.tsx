import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { customerApi } from "@/lib/api/customer";
import { type WifiPackage } from "@/lib/api/wifi_package";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { Wifi, CalendarDays, CheckCircle2 } from "lucide-react";
import { AxiosError } from "axios";

export function CustomerSubscriptionsPage() {
  const [subscription, setSubscription] = useState<WifiPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const user = getUser();
        if (!user) {
          setError("Silakan login kembali");
          setIsLoading(false);
          return;
        }

        const data = await customerApi.getCustomerSubscription(user.id);
        setSubscription(data);
      } catch (err) {
        setError(parseErrorMessage(err as AxiosError<ApiErrorResponse>));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold mb-2">Langganan Aktif</h1>
        <p className="text-muted-foreground">
          Detail paket layanan WiFi yang saat ini Anda gunakan.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : subscription ? (
        <div className="bg-card rounded-xl border p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Wifi className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Wifi className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{subscription.name}</h3>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Harga Paket</p>
                <p className="text-xl font-semibold">
                  Rp {subscription.price.toLocaleString("id-ID")} <span className="text-sm font-normal text-muted-foreground">/ bulan</span>
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Jadwal Penagihan</p>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">Setiap awal bulan</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 mt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Jika Anda ingin mengubah paket langganan, silakan hubungi admin kami melalui WhatsApp.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 border border-dashed rounded-xl p-8 text-center">
          <Wifi className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-medium text-lg">Belum Ada Langganan</h3>
          <p className="text-muted-foreground mt-1">
            Anda belum memiliki paket WiFi aktif saat ini.
          </p>
        </div>
      )}
    </div>
  );
}
