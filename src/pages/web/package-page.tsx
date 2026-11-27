import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWifiPackages } from "@/features/wifi-package/hooks/use-wifi-packages";
import { formatWifiPackages } from "@/components/wifi-package";

export default function PackagePage() {
  const navigate = useNavigate();
  const { query: wifiPackagesQuery } = useWifiPackages();
  const dbPackages = wifiPackagesQuery.data ?? [];
  const formattedPackages = formatWifiPackages(dbPackages);
  const displayPackages = formattedPackages.length > 0 ? formattedPackages : [];

  const getPackageStyles = (speedStr: string) => {
    let speedMbps = 15;
    const speedMatch = speedStr.match(/(\d+)/);
    if (speedMatch) {
      speedMbps = parseInt(speedMatch[1], 10);
    }

    if (speedMbps <= 15) {
      return {
        borderClass: "border-emerald-500 ring-2 ring-emerald-500/20",
        badgeBg: "bg-emerald-500",
        textClass: "text-emerald-500",
        hoverShadow: "hover:shadow-emerald-500/10",
        buttonClass: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
        buttonOutlineClass: "hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50/50",
      };
    } else if (speedMbps <= 20) {
      return {
        borderClass: "border-blue-500 ring-2 ring-blue-500/20",
        badgeBg: "bg-blue-500",
        textClass: "text-blue-500",
        hoverShadow: "hover:shadow-blue-500/10",
        buttonClass: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20",
        buttonOutlineClass: "hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50",
      };
    } else if (speedMbps <= 35) {
      return {
        borderClass: "border-purple-500 ring-2 ring-purple-500/20",
        badgeBg: "bg-purple-500",
        textClass: "text-purple-500",
        hoverShadow: "hover:shadow-purple-500/10",
        buttonClass: "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20",
        buttonOutlineClass: "hover:text-purple-500 hover:border-purple-500 hover:bg-purple-50/50",
      };
    } else {
      return {
        borderClass: "border-rose-500 ring-2 ring-rose-500/20",
        badgeBg: "bg-rose-500",
        textClass: "text-rose-500",
        hoverShadow: "hover:shadow-rose-500/10",
        buttonClass: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20",
        buttonOutlineClass: "hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50/50",
      };
    }
  };

  const handleSelectPackage = (packageName: string) => {
    toast.info(`Anda memilih ${packageName}. Mengalihkan ke formulir pemesanan.`);
    navigate(`/kontak?paket=${encodeURIComponent(packageName)}`);
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Daftar Paket Internet
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Pilih Paket Langganan
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Temukan variasi paket kecepatan yang paling sesuai dengan kebutuhan harian rumah Anda. Harga jujur, pas di kantong.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
          {displayPackages.map((pkg, idx) => {
            const styles = getPackageStyles(pkg.speed || "15 Mbps");
            return (
              <div
                key={idx}
                className={`relative bg-card rounded-2xl border flex flex-col p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] lg:hover:-translate-y-1.5 ${styles.borderClass} ${styles.hoverShadow} ${
                  pkg.popular ? "scale-[1.01] lg:-translate-y-1" : ""
                }`}
              >
                {pkg.popular && (
                  <span className={`absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-white shadow-sm uppercase ${styles.badgeBg}`}>
                    Paling Populer
                  </span>
                )}

                <div className="mb-5 space-y-2">
                  <h3 className="font-bold text-lg font-display text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground min-h-[40px]">{pkg.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6 border-b pb-5">
                  <span className={`text-3xl font-extrabold tracking-tight font-display ${styles.textClass}`}>
                    {pkg.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{pkg.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1 text-xs text-muted-foreground">
                  {pkg.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5">
                      <ShieldCheck className={`h-4 w-4 shrink-0 mt-0.5 ${styles.textClass}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPackage(pkg.name)}
                  variant={pkg.popular ? "default" : "outline"}
                  className={`w-full font-semibold h-9 text-xs rounded-xl transition-colors cursor-pointer ${
                    pkg.popular
                      ? styles.buttonClass
                      : styles.buttonOutlineClass
                  }`}
                >
                  Pesan Paket
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
