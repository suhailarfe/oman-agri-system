import { describe, expect, it } from "vitest";
import { regionDetailHref } from "./regionLedger";

describe("regionDetailHref", () => {
  it("يبقي بطاقات السجل التحريري ضمن مسار تفاصيل المنطقة الحالي", () => {
    expect(regionDetailHref(" najd ")).toBe("/region/najd");
  });

  it("يرمز أي رمز منطقة يحوي محرفاً خاصاً دون الخروج من المسار", () => {
    expect(regionDetailHref("al-dakhiliyah/1")).toBe("/region/al-dakhiliyah%2F1");
  });
});
