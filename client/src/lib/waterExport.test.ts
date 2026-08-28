import { describe, expect, it } from "vitest";
import { buildWaterLedgerCsv, buildWaterLedgerPrintHtml } from "./waterExport";

const reading = {
  regionName: "سهل الباطنة",
  sourceName: "بئر الساحل الجوفي",
  sourceType: "بئر مرقبة",
  salinityPpm: 430,
  ph: 7.1,
  flowRate: "45 جالون/دقيقة",
  operationalStatus: "يعمل",
  sampledAt: new Date("2026-04-15T09:00:00Z"),
};

describe("تصدير ملف المياه", () => {
  it("ينشئ CSV عربياً يتضمن الأعمدة والقراءة المصفاة", () => {
    const csv = buildWaterLedgerCsv([reading]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("الملوحة (جزء/مليون)");
    expect(csv).toContain('"430"');
    expect(csv).toContain('"سهل الباطنة"');
  });

  it("يهرب محتوى المصدر في قالب PDF لتجنب تنفيذ HTML داخل التقرير", () => {
    const html = buildWaterLedgerPrintHtml([{ ...reading, sourceName: "بئر <مراجعة>" }], new Date("2026-08-28T00:00:00Z"));
    expect(html).toContain("بئر &lt;مراجعة&gt;");
    expect(html).toContain("عدد القراءات: 1");
  });
});
