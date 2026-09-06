const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

/**
 * Extracts normalized local YYYY-MM-DD from any date string (ISO timestamp, UTC, or YYYY-MM-DD).
 */
export function extractLocalDate(dateStr: string): { year: number; month: number; day: number; dateString: string } {
  if (!dateStr) return { year: 0, month: 0, day: 0, dateString: "" };

  // If it's an ISO timestamp with time/UTC indicator
  if (dateStr.includes("T") || dateStr.includes("Z")) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { year, month, day, dateString };
    }
  }

  // If it's a plain YYYY-MM-DD
  const clean = dateStr.substring(0, 10);
  const parts = clean.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return { year, month, day, dateString: clean };
  }

  return { year: 0, month: 0, day: 0, dateString: dateStr };
}

/**
 * Formats date to "DD MMM YYYY"
 */
export function formatShortDate(dateStr: string): string {
  const { year, month, day } = extractLocalDate(dateStr);
  if (!year || !month || !day) return dateStr || "-";
  const dayStr = String(day).padStart(2, "0");
  const monthStr = MONTHS_SHORT[month - 1] || "";
  return `${dayStr} ${monthStr} ${year}`;
}

/**
 * Formats date to "DD MMMM YYYY", e.g. "06 September 2026"
 */
export function formatFullDate(dateStr: string): string {
  const { year, month, day } = extractLocalDate(dateStr);
  if (!year || !month || !day) return dateStr || "-";
  const dayStr = String(day).padStart(2, "0");
  const monthStr = MONTHS_FULL[month - 1] || "";
  return `${dayStr} ${monthStr} ${year}`;
}

/**
 * Extracts HH:mm in local time from time string or ISO timestamp
 */
export function formatLocalTime(timeStr: string): string {
  if (!timeStr) return "";
  if (timeStr.includes("T") || timeStr.includes("Z")) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
  }
  if (timeStr.length >= 5 && timeStr.includes(":")) {
    return timeStr.substring(0, 5);
  }
  return timeStr;
}

/**
 * Extracts "YYYY-MM" in local timezone
 */
export function extractLocalMonthStr(dateVal: string): string {
  const { year, month } = extractLocalDate(dateVal);
  if (!year || !month) return "";
  return `${year}-${String(month).padStart(2, "0")}`;
}
