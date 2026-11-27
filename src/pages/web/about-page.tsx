import { Link } from "react-router-dom";
import { Zap, Wifi, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const corePillars = [
  {
    title: "100% Fiber Optic",
    description:
      "Koneksi internet stabil langsung dari kabel serat optik ke router rumah Anda tanpa gangguan cuaca.",
    icon: Zap,
    iconBgClass: "bg-blue/10 text-primary",
    hoverBorderClass: "hover:border-primary/40",
  },
  {
    title: "Kuota Unlimited",
    description:
      "Nikmati berselancar sepuasnya tanpa khawatir kehabisan kuota atau penurunan kecepatan yang drastis.",
    icon: Wifi,
    iconBgClass: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    hoverBorderClass: "hover:border-green-500/40",
  },
  {
    title: "Layanan Teknis 24/7",
    description:
      "Tim dukungan teknis profesional kami siap melayani dan mengatasi kendala Anda kapan pun dibutuhkan.",
    icon: Clock,
    iconBgClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    hoverBorderClass: "hover:border-amber-500/40",
  },
  {
    title: "Koneksi Aman",
    description:
      "Dilengkapi keamanan jaringan mutakhir untuk menjaga lalu lintas data pribadi Anda tetap privat dan aman.",
    icon: ShieldCheck,
    iconBgClass: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    hoverBorderClass: "hover:border-red-500/40",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Main Viewport Section: Header + 4 Core Pillars */}
      <section className="pt-10 pb-12 md:pt-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 w-full">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
              Tentang NetVerse Fiber
            </h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Kami adalah penyedia jasa layanan internet broadband terpercaya yang berkomitmen penuh dalam memberikan layanan terbaik bagi keluarga Indonesia. Dengan infrastruktur fiber optik modern, kami menjamin kestabilan dan kecepatan transfer data untuk produktivitas Anda.
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className={`group bg-card border border-border/80 rounded-xl p-6 shadow-sm space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${pillar.hoverBorderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-lg ${pillar.iconBgClass} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg font-display leading-snug">{pillar.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission Banner */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="max-w-4xl mx-auto rounded-2xl bg-muted/40 border border-border p-8 md:p-12 text-center space-y-6">
            <h3 className="text-2xl font-bold font-display text-foreground">
              Menghubungkan Masa Depan Digital Anda
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
              Dengan cakupan wilayah perumahan yang terus meluas, NetVerse Fiber hadir memberikan pengalaman berinternet yang bebas hambatan untuk hiburan, pendidikan, maupun bisnis online Anda.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link to="/subscription">
                <Button className="group bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:opacity-90 transition-opacity">
                  Eksplorasi Paket Layanan
                  <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Hubungi Layanan Kami</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
