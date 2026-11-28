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
import { useTranslation, type TFunction } from "@/i18n";
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

const getGalleryItems = (t: TFunction): GalleryItem[] => [
  {
    id: 1,
    title: t("items.item1.title"),
    category: "infrastruktur",
    image: heroImg,
    description: t("items.item1.description"),
  },
  {
    id: 2,
    title: t("items.item2.title"),
    category: "infrastruktur",
    image: logoImg,
    description: t("items.item2.description"),
  },
  {
    id: 3,
    title: t("items.item3.title"),
    category: "tim",
    image: heroImg,
    description: t("items.item3.description"),
  },
  {
    id: 4,
    title: t("items.item4.title"),
    category: "tim",
    image: logoImg,
    description: t("items.item4.description"),
  },
  {
    id: 5,
    title: t("items.item5.title"),
    category: "pelanggan",
    image: qrisFull,
    description: t("items.item5.description"),
  },
  {
    id: 6,
    title: t("items.item6.title"),
    category: "pelanggan",
    image: qrisLogo,
    description: t("items.item6.description"),
  },
];

export default function ActivityPage() {
  const { t } = useTranslation("ActivityPage");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>("all");

  const galleryItems = getGalleryItems(t);

  const categoryLabels: Record<GalleryCategory, string> = {
    infrastruktur: t("categories.infrastruktur"),
    tim: t("categories.tim"),
    pelanggan: t("categories.pelanggan"),
  };

  const galleryFilters: { value: GalleryFilter; label: string }[] = [
    { value: "all", label: t("categories.all") },
    { value: "infrastruktur", label: t("categories.infrastruktur") },
    { value: "tim", label: t("categories.tim") },
    { value: "pelanggan", label: t("categories.pelanggan") },
  ];

  const filteredGallery =
    galleryFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);

  const activeLightboxItem = lightboxItem
    ? galleryItems.find((item) => item.id === lightboxItem.id) || lightboxItem
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-10 pb-12 md:pt-12 md:pb-16">
      <div className="container mx-auto px-4 md:px-6 w-full">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            {t("header.title")}
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t("header.description")}
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
        open={Boolean(activeLightboxItem)}
        onOpenChange={(open) => {
          if (!open) setLightboxItem(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-card gap-0 [&>button]:bg-black/60 [&>button]:text-white [&>button]:p-2 [&>button]:rounded-full [&>button]:opacity-100 [&>button:hover]:bg-black/80">
          {activeLightboxItem && (
            <>
              <AspectRatio ratio={16 / 9} className="w-full bg-black">
                <img
                  src={activeLightboxItem.image}
                  alt={activeLightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
              <DialogHeader className="p-6 space-y-2 text-left">
                <div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 hover:bg-primary/10 px-2 py-0.5 rounded"
                  >
                    {categoryLabels[activeLightboxItem.category]}
                  </Badge>
                </div>
                <DialogTitle className="font-bold text-lg font-display text-foreground">
                  {activeLightboxItem.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  {activeLightboxItem.description}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
