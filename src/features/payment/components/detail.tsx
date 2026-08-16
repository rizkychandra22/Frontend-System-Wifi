import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import type { Payment } from "@/lib/api/payment";
import { paymentApi } from "@/lib/api/payment";

interface PaymentDetailProps {
  payment: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetail({ payment, isOpen, onOpenChange }: PaymentDetailProps) {
  if (!payment) return null;

  const invoiceNumber = payment.invoice_number || `INV-${payment.id.toString().padStart(4, '0')}`;
  const customerName = payment.customer?.name || "Customer";
  const pdfFilename = `${customerName} - ${invoiceNumber}.pdf`;

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
              onClick={() => paymentApi.downloadPaymentPDF(payment.id, pdfFilename)}
            >
              <Download className="h-4 w-4" />
              Download PDF Invoice
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
