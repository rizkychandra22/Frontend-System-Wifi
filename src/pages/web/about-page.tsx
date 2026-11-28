import { Link } from "react-router-dom";
import { Zap, Wifi, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useTranslation, type TFunction } from "@/i18n";

const getCorePillars = (t: TFunction) => [
  {
    title: t("pillars.pillar1.title"),
    description: t("pillars.pillar1.description"),
    icon: Zap,
    iconBgClass: "bg-blue/10 text-primary",
    hoverBorderClass: "hover:border-primary/40",
  },
  {
    title: t("pillars.pillar2.title"),
    description: t("pillars.pillar2.description"),
    icon: Wifi,
    iconBgClass: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    hoverBorderClass: "hover:border-green-500/40",
  },
  {
    title: t("pillars.pillar3.title"),
    description: t("pillars.pillar3.description"),
    icon: Clock,
    iconBgClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    hoverBorderClass: "hover:border-amber-500/40",
  },
  {
    title: t("pillars.pillar4.title"),
    description: t("pillars.pillar4.description"),
    icon: ShieldCheck,
    iconBgClass: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    hoverBorderClass: "hover:border-red-500/40",
  },
];

export default function AboutPage() {
  const { t } = useTranslation("AboutPage");
  const corePillars = getCorePillars(t);

  return (
    <div className="flex flex-col">
      {/* Main Viewport Section: Header + 4 Core Pillars */}
      <section className="pt-10 pb-12 md:pt-12 md:pb-16">
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

          {/* 4 Core Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={pillar.title}
                  className={`group border-border/80 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${pillar.hoverBorderClass}`}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-11 w-11 rounded-lg ${pillar.iconBgClass} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-bold text-lg font-display leading-snug">
                        {pillar.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission Banner */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <Card className="max-w-4xl mx-auto rounded-2xl bg-muted/40 shadow-none">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <CardTitle className="text-2xl font-bold font-display text-foreground">
                {t("banner.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                {t("banner.description")}
              </CardDescription>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link to="/subscription">
                  <Button className="group bg-gradient-blue text-primary-foreground font-semibold shadow-blue hover:opacity-90 transition-opacity">
                    {t("banner.btnExplore")}
                    <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">{t("banner.btnContact")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
