import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminContact } from "@/features/user/hooks/use-users";
import { useWifiPackages } from "@/features/wifi-package/hooks/use-wifi-packages";
import { formatWifiPackages } from "@/components/wifi-package";

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const { data: adminContact } = useAdminContact();
  const { query: wifiPackagesQuery } = useWifiPackages();
  const dbPackages = wifiPackagesQuery.data ?? [];
  const formattedPackages = formatWifiPackages(dbPackages);
  const displayPackages = formattedPackages.length > 0 ? formattedPackages : [];

  const paketParam = searchParams.get("paket") || "";
  const [formLoading, setFormLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(paketParam);
  const [contactForm, setContactForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    message: paketParam
      ? `Halo, saya tertarik untuk berlangganan ${paketParam}. Mohon informasikan cara pemasangannya.`
      : "",
  }));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      toast.error("Nama, Nomor HP, dan Pesan wajib diisi.");
      return;
    }

    setFormLoading(true);

    // Format Nomor WA Tujuan
    let waNumber = "6285155010482";
    if (adminContact && adminContact.phone) {
      const cleanPhone = adminContact.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.startsWith("0")) {
        waNumber = "62" + cleanPhone.substring(1);
      } else {
        waNumber = cleanPhone;
      }
    }
    const emailStr = contactForm.email ? contactForm.email : "-";
    const packageStr = selectedPackage ? selectedPackage : "-";

    const waMessage = `Halo NetVerse Fiber, saya ingin bertanya/berlangganan. Berikut detail informasi saya:

*Nama*: ${contactForm.name}
*Nomor HP*: ${contactForm.phone}
*Email*: ${emailStr}
*Paket yang Diminati*: ${packageStr}
*Pesan*: 
${contactForm.message}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      setFormLoading(false);
      toast.success("Form valid! Mengalihkan ke WhatsApp...");

      window.open(waUrl, "_blank");

      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setSelectedPackage("");
    }, 1000);
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Layanan Pelanggan
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Hubungi Layanan Kami
          </h1>
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
                  {adminContact ? (
                    <>
                      <p className="text-xs text-muted-foreground">{adminContact.name} ({adminContact.phone})</p>
                      <p className="text-xs text-muted-foreground">+62 821-2221-9332 (Layanan WA 2)</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">+62 821-2221-9332</p>
                      <p className="text-xs text-muted-foreground">+62 821-7813-1581</p>
                    </>
                  )}
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
                  {displayPackages.map((pkg, idx) => (
                    <option key={idx} value={pkg.name} className="bg-card">
                      {pkg.name} ({pkg.price} / bulan)
                    </option>
                  ))}
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
                className="w-full bg-gradient-blue text-primary-foreground font-semibold h-10 shadow-blue mt-2 cursor-pointer"
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
    </div>
  );
}
