/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React, { useMemo, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegionFilterResults } from "./RegionFilterResults";
import { RegionFilters } from "./RegionFilters";
import { filterRegions } from "@/lib/regionFilters";

const regions = [
  { number: "01", code: "najd", name: "النجد، ظفار", crop: "قمح وأعلاف", area: "40,000 كم²", status: "مخطط", irrigationSystem: "ري محوري" },
  { number: "02", code: "batinah", name: "سهل الباطنة", crop: "خضروات وحمضيات", area: "الشريط الساحلي", status: "نشط", irrigationSystem: "ري بالتنقيط" },
];

function RegionFilterIntegrationHarness() {
  const [region, setRegion] = useState("all");
  const [crop, setCrop] = useState("all");
  const visibleRegions = useMemo(() => filterRegions(regions, region, crop), [region, crop]);

  return (
    <>
      <RegionFilters region={region} crop={crop} onRegionChange={setRegion} onCropChange={setCrop} />
      <RegionFilterResults regions={visibleRegions} onOpen={vi.fn()} />
    </>
  );
}

afterEach(cleanup);

describe("تكامل فلاتر المناطق", () => {
  it("يغيّر بطاقات المناطق عند اختيار منطقة ثم محصول", () => {
    render(<RegionFilterIntegrationHarness />);

    expect(screen.getByRole("heading", { name: "النجد، ظفار" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "سهل الباطنة" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "batinah" } });
    expect(screen.queryByRole("heading", { name: "النجد، ظفار" })).toBeNull();
    expect(screen.getByRole("heading", { name: "سهل الباطنة" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("تصفية حسب المحصول:"), { target: { value: "قمح" } });
    expect(screen.getByRole("status").textContent).toContain("لا توجد مناطق تطابق الفلاتر المحددة");
  });

  it("يعيد البطاقات المطابقة عند تغيير المنطقة إلى جميع المناطق", () => {
    render(<RegionFilterIntegrationHarness />);

    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "batinah" } });
    fireEvent.change(screen.getByLabelText("تصفية حسب المحصول:"), { target: { value: "قمح" } });
    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "all" } });

    expect(screen.getByRole("heading", { name: "النجد، ظفار" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "سهل الباطنة" })).toBeNull();
  });
});
