export type AuditCsvRow = {
  milestoneTitle: string;
  previousProgressPercent: number;
  nextProgressPercent: number;
  changedByName: string | null;
  reason: string;
  changedAt: Date | string;
};

function escapeCsvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function createRoadmapAuditCsv(rows: AuditCsvRow[]) {
  const header = ["المرحلة", "النسبة السابقة", "النسبة الجديدة", "المشرف", "سبب التعديل", "وقت التعديل"];
  const body = rows.map((row) => [row.milestoneTitle, row.previousProgressPercent, row.nextProgressPercent, row.changedByName ?? "مشرف معتمد", row.reason, new Date(row.changedAt).toLocaleString("ar-OM")]);
  return `\uFEFF${[header, ...body].map((row) => row.map(escapeCsvCell).join(",")).join("\n")}`;
}
