import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Payment } from "@/lib/api/payment";
import { generatePaymentPDF } from "../utils/generate-pdf";

interface PaymentDetailProps {
  payment: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetail({ payment, isOpen, onOpenChange }: PaymentDetailProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!payment) return null;

  const invoiceNumber = payment.invoice_number || `INV-${payment.id.toString().padStart(4, '0')}`;
  const customerName = payment.customer?.name || "Customer";
  const pdfFilename = `${customerName} - ${invoiceNumber}.pdf`;

  const getPaymentMethodBadge = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">Cash</span>;
      case "bca":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">BCA</span>;
      case "qris":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200">Qris</span>;
      case "dana":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-500 border-blue-200">Dana</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">{method || "-"}</span>;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generatePaymentPDF(payment, pdfFilename);
      toast.success("Invoice PDF berhasil diunduh");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengunduh PDF";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Detail Pembayaran</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Invoice ID</h3>
            <p className="font-medium text-base">{invoiceNumber}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Tanggal</h3>
            <p className="font-medium">{format(new Date(payment.created_at), "dd MMM yyyy HH:mm")}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Pelanggan</h3>
            <p className="font-medium">{payment.customer?.name || "-"}</p>
            <p className="text-sm text-muted-foreground">{payment.customer?.phone || "-"}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Paket</h3>
            <p className="font-medium">{payment.wifi_package?.name || "-"}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Metode Bayar</h3>
            <div>{getPaymentMethodBadge(payment.payment_method)}</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-3 text-sm border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tagihan:</span>
              <span>Rp {payment.package_price.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PPN 11%:</span>
              <span>Rp {payment.ppn.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-3 mt-3">
              <span>Total Pembayaran:</span>
              <span className="text-primary">Rp {payment.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunduh PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF Invoice
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
