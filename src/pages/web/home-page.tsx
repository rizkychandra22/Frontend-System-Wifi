import { Link } from "react-router-dom";
import { Zap, Wifi, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-6 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-6 md:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Zap className="h-3 w-3" />
              100% Serat Optik Murni
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-foreground leading-[1.1]">
              Koneksi Internet <span className="text-gradient-blue">Cepat, Stabil & Tanpa Batas</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              NetVerse Fiber menghadirkan layanan internet rumah super cepat menggunakan kabel serat optik terbaik. Aktivitas streaming, kerja jarak jauh, hingga gaming lancar bebas hambatan dengan harga terjangkau.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/paket-layanan">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:scale-[1.02] transition-all">
                  Pilih Paket WiFi
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/kontak">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium hover:bg-muted transition-colors">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Graphics */}
          <div className="relative flex justify-center items-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-deep/20 to-blue/20 blur-xl opacity-75"></div>
            <div className="relative border border-border bg-card/60 backdrop-blur rounded-2xl p-4 shadow-xl max-w-[500px] w-full overflow-hidden hover:scale-[1.01] transition-transform duration-300">
              <img
                src={logoImg}
                alt="Infrastruktur Internet NetVerse"
                className="w-full h-auto rounded-lg object-cover shadow-sm bg-muted animate-pulse-subtle"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Internet Rumah Andalan</h4>
                    <p className="text-xs text-white/80">Kestabilan koneksi up to 99.9% uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base font-display">Teknologi Fiber Optic</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Jaringan transmisi kabel optik murni dengan redaman minim untuk koneksi tanpa lag.
              </p>
              <Link to="/about" className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-1">
                Pelajari Tentang Kami <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base font-display">Paket Fleksibel & Terjangkau</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pilihan kecepatan mulai 15 Mbps hingga 50+ Mbps sesuai kebutuhan keluarga Anda.
              </p>
              <Link to="/package" className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-1">
                Lihat Daftar Paket <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base font-display">Respon Layanan Cepat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tim teknisi lapangan dan customer care kami siap membantu pemasangan dan kendala.
              </p>
              <Link to="/contact" className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-1">
                Hubungi Bantuan <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
