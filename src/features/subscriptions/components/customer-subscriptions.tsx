import { Wifi, CalendarDays, CheckCircle2 } from "lucide-react";
import { type WifiPackage } from "@/lib/api/wifi_package";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminContact } from "@/features/user/hooks/use-users";
import { formatWifiPackages } from "@/components/wifi-package";
import { Button } from "@/components/ui/button";

interface CustomerSubscriptionsProps {
  subscription: WifiPackage | null;
  availablePackages: WifiPackage[];
}

export function CustomerSubscriptions({ subscription, availablePackages }: CustomerSubscriptionsProps) {
  const { data: adminContact } = useAdminContact();

  let waNumber = "6281234567890"; // Fallback
  if (adminContact?.phone) {
    waNumber = adminContact.phone;
    if (waNumber.startsWith('0')) {
      waNumber = '62' + waNumber.substring(1);
    }
  }

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Admin, saya tertarik untuk berlangganan/mengubah paket WiFi.")}`;

  const rawDisplayedPackages = subscription
    ? availablePackages.filter((pkg) => pkg.id !== subscription.id)
    : availablePackages;

  const displayedPackages = formatWifiPackages(rawDisplayedPackages);

  return (
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
                  Jika Anda ingin mengubah paket langganan, silakan <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">hubungi admin melalui WhatsApp</a>.
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
          <Button asChild size="sm">
            <a 
              href={waLink}
              target="_blank" 
              rel="noopener noreferrer" 
            >
              Hubungi Admin (WhatsApp)
            </a>
          </Button>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold border-b pb-2">Pilihan Paket Tersedia</h2>
        {displayedPackages.length === 0 ? (
           <p className="text-muted-foreground text-center py-8 border border-dashed rounded-xl">Belum ada paket lain yang tersedia saat ini.</p>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {displayedPackages.map((pkg) => (
               <Card key={pkg.id} className="relative overflow-hidden hover:border-primary/50 transition-colors border-t-4 border-t-primary">
                 <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.desc}</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="text-3xl font-bold">
                      {pkg.price}
                      <span className="text-lg font-normal text-muted-foreground ml-1">{pkg.period}</span>
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                 </CardContent>
               </Card>
             ))}
           </div>
        )}
      </div>
    </>
  );
}
