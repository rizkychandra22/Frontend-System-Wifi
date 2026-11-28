import { Link } from "react-router-dom";
import { Zap, Wifi, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useTranslation, type TFunction } from "@/i18n";
import logoImg from "@/assets/logo.png";

const getFeatureHighlights = (t: TFunction) => [
  {
    title: t("features.feature1.title"),
    description: t("features.feature1.description"),
    to: "/about",
    linkLabel: t("features.feature1.linkLabel"),
    icon: Zap,
    iconBgClass: "bg-blue/10 text-primary",
    hoverBorderClass: "hover:border-primary/40",
  },
  {
    title: t("features.feature2.title"),
    description: t("features.feature2.description"),
    to: "/subscription",
    linkLabel: t("features.feature2.linkLabel"),
    icon: ShieldCheck,
    iconBgClass: "bg-emerald-500/10 text-emerald-500",
    hoverBorderClass: "hover:border-emerald-500/40",
  },
  {
    title: t("features.feature3.title"),
    description: t("features.feature3.description"),
    to: "/contact",
    linkLabel: t("features.feature3.linkLabel"),
    icon: Clock,
    iconBgClass: "bg-purple-500/10 text-purple-500",
    hoverBorderClass: "hover:border-purple-500/40",
    spanClass: "sm:col-span-2 lg:col-span-1",
  },
];

export default function HomePage() {
  const { t } = useTranslation("HomePage");
  const featureHighlights = getFeatureHighlights(t);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 md:min-h-[calc(100vh-4rem)] md:flex md:items-center md:pt-12 md:pb-10 overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-y-10 md:gap-8 lg:gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-4 md:pr-4">
            <Badge
              variant="outline"
              className="gap-2 px-3 py-1 rounded-full border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider"
            >
              <Zap className="h-3 w-3" />
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-foreground leading-[1.1]">
              {t("hero.title_start")}<span className="text-gradient-blue">{t("hero.title_gradient")}</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              {t("hero.description")}
            </p>
            <div className="flex flex-row items-center gap-3 pt-2">
              <Link to="/subscription" className="flex-1 sm:flex-initial">
                <Button size="lg" className="group w-full sm:w-auto px-4 sm:px-8 bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:opacity-90 transition-all">
                  {t("hero.btnChoosePackage")}
                  <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact" className="flex-1 sm:flex-initial">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-4 sm:px-8 font-medium hover:bg-muted transition-colors">
                  {t("hero.btnContact")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Graphics */}
          <div className="relative flex justify-center items-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-deep/20 to-blue/20 blur-xl opacity-75"></div>
            <Card className="relative bg-card/60 backdrop-blur rounded-2xl p-3.5 sm:p-4 shadow-xl max-w-[400px] lg:max-w-[440px] aspect-square w-full overflow-hidden hover:scale-[1.01] transition-transform duration-300">
              <div className="w-full h-full rounded-lg overflow-hidden bg-muted shadow-sm">
                <img
                  src={logoImg}
                  alt={t("hero.cardAlt")}
                  className="w-full h-full object-cover scale-115 -translate-y-4 animate-pulse-subtle"
                />
              </div>
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t("hero.cardTitle")}</h4>
                    <p className="text-xs text-white/80">{t("hero.cardSubtitle")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featureHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className={`group rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.hoverBorderClass} ${item.spanClass ?? ""}`}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${item.iconBgClass} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="font-bold text-base font-display leading-snug">{item.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </CardDescription>
                    <Link
                      to={item.to}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline pt-1"
                    >
                      {item.linkLabel}{" "}
                      <ArrowRight className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
