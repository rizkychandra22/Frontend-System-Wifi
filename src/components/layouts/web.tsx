import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth-utils";
import logoImg from "@/assets/logo.png";

export function WebLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { pathname } = useLocation();
  const isLoggedIn = isAuthenticated();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Beranda" },
    { to: "/about", label: "Tentang Kami" },
    { to: "/package", label: "Paket Layanan" },
    { to: "/activity", label: "Galeri Aktivitas" },
    { to: "/contact", label: "Kontak" },
  ];

  return (
    <div className="web-layout min-h-screen bg-background text-foreground scroll-smooth flex flex-col font-sans">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={logoImg} alt="NetVerse Logo" className="h-50 w-auto object-contain -ml-6 md:-ml-8 mt-2" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `transition-colors hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Portal Access Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              <Button size="sm" className="bg-gradient-blue text-primary-foreground font-semibold px-4 shadow-blue hover:opacity-90 transition-colors">
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
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border flex flex-col p-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-left text-base pb-2 border-b border-muted transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="pt-2" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:opacity-90 transition-opacity">
              {isLoggedIn ? "Menuju Dashboard" : "Masuk ke Portal"}
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Content from Route Outlet */}
      <main className="flex-1">
        <Outlet />
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
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
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
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/50">
            <p>&copy; 2026 PT NetVerse Fiber Indonesia. All rights reserved.</p>
            <p>Dibuat oleh <i><a href="https://rizkychandra.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Rizky Chandra</a></i> &bull; Sistem Informasi & Manajemen Bisnis Wifi.</p>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-6 right-6 p-3 bg-gradient-blue text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-colors z-40 border border-white/10 cursor-pointer"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}
    </div>
  );
}
