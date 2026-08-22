import { describe, expect, it } from "vitest";
import { buildRoadmapProgressAudit } from "./roadmapAudit";

describe("buildRoadmapProgressAudit", () => {
  it("يحفظ النسب قبل وبعد وسبب التعديل وبيانات المشرف", () => {
    expect(buildRoadmapProgressAudit({
      milestoneCode: "investment-suite",
      previousProgressPercent: 68,
      nextProgressPercent: 72,
      reason: "اكتمال مراجعة العقود الرقمية",
      changedByOpenId: "admin-1",
      changedByName: "مشرف المنصة",
    })).toEqual({
      milestoneCode: "investment-suite",
      previousProgressPercent: 68,
      nextProgressPercent: 72,
      reason: "اكتمال مراجعة العقود الرقمية",
      changedByOpenId: "admin-1",
      changedByName: "مشرف المنصة",
    });
  });
});
