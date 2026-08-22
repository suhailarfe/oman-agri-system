import { describe, expect, it } from "vitest";
import { createRoadmapAuditCsv } from "./auditCsv";

describe("createRoadmapAuditCsv", () => {
  it("ينشئ CSV عربياً ويهّرب الفواصل وعلامات الاقتباس", () => {
    const csv = createRoadmapAuditCsv([{ milestoneTitle: "مرحلة الاستثمار", previousProgressPercent: 68, nextProgressPercent: 72, changedByName: "مشرف, رئيسي", reason: "اعتماد \"العقود\"", changedAt: "2026-08-22T00:00:00.000Z" }]);
    expect(csv.startsWith("\uFEFFالمرحلة")).toBe(true);
    expect(csv).toContain('"مشرف, رئيسي"');
    expect(csv).toContain('"اعتماد ""العقود"""');
  });
});
