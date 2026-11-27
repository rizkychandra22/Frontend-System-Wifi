import { useState } from "react";
import { Search } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logoImg from "@/assets/logo.png";
import heroImg from "@/assets/hero.png";
import qrisLogo from "@/assets/logo-qris.png";
import qrisFull from "@/assets/qris.jpeg";

type GalleryCategory = "infrastruktur" | "tim" | "pelanggan";
type GalleryFilter = "all" | GalleryCategory;

interface GalleryItem {
  id: number;
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
}

const categoryLabels: Record<GalleryCategory, string> = {
  infrastruktur: "Infrastruktur",
  tim: "Tim Karyawan",
  pelanggan: "Customer / Pelanggan",
};

const galleryFilters: { value: GalleryFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "infrastruktur", label: "Infrastruktur" },
  { value: "tim", label: "Tim Karyawan" },
  { value: "pelanggan", label: "Customer / Pelanggan" },
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Pusat Distribusi Fiber Optik",
    category: "infrastruktur",
    image: heroImg,
    description:
      "Infrastruktur distribusi kabel fiber optik NetVerse yang dirancang untuk menyalurkan internet berkecepatan tinggi ke setiap perumahan.",
  },
  {
    id: 2,
    title: "Sentral Server & Pemancar WiFi",
    category: "infrastruktur",
    image: logoImg,
    description:
      "Perangkat server utama dan sistem monitoring wifi yang menjamin kestabilan koneksi uptime hingga 99.9%.",
  },
  {
    id: 3,
    title: "Tim Teknis & Lapangan NetVerse",
    category: "tim",
    image: heroImg,
    description:
      "Karyawan dan tim teknisi ahli NetVerse saat melakukan pemasangan kabel dan konfigurasi router di lapangan.",
  },
  {
    id: 4,
    title: "Karyawan & Staff Kantor",
    category: "tim",
    image: logoImg,
    description:
      "Layanan administrasi, verifikasi pembayaran, serta tim customer support NetVerse yang siap melayani pelanggan.",
  },
  {
    id: 5,
    title: "Antarmuka Billing Customer",
    category: "pelanggan",
    image: qrisFull,
    description:
      "Antarmuka dashboard khusus pelanggan untuk memantau status langganan wifi aktif dan riwayat tagihan bulanan.",
  },
  {
    id: 6,
    title: "Metode Bayar Mandiri QRIS",
    category: "pelanggan",
    image: qrisLogo,
    description:
      "Kemudahan pembayaran wifi tagihan mandiri bagi pelanggan menggunakan kode QRIS terverifikasi otomatis.",
  },
];

export default function ActivityPage() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>("all");

  const filteredGallery =
    galleryFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-10 pb-12 md:pt-12 md:pb-16">
      <div className="container mx-auto px-4 md:px-6 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Galeri Kegiatan & Sistem
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Dokumentasi operasional pemasangan jaringan internet NetVerse beserta tampilan integrasi sistem pembayaran digital resmi kami.
          </p>
        </div>

        {/* Gallery Category Filter Buttons */}
        <div className="flex justify-center items-center gap-2 mb-8 md:mb-10 flex-wrap">
          {galleryFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={galleryFilter === filter.value ? "default" : "outline"}
              onClick={() => setGalleryFilter(filter.value)}
              className={`px-4 rounded-full text-xs font-semibold shadow-none ${
                galleryFilter === filter.value
                  ? "shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredGallery.map((item) => (
            <Card
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative border-border/80 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-300"
            >
              <AspectRatio ratio={16 / 9} className="w-full overflow-hidden bg-muted relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-full border border-white/20 text-white hover:scale-110 transition-transform">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
              </AspectRatio>
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 hover:bg-primary/10 px-2 py-0.5 rounded"
                  >
                    {categoryLabels[item.category]}
                  </Badge>
                </div>
                <CardTitle className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog for Gallery */}
      <Dialog
        open={Boolean(lightboxItem)}
        onOpenChange={(open) => {
          if (!open) setLightboxItem(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-card gap-0 [&>button]:bg-black/60 [&>button]:text-white [&>button]:p-2 [&>button]:rounded-full [&>button]:opacity-100 [&>button:hover]:bg-black/80">
          {lightboxItem && (
            <>
              <AspectRatio ratio={16 / 9} className="w-full bg-black">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
              <DialogHeader className="p-6 space-y-2 text-left">
                <div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 hover:bg-primary/10 px-2 py-0.5 rounded"
                  >
                    {categoryLabels[lightboxItem.category]}
                  </Badge>
                </div>
                <DialogTitle className="font-bold text-lg font-display text-foreground">
                  {lightboxItem.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  {lightboxItem.description}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
