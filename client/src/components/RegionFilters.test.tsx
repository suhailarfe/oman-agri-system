/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { RegionFilters } from "./RegionFilters";

afterEach(cleanup);

function FilterHarness() {
  const [region, setRegion] = useState("all");
  const [crop, setCrop] = useState("all");

  return (
    <>
      <RegionFilters region={region} crop={crop} onRegionChange={setRegion} onCropChange={setCrop} />
      <output data-testid="filter-state">{region}/{crop}</output>
    </>
  );
}

describe("RegionFilters", () => {
  it("يحدث تصفية المنطقة ويعكس الاختيار في الحالة المضبوطة", () => {
    render(<FilterHarness />);

    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "batinah" } });

    expect((screen.getByLabelText("تصفية حسب المنطقة:") as HTMLSelectElement).value).toBe("batinah");
    expect(screen.getByTestId("filter-state").textContent).toBe("batinah/all");
  });

  it("يجمع تصفية المحصول مع المنطقة ويتيح العودة إلى جميع المناطق", () => {
    render(<FilterHarness />);

    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "najd" } });
    fireEvent.change(screen.getByLabelText("تصفية حسب المحصول:"), { target: { value: "قمح" } });
    expect(screen.getByTestId("filter-state").textContent).toBe("najd/قمح");

    fireEvent.change(screen.getByLabelText("تصفية حسب المنطقة:"), { target: { value: "all" } });
    expect(screen.getByTestId("filter-state").textContent).toBe("all/قمح");
  });
});
