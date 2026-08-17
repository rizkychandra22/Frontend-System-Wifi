import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Copy, Download, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import exQris from "@/assets/ex-qris.jpg";
import logoBca from "@/assets/logo-bca.png";
import logoDana from "@/assets/logo-dana.png";
import logoQris from "@/assets/logo-qris.png";

// Sample Account Numbers
const bcaAccount = "0123456789";
const danaAccount = "081234567890";

export function CustomerPaymentMethods() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [bcaModalOpen, setBcaModalOpen] = useState(false);
  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [danaModalOpen, setDanaModalOpen] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Nomor Rekening ${name} berhasil disalin!`);
  };

  const downloadQris = () => {
    const link = document.createElement("a");
    link.href = exQris;
    link.download = "QRIS_Pembayaran.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pt-4 border-t mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Metode Pembayaran</h2>
        {/* Navigation buttons for mobile */}
        <div className="flex gap-2 md:hidden">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* BCA Card */}
        <Card 
          className="min-w-full md:min-w-0 snap-center cursor-pointer transition-all hover:border-blue-800 hover:shadow-md flex-shrink-0"
          onClick={() => setBcaModalOpen(true)}
        >
          <CardContent className="p-6 flex flex-row items-center justify-start gap-4 h-full">
            <div className="w-16 h-12 flex items-center justify-center shrink-0">
              <img src={logoBca} alt="BCA" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-base text-foreground">Transfer BCA</span>
              <span className="text-xs text-muted-foreground">Virtual Account / Rekening</span>
            </div>
          </CardContent>
        </Card>

        {/* QRIS Card */}
        <Card 
          className="min-w-full md:min-w-0 snap-center cursor-pointer transition-all hover:border-red-600 hover:shadow-md flex-shrink-0"
          onClick={() => setQrisModalOpen(true)}
        >
          <CardContent className="p-6 flex flex-row items-center justify-start gap-4 h-full">
            <div className="w-16 h-12 flex items-center justify-center shrink-0">
              <img src={logoQris} alt="QRIS" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-base text-foreground">Scan QRIS</span>
              <span className="text-xs text-muted-foreground">Gopay, OVO, Dana, dll</span>
            </div>
          </CardContent>
        </Card>

        {/* DANA Card */}
        <Card 
          className="min-w-full md:min-w-0 snap-center cursor-pointer transition-all hover:border-blue-500 hover:shadow-md flex-shrink-0"
          onClick={() => setDanaModalOpen(true)}
        >
          <CardContent className="p-6 flex flex-row items-center justify-start gap-4 h-full">
            <div className="w-16 h-12 flex items-center justify-center shrink-0">
              <img src={logoDana} alt="DANA" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-base text-foreground">Transfer DANA</span>
              <span className="text-xs text-muted-foreground">Kirim ke Nomor DANA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BCA Modal */}
      <Dialog open={bcaModalOpen} onOpenChange={setBcaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5"/> Transfer Bank BCA</DialogTitle>
            <DialogDescription>
              Silakan transfer pembayaran Anda ke nomor rekening berikut:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg mt-4 border border-blue-100">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
              <p className="text-2xl font-bold tracking-widest text-blue-900">{bcaAccount}</p>
              <p className="text-sm font-medium mt-1 uppercase">a.n. Taufik Hidayat</p>
            </div>
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(bcaAccount, "BCA")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QRIS Modal */}
      <Dialog open={qrisModalOpen} onOpenChange={setQrisModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Scan QRIS</DialogTitle>
            <DialogDescription>
              Scan kode QR di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay, OVO, Dana, dll).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center mt-4">
            <img src={exQris} alt="QRIS Code" className="w-full max-w-[250px] object-contain rounded-lg mb-4" />
            <Button className="w-full" onClick={downloadQris}>
              <Download className="h-4 w-4 mr-2" />
              Unduh QRIS
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DANA Modal */}
      <Dialog open={danaModalOpen} onOpenChange={setDanaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Wallet className="w-5 h-5"/> Transfer DANA</DialogTitle>
            <DialogDescription>
              Silakan transfer pembayaran Anda ke nomor dana berikut:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg mt-4 border border-blue-100">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nomor DANA</p>
              <p className="text-2xl font-bold tracking-widest text-blue-600">{danaAccount}</p>
              <p className="text-sm font-medium mt-1 uppercase">a.n. Taufik Hidayat</p>
            </div>
            <Button size="icon" variant="outline" onClick={() => copyToClipboard(danaAccount, "DANA")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
