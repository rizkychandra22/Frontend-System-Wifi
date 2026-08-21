import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Wifi, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ArrowUp, 
  Loader2, 
  Send,
  ExternalLink,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAuthenticated } from "@/lib/auth-utils";

// Import Assets
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

export function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "infrastruktur" | "tim" | "pelanggan">("all");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const isLoggedIn = isAuthenticated();

  // Refs for scrolling
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const packagesRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Monitor scroll to highlight active menu and show Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      // Show back to top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Check section ranges
      const sections = [
        { id: "home", ref: homeRef },
        { id: "about", ref: aboutRef },
        { id: "packages", ref: packagesRef },
        { id: "gallery", ref: galleryRef },
        { id: "contact", ref: contactRef },
      ];

      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (elementRef: React.RefObject<HTMLElement | null>, sectionId: string) => {
    setMobileMenuOpen(false);
    if (elementRef && elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  const handleSelectPackage = (packageName: string) => {
    setSelectedPackage(packageName);
    toast.info(`Anda memilih ${packageName}. Silakan isi form kontak di bawah.`);
    scrollToSection(contactRef, "contact");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      toast.error("Nama, Nomor HP, dan Pesan wajib diisi.");
      return;
    }

    setFormLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setFormLoading(false);
      toast.success("Pesan terkirim! Tim NetVerse akan segera menghubungi Anda.");
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setSelectedPackage("");
    }, 1500);
  };

  const wifiPackages = [
    {
      name: "10 Mbps - Hemat",
      price: "Rp 100.000",
      period: "/ bulan",
      speed: "10 Mbps",
      desc: "Cocok untuk kebutuhan internet harian ringan seperti browsing dan chatting.",
      features: ["Unlimited Quota (FUP Bebas)", "Ideal untuk 1 - 3 perangkat", "Kecepatan stabil", "Instalasi gratis"],
      popular: false,
    },
    {
      name: "15 Mbps - Populer",
      price: "Rp 150.000",
      period: "/ bulan",
      speed: "15 Mbps",
      desc: "Pilihan terbaik untuk rumah tangga dengan penggunaan multimedia standar.",
      features: [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 3 - 5 perangkat",
        "Lancar streaming video HD",
        "Dukungan teknis Prioritas",
        "Instalasi gratis"
      ],
      popular: true,
    },
    {
      name: "20 Mbps - Premium",
      price: "Rp 200.000",
      period: "/ bulan",
      speed: "20 Mbps",
      desc: "Koneksi kencang untuk kerja remote, streaming 4K, dan kelas online sekaligus.",
      features: [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 5 - 8 perangkat",
        "Sangat lancar video conference & gaming",
        "Dukungan teknis 24/7",
        "Instalasi gratis"
      ],
      popular: false,
    },
    {
      name: "50 Mbps - Ultra Speed",
      price: "Rp 350.000",
      period: "/ bulan",
      speed: "50 Mbps",
      desc: "Super cepat tanpa hambatan untuk rumah cerdas dan bisnis skala kecil.",
      features: [
        "Unlimited Quota (FUP Bebas)",
        "Ideal untuk 8+ perangkat",
        "Tanpa lag untuk gaming berat & download besar",
        "Prioritas gangguan utama",
        "Instalasi gratis"
      ],
      popular: false,
    },
  ];

  // Gallery items using local assets as mock data
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
    : galleryItems.filter(item => item.category === galleryFilter);

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth flex flex-col font-sans">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div 
            onClick={() => scrollToSection(homeRef, "home")} 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img src={logoImg} alt="NetVerse Logo" className="h-40 w-auto rounded-md object-contain" />
            {/* <span className="text-xl font-bold tracking-tight text-gradient-blue font-display">NetVerse Fiber</span> */}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => scrollToSection(homeRef, "home")}
              className={`hover:text-primary transition-colors cursor-pointer ${activeSection === "home" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => scrollToSection(aboutRef, "about")}
              className={`hover:text-primary transition-colors cursor-pointer ${activeSection === "about" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Tentang Kami
            </button>
            <button 
              onClick={() => scrollToSection(packagesRef, "packages")}
              className={`hover:text-primary transition-colors cursor-pointer ${activeSection === "packages" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Paket Layanan
            </button>
            <button 
              onClick={() => scrollToSection(galleryRef, "gallery")}
              className={`hover:text-primary transition-colors cursor-pointer ${activeSection === "gallery" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Galeri Aktivitas
            </button>
            <button 
              onClick={() => scrollToSection(contactRef, "contact")}
              className={`hover:text-primary transition-colors cursor-pointer ${activeSection === "contact" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              Kontak
            </button>
          </nav>

          {/* Portal Access Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              <Button size="sm" className="bg-gradient-blue text-primary-foreground font-semibold px-4 shadow-blue hover:scale-[1.02] transition-transform">
                {isLoggedIn ? "Dashboard" : "Portal Login"}
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 hover:bg-muted rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border flex flex-col p-6 space-y-5 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <button 
            onClick={() => scrollToSection(homeRef, "home")}
            className={`text-left text-base pb-2 border-b border-muted transition-colors ${activeSection === "home" ? "text-primary font-semibold" : "text-foreground"}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => scrollToSection(aboutRef, "about")}
            className={`text-left text-base pb-2 border-b border-muted transition-colors ${activeSection === "about" ? "text-primary font-semibold" : "text-foreground"}`}
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => scrollToSection(packagesRef, "packages")}
            className={`text-left text-base pb-2 border-b border-muted transition-colors ${activeSection === "packages" ? "text-primary font-semibold" : "text-foreground"}`}
          >
            Paket Layanan
          </button>
          <button 
            onClick={() => scrollToSection(galleryRef, "gallery")}
            className={`text-left text-base pb-2 border-b border-muted transition-colors ${activeSection === "gallery" ? "text-primary font-semibold" : "text-foreground"}`}
          >
            Galeri Aktivitas
          </button>
          <button 
            onClick={() => scrollToSection(contactRef, "contact")}
            className={`text-left text-base pb-2 border-b border-muted transition-colors ${activeSection === "contact" ? "text-primary font-semibold" : "text-foreground"}`}
          >
            Kontak
          </button>
          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="pt-4" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-gradient-blue text-primary-foreground font-semibold shadow-blue">
              {isLoggedIn ? "Menuju Dashboard" : "Masuk ke Portal"}
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Sections */}
      <main className="flex-1">
        {/* Section 1: Hero (Beranda) */}
        <section 
          id="home" 
          ref={homeRef} 
          className="relative pt-6 pb-24 md:pt-12 md:pb-32 overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent"
        >
          <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
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
                <Button 
                  onClick={() => scrollToSection(packagesRef, "packages")} 
                  size="lg" 
                  className="bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:scale-[1.02] transition-all"
                >
                  Pilih Paket WiFi
                </Button>
                <Button 
                  onClick={() => scrollToSection(contactRef, "contact")} 
                  size="lg" 
                  variant="outline" 
                  className="font-medium hover:bg-muted transition-colors"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>

            {/* Right Graphics */}
            <div className="relative flex justify-center items-center">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-deep/20 to-blue/20 blur-xl opacity-75"></div>
              <div className="relative border border-border bg-card/60 backdrop-blur rounded-2xl p-4 shadow-xl max-w-[500px] w-full overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                <img 
                  src={heroImg} 
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

        {/* Section 2: Tentang Kami */}
        <section 
          id="about" 
          ref={aboutRef} 
          className="py-20 bg-muted/30 border-y border-border"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Tentang NetVerse Fiber</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Kami adalah penyedia jasa layanan internet broadband terpercaya yang berkomitmen penuh dalam memberikan layanan terbaik bagi keluarga Indonesia. Dengan infrastruktur fiber optik modern, kami menjamin kestabilan dan kecepatan transfer data untuk produktivitas Anda.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                <div className="h-11 w-11 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
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
                <div className="h-11 w-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
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
                <div className="h-11 w-11 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
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
          </div>
        </section>

        {/* Section 3: Paket WiFi */}
        <section 
          id="packages" 
          ref={packagesRef} 
          className="py-20"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Pilih Paket Langganan</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Temukan variasi paket kecepatan yang paling sesuai dengan kebutuhan harian rumah Anda. Harga jujur, pas di kantong.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-stretch">
              {wifiPackages.map((pkg, idx) => (
                <div 
                  key={idx} 
                  className={`relative bg-card rounded-2xl border flex flex-col p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                    pkg.popular 
                      ? "border-primary ring-2 ring-primary/20 scale-102 lg:-translate-y-2" 
                      : "border-border/80"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-primary-foreground bg-primary shadow-sm uppercase">
                      Paling Populer
                    </span>
                  )}
                  
                  <div className="mb-5 space-y-2">
                    <h3 className="font-bold text-lg font-display text-foreground">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground min-h-[40px]">{pkg.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6 border-b pb-5">
                    <span className="text-3xl font-extrabold tracking-tight font-display text-gradient-blue">{pkg.price}</span>
                    <span className="text-xs text-muted-foreground font-medium">{pkg.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1 text-xs text-muted-foreground">
                    {pkg.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSelectPackage(pkg.name)}
                    variant={pkg.popular ? "default" : "outline"} 
                    className={`w-full font-semibold h-9 text-xs rounded-xl ${
                      pkg.popular ? "bg-gradient-blue text-primary-foreground shadow-blue" : "hover:bg-muted"
                    }`}
                  >
                    Pesan Paket
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Galeri */}
        <section 
          id="gallery" 
          ref={galleryRef} 
          className="py-20 bg-muted/30 border-y border-border"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Galeri Kegiatan & Sistem</h2>
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
                    {/* Glassmorphism Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/20 backdrop-blur rounded-full border border-white/20 text-white hover:scale-110 transition-transform">
                        <Info className="h-5 w-5" />
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
        </section>

        {/* Section 5: Kontak */}
        <section 
          id="contact" 
          ref={contactRef} 
          className="py-20"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight">Hubungi Layanan Kami</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Punya pertanyaan mengenai paket internet kami? Butuh bantuan pendaftaran? Kirim pesan langsung di bawah ini.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto items-start">
              {/* Left Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-xl font-display text-foreground">Informasi Kontak</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Hubungi kami kapan saja melalui saluran kontak di bawah ini. Kami akan dengan senang hati membantu Anda memasang wifi idaman.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Telepon & WhatsApp</h4>
                      <p className="text-xs text-muted-foreground">+62 821-2221-9332</p>
                      <p className="text-xs text-muted-foreground">+62 821-7813-1581</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Alamat Email</h4>
                      <p className="text-xs text-muted-foreground">support@netversefiber.net</p>
                      <p className="text-xs text-muted-foreground">info@netversefiber.net</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Alamat Kantor Operasional</h4>
                      <p className="text-xs text-muted-foreground">Gedung NetVerse IT Center, Lt. 3</p>
                      <p className="text-xs text-muted-foreground">Jl. Jenderal Sudirman No. 45, Jakarta Selatan</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground flex gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Jam Operasional Kantor</span>
                    <span>Senin - Sabtu: 08.00 - 17.00 WIB</span><br />
                    <span>Dukungan teknis darurat via WA aktif 24 jam.</span>
                  </div>
                </div>
              </div>

              {/* Right Contact Form */}
              <div className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Nama Lengkap</label>
                      <Input 
                        id="name"
                        type="text" 
                        placeholder="Masukkan nama Anda"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Nomor Telepon / WA</label>
                      <Input 
                        id="phone"
                        type="tel" 
                        placeholder="Contoh: 08123456789"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Alamat Email (Opsional)</label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="nama@email.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="package" className="text-xs font-semibold text-muted-foreground">Paket yang Diminati (Opsional)</label>
                    <select 
                      id="package"
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" className="text-muted-foreground bg-card">-- Pilih Paket Internet --</option>
                      <option value="10 Mbps - Hemat" className="bg-card">10 Mbps - Hemat (Rp 100.000 / bln)</option>
                      <option value="15 Mbps - Populer" className="bg-card">15 Mbps - Populer (Rp 150.000 / bln)</option>
                      <option value="20 Mbps - Premium" className="bg-card">20 Mbps - Premium (Rp 200.000 / bln)</option>
                      <option value="50 Mbps - Ultra Speed" className="bg-card">50 Mbps - Ultra Speed (Rp 350.000 / bln)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold text-muted-foreground">Pesan / Pertanyaan</label>
                    <Textarea 
                      id="message"
                      rows={4}
                      placeholder="Tulis pesan Anda di sini..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="text-xs focus:ring-primary focus:border-primary shadow-none resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={formLoading} 
                    className="w-full bg-gradient-blue text-primary-foreground font-semibold h-10 shadow-blue mt-2"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengirimkan Pesan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirim Pesan Layanan
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-12 grid md:grid-cols-4 gap-8">
          {/* Logo Brand Footer */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold font-display text-white">NetVerse Fiber</span>
            </div>
            <p className="text-white/60 text-xs max-w-sm leading-relaxed">
              Penyedia jasa internet broadband terpercaya berbasis fiber optik murni dengan misi menghubungkan setiap ruang hidup demi masa depan digital Indonesia yang cemerlang.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white font-display">Tautan Navigasi</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <button 
                  onClick={() => scrollToSection(homeRef, "home")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(aboutRef, "about")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(packagesRef, "packages")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Paket WiFi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(galleryRef, "gallery")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Galeri Foto
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection(contactRef, "contact")} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hubungi Kontak
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white font-display">Akses Admin & Karyawan</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Aplikasi ini terhubung dengan sistem absensi mandiri karyawan dan pemantauan billing pelanggan WiFi.
            </p>
            <div>
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button size="sm" variant="ghost" className="text-xs border border-white/20 text-white hover:bg-white/10 hover:text-white shadow-none">
                  Masuk Portal Staff
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-6">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/40">
            <p>&copy; {new Date().getFullYear()} PT NetVerse Fiber Indonesia. All rights reserved.</p>
            <p>Didesain dengan Cinta &bull; Sistem Absensi & WiFi Terpadu</p>
          </div>
        </div>
      </footer>

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
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
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

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-gradient-blue text-primary-foreground rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all z-40 border border-white/10"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
