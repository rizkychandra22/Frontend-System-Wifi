import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n";
import { useAdminContact } from "@/features/user/hooks/use-users";
import { useWifiPackages } from "@/features/wifi-package/hooks/use-wifi-packages";
import { formatWifiPackages } from "@/components/wifi-package";

export default function ContactPage() {
  const { t } = useTranslation("ContactPage");
  const [searchParams] = useSearchParams();
  const { data: adminContact } = useAdminContact();
  const { query: wifiPackagesQuery } = useWifiPackages();
  const dbPackages = wifiPackagesQuery.data ?? [];
  const formattedPackages = formatWifiPackages(dbPackages);
  const displayPackages = formattedPackages.length > 0 ? formattedPackages : [];

  const paketParam = searchParams.get("package") || "";
  const [formLoading, setFormLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(paketParam);
  const [contactForm, setContactForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    message: paketParam ? t("form.defaultPackageMessage", { package: paketParam }) : "",
  }));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      toast.error(t("form.validationError"));
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

    const waMessage = `${t("form.waGreeting")}

*${t("form.waName")}*: ${contactForm.name}
*${t("form.waPhone")}*: ${contactForm.phone}
*${t("form.waEmail")}*: ${emailStr}
*${t("form.waPackage")}*: ${packageStr}
*${t("form.waMessage")}*: 
${contactForm.message}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      setFormLoading(false);
      toast.success(t("form.redirectToast"));

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center pt-10 pb-12 md:pt-12 md:pb-14">
      <div className="container mx-auto px-4 md:px-6 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            {t("header.title")}
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("header.description")}
          </p>
        </div>

        <h3 className="font-bold text-xl font-display text-foreground mb-4">{t("info.title")}</h3>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 w-full items-stretch">
          {/* Left Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <p className="text-muted-foreground text-xs leading-relaxed">{t("info.description")}</p>

            <div className="flex-1 flex flex-col justify-between gap-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">{t("info.phone.title")}</h4>
                  {adminContact ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {adminContact.name} ({adminContact.phone})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +62 821-2221-9332 {t("info.phone.service2")}
                      </p>
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
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">{t("info.email.title")}</h4>
                  <p className="text-xs text-muted-foreground">support@netversefiber.net</p>
                  <p className="text-xs text-muted-foreground">info@netversefiber.net</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm">{t("info.office.title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("info.office.building")}</p>
                  <p className="text-xs text-muted-foreground">{t("info.office.address")}</p>
                </div>
              </div>
            </div>

            <Card className="bg-muted/40 shadow-none">
              <CardContent className="p-4 text-xs text-muted-foreground flex gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-semibold text-foreground block mb-0.5">
                    {t("info.hours.title")}
                  </span>
                  <span>{t("info.hours.time")}</span>
                  <br />
                  <span>{t("info.hours.support")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Contact Form */}
          <Card className="lg:col-span-3 border-border/80 rounded-2xl shadow-sm flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <form
                onSubmit={handleFormSubmit}
                className="space-y-3.5 flex-1 flex flex-col justify-between"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                      {t("form.nameLabel")}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("form.namePlaceholder")}
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                      {t("form.phoneLabel")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t("form.phonePlaceholder")}
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phone: e.target.value,
                        })
                      }
                      className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                      {t("form.emailLabel")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="h-9 text-xs focus:ring-primary focus:border-primary shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="package"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      {t("form.packageLabel")}
                    </Label>
                    <Select
                      value={selectedPackage || "__none__"}
                      onValueChange={(value) =>
                        setSelectedPackage(value === "__none__" ? "" : value)
                      }
                    >
                      <SelectTrigger id="package" className="h-9 text-xs shadow-none">
                        <SelectValue placeholder={t("form.packagePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__" className="text-xs text-muted-foreground">
                          {t("form.packagePlaceholder")}
                        </SelectItem>
                        {selectedPackage &&
                          !displayPackages.some((pkg) => pkg.name === selectedPackage) && (
                            <SelectItem value={selectedPackage} className="text-xs">
                              {selectedPackage}
                            </SelectItem>
                          )}
                        {displayPackages.map((pkg, idx) => (
                          <SelectItem key={idx} value={pkg.name} className="text-xs">
                            {pkg.name} ({pkg.price} / {t("form.month")})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-semibold text-muted-foreground">
                    {t("form.messageLabel")}
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder={t("form.messagePlaceholder")}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="text-xs focus:ring-primary focus:border-primary shadow-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-blue text-primary-foreground font-semibold h-10 shadow-blue mt-2 hover:opacity-90 transition-colors cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("form.submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
