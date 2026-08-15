import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth-utils";
import { customerApi } from "@/lib/api/customer";
import { wifiPackageApi, type WifiPackage } from "@/lib/api/wifi_package";
import { parseErrorMessage, type ApiErrorResponse } from "@/lib/api-error";
import { Wifi, CalendarDays, CheckCircle2 } from "lucide-react";
import { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CustomerSubscriptionsPage() {
  const [subscription, setSubscription] = useState<WifiPackage | null>(null);
  const [availablePackages, setAvailablePackages] = useState<WifiPackage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUser();
        if (!user) {
          setError("Silakan login kembali");
          return;
        }

        const [subData, packagesData] = await Promise.all([
          customerApi.getCustomerSubscription(user.id).catch(() => null),
          wifiPackageApi.getWifiPackages().catch(() => [])
        ]);

        setSubscription(subData);
        setAvailablePackages(packagesData);
      } catch (err) {
        setError(parseErrorMessage(err as AxiosError<ApiErrorResponse>));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold mb-2">Langganan Paket WiFi</h1>
        <p className="text-muted-foreground">
          Kelola layanan WiFi Anda dan jelajahi berbagai pilihan paket menarik yang kami sediakan.
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {subscription ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Paket Aktif Saat Ini</h2>
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
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center shadow-sm">
              <Wifi className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Anda Belum Berlangganan</h3>
              <p className="text-blue-700 dark:text-blue-300 mt-1 mb-4">
                Pilih salah satu paket di bawah ini dan hubungi admin kami untuk mulai berlangganan.
              </p>
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20tertarik%20untuk%20berlangganan%20paket%20WiFi." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Hubungi Admin (WhatsApp)
              </a>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold border-b pb-2">Pilihan Paket Tersedia</h2>
            {availablePackages.length === 0 ? (
               <p className="text-muted-foreground text-center py-8 border border-dashed rounded-xl">Belum ada paket yang tersedia saat ini.</p>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {availablePackages.map((pkg) => (
                   <Card key={pkg.id} className="relative overflow-hidden hover:border-primary/50 transition-colors border-t-4 border-t-primary">
                     <CardHeader className="pb-4">
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <CardDescription>Paket Internet Bulanan</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="text-3xl font-bold">
                          Rp {pkg.price.toLocaleString("id-ID")}
                          <span className="text-sm font-normal text-muted-foreground block mt-1">/ bulan</span>
                        </div>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> Akses Internet 24 Jam</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> Harga Flat Sepuasnya</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> Bebas FUP / Kuota Batasan</li>
                        </ul>
                     </CardContent>
                   </Card>
                 ))}
               </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
