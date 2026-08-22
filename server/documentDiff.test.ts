import { describe, expect, it } from "vitest";
import { compareDocumentText } from "./documentDiff";

describe("compareDocumentText", () => {
  it("يحدد البنود المضافة والمحذوفة بين نسختين من الوثيقة", () => {
    expect(compareDocumentText("قاعدة أولى. قاعدة قديمة", "قاعدة أولى. قاعدة جديدة")).toEqual({
      added: ["قاعدة جديدة"],
      removed: ["قاعدة قديمة"],
    });
  });

  it("يتعامل مع الفاصلة العربية عند فصل بنود المقارنة", () => {
    expect(compareDocumentText("تتبع، جودة", "تتبع، تصدير")).toEqual({
      added: ["تصدير"],
      removed: ["جودة"],
    });
  });
});
