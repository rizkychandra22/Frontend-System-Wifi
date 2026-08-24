import type { Payment } from "@/lib/api/payment";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export async function generatePaymentsReportPDF(
  payments: Payment[],
  startDate: string,
  endDate: string,
  operatorName: string
): Promise<void> {
  // Format Date helpers (Indonesian Format)
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTimeIndo = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\./g, ":");
  };

  // Calculate totals
  const totalPackagePrice = payments.reduce((sum, p) => sum + p.package_price, 0);
  const totalPpn = payments.reduce((sum, p) => sum + p.ppn, 0);
  const totalAmount = payments.reduce((sum, p) => sum + p.total_amount, 0);
  const totalTransactions = payments.length;

  const periodLabel = `${formatDateIndo(startDate)} s/d ${formatDateIndo(endDate)}`;
  const printedAtLabel = formatDateTimeIndo(new Date().toISOString());

  // Create temporary off-screen container for rendering
  const element = document.createElement("div");
  element.style.width = "1120px"; // Fits A4 Landscape perfectly
  element.style.padding = "35px";
  element.style.boxSizing = "border-box";
  element.style.backgroundColor = "#ffffff";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "-9999px";

  // Build Monospace Report HTML
  let rowsHtml = "";
  if (payments.length === 0) {
    rowsHtml = `
      <tr>
        <td colspan="9" style="padding: 12px; text-align: center; font-style: italic; border-bottom: 1px dashed #cbd5e1;">
          Tidak ada data transaksi pembayaran untuk rentang tanggal yang dipilih.
        </td>
      </tr>
    `;
  } else {
    payments.forEach((p) => {
      const invoiceNumber = p.invoice_number || `INV-${p.id.toString().padStart(4, "0")}`;
      const transDate = formatDateIndo(p.created_at);
      const customerInfo = `${p.customer?.name || "-"}<br/><span style="color: #64748b; font-size: 8px;">${p.customer?.phone || "-"}</span>`;
      const packageInfo = `${p.wifi_package?.name || "-"}<br/><span style="color: #64748b; font-size: 8px;">Rp ${p.package_price.toLocaleString("id-ID")}</span>`;
      const payMethod = p.payment_method?.toUpperCase() || "-";
      const statusText = p.status?.toUpperCase() || "SUCCESS";
      const createdByText = p.created_by ? `${p.created_by.role === "admin" ? "Admin" : "Karyawan"} - ${p.created_by.name}` : "-";

      rowsHtml += `
        <tr>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; font-weight: bold; vertical-align: top;">${invoiceNumber}</td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; white-space: nowrap;">${transDate}</td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top;">${customerInfo}</td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top;">${packageInfo}</td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; text-align: center;">
            <span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;">
              ${payMethod}
            </span>
          </td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; text-align: center;">
            <span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;">
              ${statusText}
            </span>
          </td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; text-align: right; font-weight: bold; white-space: nowrap;">
            Rp ${p.ppn.toLocaleString("id-ID")}
          </td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; text-align: right; font-weight: bold; color: #2563eb; white-space: nowrap;">
            Rp ${p.total_amount.toLocaleString("id-ID")}
          </td>
          <td style="padding: 8px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: top; font-size: 9px;">${createdByText}</td>
        </tr>
      `;
    });
  }

  element.innerHTML = `
    <div style="color: #1f2937; font-family: 'Courier New', Courier, monospace; font-size: 10px; line-height: 1.4;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Laporan Transaksi Pembayaran WiFi</h1>
        <div style="margin-top: 4px; font-size: 10px; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">NETVERSE FIBER NETWORK BILLING SYSTEM</div>
      </div>

      <!-- Meta Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px;">
        <tr>
          <td style="width: 60%; padding: 2px 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 110px; color: #4b5563;">Periode Laporan:</td>
                <td style="font-weight: bold;">${periodLabel}</td>
              </tr>
              <tr>
                <td style="width: 110px; color: #4b5563;">Total Transaksi:</td>
                <td style="font-weight: bold;">${totalTransactions} data</td>
              </tr>
            </table>
          </td>
          <td style="width: 40%; padding: 2px 0; vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 110px; color: #4b5563;">Dicetak Pada:</td>
                <td style="font-weight: bold;">${printedAtLabel}</td>
              </tr>
              <tr>
                <td style="width: 110px; color: #4b5563;">Dicetak Oleh:</td>
                <td style="font-weight: bold;">${operatorName}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Summary Box -->
      <div style="margin-bottom: 16px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc;">
        <h2 style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Ringkasan Keuangan Laporan</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 2px 0;">Total Biaya Paket Layanan:</td>
            <td style="text-align: right; font-weight: bold; font-size: 11px;">Rp ${totalPackagePrice.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0;">Total Pajak Terkumpul (PPN 11%):</td>
            <td style="text-align: right; font-weight: bold; font-size: 11px;">Rp ${totalPpn.toLocaleString("id-ID")}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0; font-weight: bold;">
            <td style="padding: 6px 0 2px; font-size: 12px; text-transform: uppercase;">Total Penerimaan Akhir (Gross):</td>
            <td style="padding: 6px 0 2px; text-align: right; font-size: 12px; color: #2563eb;">Rp ${totalAmount.toLocaleString("id-ID")}</td>
          </tr>
        </table>
      </div>

      <!-- History Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <thead>
          <tr>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Invoice</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Tanggal</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Pelanggan</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Paket Layanan</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Metode</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Status</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: right; font-weight: bold;">PPN</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: right; font-weight: bold;">Total Bayar</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Dibuat Oleh</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          
          <!-- Grand Totals Footer Row -->
          <tr style="font-weight: bold; border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937;">
            <td colspan="6" style="padding: 10px 6px; text-transform: uppercase; font-size: 11px;">GRAND TOTAL (${totalTransactions} Transaksi)</td>
            <td style="padding: 10px 6px; text-align: right; font-size: 11px; white-space: nowrap;">
              Rp ${totalPpn.toLocaleString("id-ID")}
            </td>
            <td style="padding: 10px 6px; text-align: right; font-size: 11px; color: #2563eb; white-space: nowrap;">
              Rp ${totalAmount.toLocaleString("id-ID")}
            </td>
            <td style="padding: 10px 6px;"></td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Note -->
      <div style="margin-top: 30px; text-align: center; font-style: italic; color: #64748b; font-size: 9px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
        Dokumen Laporan Pembayaran ini dihasilkan secara sistem otomatis oleh NetVerse Fiber Billing System.
      </div>
    </div>
  `;

  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 297; // Landscape A4 width in mm
    const pageHeight = 210; // Landscape A4 height in mm
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

    const startFormatted = startDate.replace(/-/g, "");
    const endFormatted = endDate.replace(/-/g, "");
    pdf.save(`laporan-pembayaran-${startFormatted}-${endFormatted}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
}
