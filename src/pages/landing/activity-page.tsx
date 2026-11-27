import { useState } from "react";
import { Search, X } from "lucide-react";
import logoImg from "@/assets/logo.png";
import heroImg from "@/assets/hero.png";
import qrisLogo from "@/assets/logo-qris.png";
import qrisFull from "@/assets/qris.jpeg";

interface GalleryItem {
  id: number;
  title: string;
  category: "infrastruktur" | "tim" | "pelanggan";
  image: string;
  description: string;
}

export default function ActivityPage() {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "infrastruktur" | "tim" | "pelanggan">("all");

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: "Pusat Distribusi Fiber Optik",
      category: "infrastruktur",
      image: heroImg,
      description: "Infrastruktur distribusi kabel fiber optik NetVerse yang dirancang untuk menyalurkan internet berkecepatan tinggi ke setiap perumahan.",
    },
    {
      id: 2,
      title: "Sentral Server & Pemancar WiFi",
      category: "infrastruktur",
      image: logoImg,
      description: "Perangkat server utama dan sistem monitoring wifi yang menjamin kestabilan koneksi uptime hingga 99.9%.",
    },
    {
      id: 3,
      title: "Tim Teknis & Lapangan NetVerse",
      category: "tim",
      image: heroImg,
      description: "Karyawan dan tim teknisi ahli NetVerse saat melakukan pemasangan kabel dan konfigurasi router di lapangan.",
    },
    {
      id: 4,
      title: "Karyawan & Staff Kantor",
      category: "tim",
      image: logoImg,
      description: "Layanan administrasi, verifikasi pembayaran, serta tim customer support NetVerse yang siap melayani pelanggan.",
    },
    {
      id: 5,
      title: "Antarmuka Billing Customer",
      category: "pelanggan",
      image: qrisFull,
      description: "Antarmuka dashboard khusus pelanggan untuk memantau status langganan wifi aktif dan riwayat tagihan bulanan.",
    },
    {
      id: 6,
      title: "Metode Bayar Mandiri QRIS",
      category: "pelanggan",
      image: qrisLogo,
      description: "Kemudahan pembayaran wifi tagihan mandiri bagi pelanggan menggunakan kode QRIS terverifikasi otomatis.",
    },
  ];

  const filteredGallery = galleryFilter === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === galleryFilter);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Dokumentasi & Galeri
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Galeri Kegiatan & Sistem
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Dokumentasi operasional pemasangan jaringan internet NetVerse beserta tampilan integrasi sistem pembayaran digital resmi kami.
          </p>
        </div>

        {/* Gallery Category Filter Buttons */}
        <div className="flex justify-center items-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setGalleryFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              galleryFilter === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setGalleryFilter("infrastruktur")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              galleryFilter === "infrastruktur"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            Infrastruktur
          </button>
          <button
            onClick={() => setGalleryFilter("tim")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              galleryFilter === "tim"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            Tim Karyawan
          </button>
          <button
            onClick={() => setGalleryFilter("pelanggan")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              galleryFilter === "pelanggan"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            }`}
          >
            Customer / Pelanggan
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-300"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
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
              </div>
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {item.category === "infrastruktur" ? "Infrastruktur" : item.category === "tim" ? "Tim Karyawan" : "Customer / Pelanggan"}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal for Gallery */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative bg-card border rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10 cursor-pointer"
              aria-label="Tutup gambar"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                {lightboxItem.category === "infrastruktur" ? "Infrastruktur" : lightboxItem.category === "tim" ? "Tim Karyawan" : "Customer / Pelanggan"}
              </span>
              <h3 className="font-bold text-lg font-display text-foreground">{lightboxItem.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{lightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
