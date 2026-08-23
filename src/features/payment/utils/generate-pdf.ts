import type { Payment } from "@/lib/api/payment";
import { format } from "date-fns";

interface Html2PdfInstance {
  from: (element: HTMLElement) => Html2PdfInstance;
  set: (options: Record<string, unknown>) => Html2PdfInstance;
  save: () => Promise<void>;
}

interface CustomWindow extends Window {
  html2pdf?: () => Html2PdfInstance;
}

export async function generatePaymentPDF(payment: Payment, filename: string): Promise<void> {
  const customWindow = window as unknown as CustomWindow;

  // Load html2pdf.js dynamically from CDN if not already loaded
  if (!customWindow.html2pdf) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Gagal mengunduh library PDF. Hubungkan ke internet."));
      document.head.appendChild(script);
    });
  }

  const html2pdf = customWindow.html2pdf;
  if (!html2pdf) {
    throw new Error("Library PDF tidak dapat diinisialisasi.");
  }

  // Prepare invoice data
  const invoiceNumber = payment.invoice_number || `INV-${payment.id.toString().padStart(4, '0')}`;
  const customerName = payment.customer?.name || "-";
  const customerPhone = payment.customer?.phone || "-";
  const customerAddress = payment.customer?.address || "-";
  const packageName = payment.wifi_package?.name || "-";
  const packagePrice = payment.package_price;
  const ppn = payment.ppn;
  const totalAmount = payment.total_amount;
  const paymentMethod = payment.payment_method || "-";
  const paymentStatus = payment.status || "Paid";
  const transactionDate = format(new Date(payment.created_at), "dd MMMM yyyy HH:mm");

  // Create a temporary element to hold the print layout
  const element = document.createElement("div");
  element.style.padding = "20px";
  element.style.maxWidth = "800px";

  element.innerHTML = `
    <div style="color: #1f2937; font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.4;">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1f2937; padding-bottom: 12px;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Invoice Pembayaran WiFi</h1>
        <div style="margin-top: 6px; font-size: 13px; font-weight: bold; text-transform: uppercase;">PELANGGAN: ${customerName.toUpperCase()}</div>
        <div style="margin-top: 4px; font-size: 10px; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">NETVERSE FIBER NETWORK</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
        <tr>
          <td style="width: 55%; padding: 2px 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 90px; color: #4b5563; padding: 2px 0;">No Telepon:</td>
                <td style="font-weight: bold; padding: 2px 0;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="width: 90px; color: #4b5563; padding: 2px 0;">Alamat:</td>
                <td style="font-weight: bold; padding: 2px 0;">${customerAddress}</td>
              </tr>
            </table>
          </td>
          <td style="width: 45%; padding: 2px 0 2px 20px; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 110px; color: #4b5563; padding: 2px 0;">No. Invoice:</td>
                <td style="font-weight: bold; padding: 2px 0;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="width: 110px; color: #4b5563; padding: 2px 0;">Tanggal:</td>
                <td style="font-weight: bold; padding: 2px 0;">${transactionDate}</td>
              </tr>
              <tr>
                <td style="width: 110px; color: #4b5563; padding: 2px 0;">Metode Bayar:</td>
                <td style="font-weight: bold; padding: 2px 0;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="width: 110px; color: #4b5563; padding: 2px 0;">Status:</td>
                <td style="font-weight: bold; padding: 2px 0; color: ${paymentStatus.toLowerCase() === "paid" || paymentStatus.toLowerCase() === "selesai" || paymentStatus.toLowerCase() === "success" ? "#16a34a" : "#dc2626"}; text-transform: uppercase;">
                  ${paymentStatus}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="margin-top: 10px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-size: 11px;">Komponen Layanan</th>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; width: 24%; font-size: 11px;">Jenis</th>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: right; width: 24%; font-size: 11px;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1;">Paket WiFi (${packageName})</td>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; text-align: center;">Layanan Internet</td>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: bold;">Rp ${packagePrice.toLocaleString("id-ID")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1;">PPN (11%)</td>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; text-align: center;">Pajak</td>
              <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: bold;">Rp ${ppn.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 14px; border-top: 2px solid #1f2937; padding-top: 10px; page-break-inside: avoid;">
        <h2 style="margin: 0 0 4px; font-size: 13px; font-weight: bold; text-transform: uppercase;">Ringkasan Biaya</h2>
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 10px;">
          Total Pembayaran = Harga Paket + Pajak Pertambahan Nilai (PPN 11%).
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 4px 0; width: 72%;">Total Tagihan</td>
              <td style="padding: 4px 0; text-align: right; font-weight: bold;">Rp ${packagePrice.toLocaleString("id-ID")}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; width: 72%;">Total PPN</td>
              <td style="padding: 4px 0; text-align: right; font-weight: bold;">Rp ${ppn.toLocaleString("id-ID")}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid #1f2937;">
              <td style="padding: 8px 0; width: 72%; font-size: 12px; text-transform: uppercase;">Jumlah Akhir</td>
              <td style="padding: 8px 0; text-align: right; font-size: 12px; color: #2563eb;">Rp ${totalAmount.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 40px; text-align: center; font-weight: bold; font-size: 10px; border-top: 1px dashed #cbd5e1; padding-top: 12px; color: #4b5563;">
        Dokumen invoice pembayaran ini adalah bukti transaksi yang sah dan diterbitkan secara digital oleh NetVerse Billing System.
      </div>
    </div>
  `;

  // html2pdf options
  const opt = {
    margin: [12, 12, 12, 12],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  // Generate and save PDF
  await html2pdf().from(element).set(opt).save();
}
