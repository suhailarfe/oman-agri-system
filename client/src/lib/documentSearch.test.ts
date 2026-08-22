import { describe, expect, it } from "vitest";
import { getSearchSegments } from "./documentSearch";

describe("getSearchSegments", () => {
  it("يعلم جميع المطابقات دون حساسية لحالة الأحرف", () => {
    expect(getSearchSegments("وثيقة MVP تشمل مواصفات mvp", "MVP")).toEqual([
      { text: "وثيقة ", isMatch: false },
      { text: "MVP", isMatch: true },
      { text: " تشمل مواصفات ", isMatch: false },
      { text: "mvp", isMatch: true },
      { text: "", isMatch: false },
    ]);
  });

  it("يعامل رموز التعبير النمطي ككلمات بحث عادية", () => {
    expect(getSearchSegments("pH 7.2 و pH 7+", "7+")).toEqual([
      { text: "pH 7.2 و pH ", isMatch: false },
      { text: "7+", isMatch: true },
      { text: "", isMatch: false },
    ]);
  });

  it("يعيد النص كاملاً بلا تمييز عند عدم وجود عبارة بحث", () => {
    expect(getSearchSegments("مواصفات MVP", "   ")).toEqual([
      { text: "مواصفات MVP", isMatch: false },
    ]);
  });
});
