import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAuthenticated } from "@/lib/auth-utils";
import {
  useTranslation,
  changeLanguage,
  LANGUAGE_LABELS,
  type SupportedLanguage,
} from "@/i18n";
import logoImg from "@/assets/logo.png";
import flagId from "@/assets/flag-id.png";
import flagEn from "@/assets/flag-en.png";

const flagMap: Record<SupportedLanguage, string> = {
  id: flagId,
  en: flagEn,
};

const languages: SupportedLanguage[] = ["id", "en"];

export function WebLayout() {
  const { t, i18n } = useTranslation("Layouts");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { pathname } = useLocation();
  const isLoggedIn = isAuthenticated();

  const currentLang = (i18n.language?.split("-")[0] === "en" ? "en" : "id") as SupportedLanguage;

  const handleLanguageChange = (lang: SupportedLanguage) => {
    changeLanguage(lang);
  };

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
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/subscription", label: t("nav.subscription") },
    { to: "/activity", label: t("nav.activity") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <div className="web-layout min-h-screen bg-background text-foreground scroll-smooth flex flex-col font-sans">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 h-16 overflow-hidden hover:opacity-90 transition-opacity"
          >
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

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium gap-2 border-border/70 hover:bg-muted/80 shadow-none cursor-pointer rounded-3xl"
                  aria-label={t("nav.switchLanguage")}
                >
                  <img
                    src={flagMap[currentLang]}
                    alt={LANGUAGE_LABELS[currentLang]}
                    className="h-3.5 w-5 rounded-xs object-cover"
                  />
                  <span className="font-semibold uppercase">{currentLang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`text-xs cursor-pointer flex items-center justify-between ${
                      currentLang === lang ? "font-semibold text-primary" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={flagMap[lang]}
                        alt={LANGUAGE_LABELS[lang]}
                        className="h-3.5 w-5 rounded-xs object-cover"
                      />
                      <span>{LANGUAGE_LABELS[lang]}</span>
                    </span>
                    {currentLang === lang && <span className="text-[10px] text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-1.5 hover:bg-muted rounded-lg cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("nav.toggleMenu")}
          >
            {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>

        {/* Mobile Navigation Floating Card */}
        {mobileMenuOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] md:hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
            <Card className="border border-border bg-card shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col p-3">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-left text-sm py-1.5 px-3 rounded-md transition-colors ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-2.5 flex gap-2.5 pt-2.5 border-t border-border/60">
                  {languages.map((lang) => (
                    <Button
                      key={lang}
                      variant={currentLang === lang ? "default" : "outline"}
                      onClick={() => {
                        handleLanguageChange(lang);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 h-9 flex items-center justify-center gap-2 rounded-md text-xs font-semibold cursor-pointer shadow-none ${
                        currentLang === lang
                          ? "bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <img
                        src={flagMap[lang]}
                        alt={LANGUAGE_LABELS[lang]}
                        className="h-3.5 w-5 rounded-xs object-cover"
                      />
                      <span>{LANGUAGE_LABELS[lang]}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </header>

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
              <span className="text-xl font-bold font-display text-white">{t("footer.brandName")}</span>
            </div>
            <p className="text-white/60 text-xs max-w-sm leading-relaxed">
              {t("footer.brandDesc")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white font-display">{t("footer.quickLinks")}</h4>
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
            <h4 className="font-bold text-sm text-white font-display">{t("footer.adminAccess")}</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              {t("footer.adminDesc")}
            </p>
            <div>
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button size="sm" variant="ghost" className="text-xs border border-white/20 text-white hover:bg-white/10 hover:text-white shadow-none cursor-pointer">
                  {t("footer.employeeLogin")}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-6">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/50">
            <p>© 2026 PT NetVerse Fiber Indonesia. All rights reserved.</p>
            <p>{t("footer.createdBy")} <i><a href="https://rizkychandra.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Rizky Chandra</a></i> &bull; {t("footer.systemSubtitle")}</p>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-6 right-6 p-3 bg-gradient-blue text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-colors z-40 border border-white/10 cursor-pointer"
          aria-label={t("footer.backToTop")}
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}
    </div>
  );
}
