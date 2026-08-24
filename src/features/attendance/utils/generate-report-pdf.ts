import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export interface AttendanceReportItem {
  id: string;
  employeeName: string;
  dateStr: string;
  workType: "Dailywork" | "Overtime";
  clockIn: string;
  clockOut: string;
  tariff: number;
  status: string;
}

export async function generateAttendanceReportPDF(
  items: AttendanceReportItem[],
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
  const totalDailyworkTariff = items
    .filter((item) => item.workType === "Dailywork")
    .reduce((sum, item) => sum + item.tariff, 0);

  const totalOvertimeTariff = items
    .filter((item) => item.workType === "Overtime")
    .reduce((sum, item) => sum + item.tariff, 0);

  const totalPayout = totalDailyworkTariff + totalOvertimeTariff;
  const totalRecords = items.length;

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
  if (items.length === 0) {
    rowsHtml = `
      <tr>
        <td colspan="7" style="padding: 12px; text-align: center; font-style: italic; border-bottom: 1px dashed #cbd5e1;">
          Tidak ada data rekap absensi untuk rentang tanggal yang dipilih.
        </td>
      </tr>
    `;
  } else {
    items.forEach((item) => {
      const formattedDate = formatDateIndo(item.dateStr);
      const isDailywork = item.workType === "Dailywork";
      const workTypeBadge = isDailywork
        ? `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;">DAILYWORK</span>`
        : `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff;">OVERTIME</span>`;

      const statusBadge = item.workType === "Overtime"
        ? `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa;">HADIR</span>`
        : item.status === "Hadir"
        ? `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;">HADIR</span>`
        : item.status === "Halfday"
        ? `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #fef3c7; color: #d97706; border: 1px solid #fde68a;">HALFDAY</span>`
        : `<span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;">${item.status.toUpperCase()}</span>`;

      rowsHtml += `
        <tr>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; font-weight: bold; vertical-align: middle;">${item.employeeName}</td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; white-space: nowrap;">${formattedDate}</td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; text-align: center;">${workTypeBadge}</td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; text-align: center; font-weight: 500;">${item.clockIn}</td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; text-align: center; font-weight: 500;">${item.clockOut}</td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; text-align: right; font-weight: bold; color: #2563eb; white-space: nowrap;">
            Rp ${item.tariff.toLocaleString("id-ID")}
          </td>
          <td style="padding: 10px 6px; border-bottom: 1px dashed #cbd5e1; vertical-align: middle; text-align: center;">${statusBadge}</td>
        </tr>
      `;
    });
  }

  element.innerHTML = `
    <div style="color: #1f2937; font-family: 'Courier New', Courier, monospace; font-size: 10px; line-height: 1.4;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Laporan Rekap Absensi & Lembur Karyawan</h1>
        <div style="margin-top: 4px; font-size: 10px; color: #4b5563; font-weight: bold; letter-spacing: 0.5px;">NETVERSE FIBER NETWORK STAFF MANAGEMENT SYSTEM</div>
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
                <td style="width: 110px; color: #4b5563;">Total Records:</td>
                <td style="font-weight: bold;">${totalRecords} data kehadiran & lembur</td>
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
        <h2 style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Ringkasan Honor/Gaji Karyawan</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 2px 0;">Total Tarif Kehadiran (Dailywork):</td>
            <td style="text-align: right; font-weight: bold; font-size: 11px;">Rp ${totalDailyworkTariff.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0;">Total Tarif Lemburan (Overtime):</td>
            <td style="text-align: right; font-weight: bold; font-size: 11px;">Rp ${totalOvertimeTariff.toLocaleString("id-ID")}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0; font-weight: bold;">
            <td style="padding: 6px 0 2px; font-size: 12px; text-transform: uppercase;">Total Pengeluaran Gaji (Nett Payout):</td>
            <td style="padding: 6px 0 2px; text-align: right; font-size: 12px; color: #2563eb;">Rp ${totalPayout.toLocaleString("id-ID")}</td>
          </tr>
        </table>
      </div>

      <!-- History Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <thead>
          <tr>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Karyawan</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: left; font-weight: bold;">Tanggal</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Jenis Kerja</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Absen Masuk</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Absen Keluar</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: right; font-weight: bold;">Tarif</th>
            <th style="border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937; padding: 8px 6px; text-align: center; font-weight: bold;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          
          <!-- Grand Totals Footer Row -->
          <tr style="font-weight: bold; border-top: 2px solid #1f2937; border-bottom: 2px solid #1f2937;">
            <td colspan="5" style="padding: 10px 6px; text-transform: uppercase; font-size: 11px;">GRAND TOTAL (${totalRecords} DATA)</td>
            <td style="padding: 10px 6px; text-align: right; font-size: 11px; color: #2563eb; white-space: nowrap;">
              Rp ${totalPayout.toLocaleString("id-ID")}
            </td>
            <td style="padding: 10px 6px;"></td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Note -->
      <div style="margin-top: 30px; text-align: center; font-style: italic; color: #64748b; font-size: 9px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
        Dokumen Laporan Absensi & Lembur ini dihasilkan secara sistem otomatis oleh NetVerse Fiber Staff Portal.
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
    pdf.save(`laporan-rekap-absensi-${startFormatted}-${endFormatted}.pdf`);
  } finally {
    document.body.removeChild(element);
  }
}
