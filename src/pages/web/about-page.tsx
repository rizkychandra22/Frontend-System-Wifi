import { Link } from "react-router-dom";
import { Zap, Wifi, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Profil Perusahaan
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Tentang NetVerse Fiber
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Kami adalah penyedia jasa layanan internet broadband terpercaya yang berkomitmen penuh dalam memberikan layanan terbaik bagi keluarga Indonesia. Dengan infrastruktur fiber optik modern, kami menjamin kestabilan dan kecepatan transfer data untuk produktivitas Anda.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {/* Card 1 */}
          <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="h-11 w-11 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg font-display">100% Fiber Optic</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Koneksi internet stabil langsung dari kabel serat optik ke router rumah Anda tanpa gangguan cuaca.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="h-11 w-11 rounded-lg bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 flex items-center justify-center shrink-0">
              <Wifi className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg font-display">Unlimited Tanpa Kuota</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Nikmati berselancar sepuasnya tanpa khawatir kehabisan kuota atau penurunan kecepatan yang drastis.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="h-11 w-11 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg font-display">Layanan Teknis 24/7</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Tim dukungan teknis profesional kami siap melayani dan mengatasi kendala Anda kapan pun dibutuhkan.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            <div className="h-11 w-11 rounded-lg bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg font-display">Koneksi Aman</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Dilengkapi keamanan jaringan mutakhir untuk menjaga lalu lintas data pribadi Anda tetap privat dan aman.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Banner */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-muted/40 border border-border p-8 md:p-12 text-center space-y-6">
          <h3 className="text-2xl font-bold font-display text-foreground">
            Menghubungkan Masa Depan Digital Anda
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
            Dengan cakupan wilayah perumahan yang terus meluas, NetVerse Fiber hadir memberikan pengalaman berinternet yang bebas hambatan untuk hiburan, pendidikan, maupun bisnis online Anda.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/package">
              <Button className="bg-gradient-blue text-primary-foreground font-semibold shadow-blue">
                Eksplorasi Paket Layanan
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Hubungi Layanan Kami</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
