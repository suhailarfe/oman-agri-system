import { describe, expect, it } from "vitest";
import { filterWaterLedger, toWaterChartPoints } from "./waterFilters";

const records = [
  { regionCode: "najd", salinityPpm: 320, sampledAt: new Date("2026-03-15T09:00:00Z") },
  { regionCode: "batinah", salinityPpm: 430, sampledAt: new Date("2026-04-15T09:00:00Z") },
  { regionCode: "najd", salinityPpm: 318, sampledAt: new Date("2026-01-15T09:00:00Z") },
];

describe("فلاتر ملف المياه", () => {
  it("يعرض القراءات التي تتجاوز حد المراجعة ويرتبها حسب الملوحة", () => {
    const result = filterWaterLedger(records, "all", "requires-review", "salinity-desc");
    expect(result.map((record) => record.regionCode)).toEqual(["batinah"]);
  });

  it("يحصر السجل الزمني في المنطقة ويعيده بترتيب التاريخ", () => {
    const result = toWaterChartPoints(records, "najd");
    expect(result.map((record) => record.salinityPpm)).toEqual([318, 320]);
  });
});
