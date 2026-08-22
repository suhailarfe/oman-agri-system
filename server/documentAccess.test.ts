import { describe, expect, it } from "vitest";
import { createRoleAwareExport } from "./documentAccess";

const document = {
  title: "مواصفات MVP",
  versionTag: "v1.0",
  status: "معتمد",
  summary: "ملخص المستثمر",
  content: "تفاصيل المشرف الداخلية",
  changeSummary: "سجل التغيير الداخلي",
};

describe("createRoleAwareExport", () => {
  it("يعرض المحتوى الكامل وسجل التغيير للمشرف", () => {
    expect(createRoleAwareExport(document, "admin")).toMatchObject({
      content: "تفاصيل المشرف الداخلية",
      changeSummary: "سجل التغيير الداخلي",
      exportAudience: "المشرف",
    });
  });

  it("يخفي التفاصيل الداخلية وسجل التغيير عن المستثمر", () => {
    expect(createRoleAwareExport(document, "user")).toMatchObject({
      content: "ملخص المستثمر",
      exportAudience: "المستثمر",
    });
    expect(createRoleAwareExport(document, "user").changeSummary).not.toContain("الداخلي");
  });
});
