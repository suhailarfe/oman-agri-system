export type WaterExportRecord = {
  regionName: string;
  sourceName: string;
  sourceType: string;
  salinityPpm: number;
  ph: string | number;
  flowRate: string;
  operationalStatus: string;
  sampledAt: Date | string;
};

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
const escapeHtml = (value: string | number) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);

export function buildWaterLedgerCsv(records: WaterExportRecord[]) {
  const headers = ["المنطقة", "المصدر", "نوع المصدر", "الملوحة (جزء/مليون)", "الرقم الهيدروجيني", "التدفق", "حالة التشغيل", "تاريخ القياس"];
  const rows = records.map((record) => [record.regionName, record.sourceName, record.sourceType, record.salinityPpm, record.ph, record.flowRate, record.operationalStatus, new Intl.DateTimeFormat("ar-OM", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.sampledAt))]);
  return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
}

export function buildWaterLedgerPrintHtml(records: WaterExportRecord[], generatedAt: Date) {
  const rows = records.map((record) => `<tr><td>${escapeHtml(record.regionName)}</td><td>${escapeHtml(record.sourceName)}</td><td>${escapeHtml(record.salinityPpm)}</td><td>${escapeHtml(record.ph)}</td><td>${escapeHtml(record.flowRate)}</td><td>${escapeHtml(new Intl.DateTimeFormat("ar-OM", { dateStyle: "medium" }).format(new Date(record.sampledAt)))}</td></tr>`).join("");
  const date = new Intl.DateTimeFormat("ar-OM", { dateStyle: "long" }).format(generatedAt);
  return `<header><p>واحات ومزارع عُمان | رؤية 2040</p><h1>تقرير ملف المياه</h1><small>تاريخ التصدير: ${escapeHtml(date)} | عدد القراءات: ${records.length}</small></header><section><p>يعرض التقرير القراءات المعتمدة المطابقة للفلاتر المطبقة وقت التصدير.</p><table><thead><tr><th>المنطقة</th><th>المصدر</th><th>الملوحة</th><th>الرقم الهيدروجيني</th><th>التدفق</th><th>تاريخ القياس</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}
