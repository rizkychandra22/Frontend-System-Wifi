import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export interface PayrollSlipPDFData {
  employeeName: string;
  monthStr: string;
  monthLabel: string;
  dailyworkCount: number;
  dailyworkPrice: number;
  overtimeHours: number;
  overtimePrice: number;
  halfdayCount: number;
  halfdayPrice: number;
  izinCount: number;
  grandPrice: number;
  fulldayPermissions: string[];
  halfdayPermissions: string[];
}

export async function generatePayrollSlipPDF(
  item: PayrollSlipPDFData,
  operatorName: string
): Promise<void> {
  const printedAtLabel = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replace(/\./g, ":");

  const element = document.createElement("div");
  element.style.width = "790px"; // Fits A4 Portrait perfectly
  element.style.padding = "40px";
  element.style.boxSizing = "border-box";
  element.style.backgroundColor = "#ffffff";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "-9999px";

  // Build Monospace Slip HTML
  const fulldayNotes = item.fulldayPermissions.length > 0
    ? item.fulldayPermissions
        .map((note, index) => `<div style="margin-left: 10px; margin-bottom: 2px;">${index + 1}. ${note}</div>`)
        .join("")
    : `<div style="margin-left: 10px; font-style: italic; color: #64748b;">Tidak ada izin fullday</div>`;

  const halfdayNotes = item.halfdayPermissions.length > 0
    ? item.halfdayPermissions
        .map((note, index) => `<div style="margin-left: 10px; margin-bottom: 2px;">${index + 1}. ${note}</div>`)
        .join("")
    : `<div style="margin-left: 10px; font-style: italic; color: #64748b;">Tidak ada izin halfday</div>`;

  element.innerHTML = `
    <div style="color: #1f2937; font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.5;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px double #1f2937; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase;">Slip Gaji Karyawan</h1>
        <div style="margin-top: 4px; font-size: 11px; color: #4b5563; font-weight: bold;">NETVERSE FIBER NETWORK STAFF MANAGEMENT SYSTEM</div>
      </div>

      <!-- Info Details -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px;">
        <tr>
          <td style="width: 150px; color: #4b5563; padding: 3px 0;">Nama Karyawan:</td>
          <td style="font-weight: bold; font-size: 12px;">${item.employeeName}</td>
        </tr>
        <tr>
          <td style="color: #4b5563; padding: 3px 0;">Bulan Penggajian:</td>
          <td style="font-weight: bold;">${item.monthLabel}</td>
        </tr>
        <tr>
          <td style="color: #4b5563; padding: 3px 0;">Dicetak Pada:</td>
          <td>${printedAtLabel}</td>
        </tr>
        <tr>
          <td style="color: #4b5563; padding: 3px 0;">Dicetak Oleh:</td>
          <td>${operatorName}</td>
        </tr>
      </table>

      <!-- Breakdown Table -->
      <h3 style="margin: 0 0 8px; font-size: 12px; font-weight: bold; border-bottom: 1px solid #1f2937; padding-bottom: 4px; text-transform: uppercase;">Rincian Pendapatan</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px;">
        <thead>
          <tr style="border-bottom: 1px solid #1f2937;">
            <th style="padding: 6px 0; text-align: left; font-weight: bold; width: 45%;">Deskripsi Pekerjaan</th>
            <th style="padding: 6px 0; text-align: center; font-weight: bold; width: 25%;">Kuantitas / Waktu</th>
            <th style="padding: 6px 0; text-align: right; font-weight: bold; width: 30%;">Total Tarif</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">Kehadiran Harian (Dailywork)</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: center;">${item.dailyworkCount} Hari</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-weight: bold;">Rp ${item.dailyworkPrice.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">Kerja Lembur (Overtime)</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: center;">${item.overtimeHours} Jam</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-weight: bold;">Rp ${item.overtimePrice.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">Setengah Hari (Halfday Permission)</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: center;">${item.halfdayCount} Hari</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-weight: bold;">Rp ${item.halfdayPrice.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">Izin Penuh (Fullday Permission)</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: center;">${item.izinCount} Hari</td>
            <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: right; font-style: italic; color: #64748b;">Tidak ada</td>
          </tr>
          <tr style="border-top: 1px solid #1f2937; font-weight: bold; font-size: 12px;">
            <td colspan="2" style="padding: 10px 0;">GRAND TOTAL PENERIMAAN</td>
            <td style="padding: 10px 0; text-align: right; color: #2563eb;">Rp ${item.grandPrice.toLocaleString("id-ID")}</td>
          </tr>
        </tbody>
      </table>

      <!-- Permissions Details -->
      <h3 style="margin: 0 0 8px; font-size: 12px; font-weight: bold; border-bottom: 1px solid #1f2937; padding-bottom: 4px; text-transform: uppercase;">Daftar Keterangan Izin</h3>
      
      <div style="margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 4px;">A. Fullday Permission (Izin Satu Hari Penuh):</div>
        ${fulldayNotes}
      </div>

      <div style="margin-bottom: 30px;">
        <div style="font-weight: bold; margin-bottom: 4px;">B. Halfday Permission (Izin Setengah Hari Kerja):</div>
        ${halfdayNotes}
      </div>

      <!-- Watermark / Footer Note -->
      <div style="margin-top: 50px; text-align: center; font-style: italic; color: #64748b; font-size: 9px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
        Dokumen payroll ini dicetak dari NetVerse Staff System secara digital oleh ${operatorName} pada ${printedAtLabel}.
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
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // Portrait A4 width in mm
    const pageHeight = 297; // Portrait A4 height in mm
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

    const monthFormatted = item.monthStr.replace(/-/g, "_");
    const nameFormatted = item.employeeName.toLowerCase().replace(/\s+/g, "_");
    pdf.save(`slip_gaji_${nameFormatted}_${monthFormatted}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
}
