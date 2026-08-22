import { describe, expect, it } from "vitest";
import { buildVersionApproval } from "./versionApproval";

describe("buildVersionApproval", () => {
  it("يجهز إصداراً معتمداً ومتاحاً للمستثمرين عند اختيار النشر", () => {
    expect(buildVersionApproval(true, "اعتماد بعد المراجعة", "admin-1")).toMatchObject({
      publicationState: "approved",
      accessLevel: "investor",
      approvedByOpenId: "admin-1",
    });
  });

  it("يبقي الإصدار المعتمد داخلياً عندما لا يوافق المشرف على نشره", () => {
    expect(buildVersionApproval(false, "مرجع داخلي", "admin-1")).toMatchObject({
      status: "معتمد للاستخدام الإداري",
      accessLevel: "admin",
    });
  });
});
