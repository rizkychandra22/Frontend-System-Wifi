import type { Payment } from "@/lib/api/payment";
import { format } from "date-fns";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export async function generatePaymentPDF(payment: Payment, filename: string): Promise<void> {
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

  // Create a temporary element off-screen to draw the layout
  const element = document.createElement("div");
  element.style.width = "750px"; 
  element.style.padding = "35px";
  element.style.boxSizing = "border-box";
  element.style.backgroundColor = "#ffffff";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "-9999px";

  element.innerHTML = `
    <div style="color: #1f2937; font-family: 'Courier New', Courier, monospace; font-size: 12px; line-height: 1.4;">
      <div style="text-align: center; margin-bottom: 26px; border-bottom: 2px solid #1f2937; padding-bottom: 12px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Invoice Pembayaran WiFi</h1>
        <div style="margin-top: 6px; font-size: 14px; font-weight: bold; text-transform: uppercase;">PELANGGAN: ${customerName.toUpperCase()}</div>
        <div style="margin-top: 4px; font-size: 10px; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">NETVERSE FIBER NETWORK</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="width: 55%; padding: 2px 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 95px; color: #4b5563; padding: 2px 0;">No Telepon:</td>
                <td style="font-weight: bold; padding: 2px 0;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="width: 95px; color: #4b5563; padding: 2px 0;">Alamat:</td>
                <td style="font-weight: bold; padding: 2px 0;">${customerAddress}</td>
              </tr>
            </table>
          </td>
          <td style="width: 45%; padding: 2px 0 2px 20px; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 115px; color: #4b5563; padding: 2px 0;">No. Invoice:</td>
                <td style="font-weight: bold; padding: 2px 0;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="width: 115px; color: #4b5563; padding: 2px 0;">Tanggal:</td>
                <td style="font-weight: bold; padding: 2px 0;">${transactionDate}</td>
              </tr>
              <tr>
                <td style="width: 115px; color: #4b5563; padding: 2px 0;">Metode Bayar:</td>
                <td style="font-weight: bold; padding: 2px 0;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="width: 115px; color: #4b5563; padding: 2px 0;">Status:</td>
                <td style="font-weight: bold; padding: 2px 0; color: ${paymentStatus.toLowerCase() === "paid" || paymentStatus.toLowerCase() === "selesai" || paymentStatus.toLowerCase() === "success" ? "#16a34a" : "#dc2626"}; text-transform: uppercase;">
                  ${paymentStatus}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="margin-top: 10px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
          <thead>
            <tr>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-size: 12px;">Komponen Layanan</th>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; width: 24%; font-size: 12px;">Jenis</th>
              <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: right; width: 24%; font-size: 12px;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1;">Paket WiFi (${packageName})</td>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; text-align: center;">Layanan Internet</td>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: bold;">Rp ${packagePrice.toLocaleString("id-ID")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1;">PPN (11%)</td>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; text-align: center;">Pajak</td>
              <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; text-align: right; font-weight: bold;">Rp ${ppn.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 16px; border-top: 2px solid #1f2937; padding-top: 10px; page-break-inside: avoid;">
        <h2 style="margin: 0 0 4px; font-size: 13px; font-weight: bold; text-transform: uppercase;">Ringkasan Biaya</h2>
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 10px;">
          Total Pembayaran = Harga Paket + Pajak Pertambahan Nilai (PPN 11%).
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 5px 0; width: 72%;">Total Tagihan</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold;">Rp ${packagePrice.toLocaleString("id-ID")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; width: 72%;">Total PPN</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold;">Rp ${ppn.toLocaleString("id-ID")}</td>
            </tr>
            <tr style="font-weight: bold; border-top: 2px solid #1f2937;">
              <td style="padding: 10px 0; width: 72%; font-size: 13px; text-transform: uppercase;">Jumlah Akhir</td>
              <td style="padding: 10px 0; text-align: right; font-size: 13px; color: #2563eb;">Rp ${totalAmount.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 45px; text-align: center; font-weight: bold; font-size: 10px; border-top: 1px dashed #cbd5e1; padding-top: 12px; color: #4b5563;">
        Dokumen invoice pembayaran ini adalah bukti transaksi yang diterbitkan secara digital oleh NetVerse Fiber Billing System.
      </div>
    </div>
  `;

  document.body.appendChild(element);

  try {
    // Capture the element using html2canvas-pro which has full native support for oklch colors
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Create PDF page using jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const imgWidth = 210; // A4 size width in mm
    const pageHeight = 297; // A4 size height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    // Remove the element from DOM
    document.body.removeChild(element);
  }
}
