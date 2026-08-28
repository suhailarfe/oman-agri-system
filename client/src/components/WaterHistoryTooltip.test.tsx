/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { WaterHistoryTooltip } from "./WaterHistoryTooltip";

afterEach(cleanup);

describe("WaterHistoryTooltip", () => {
  it("يعرض وقت القياس الكامل وتفاصيل القراءة عند تمرير المستخدم فوق نقطة الرسم", () => {
    render(<WaterHistoryTooltip active payload={[{ payload: { date: "أبريل 2026", measuredAt: "15 أبريل 2026، 9:00 ص", salinityPpm: 430, sourceName: "بئر الساحل الجوفي", ph: 7.1, flowRate: "45 جالون/دقيقة", operationalStatus: "يعمل" } }]} />);

    expect(screen.getByText("15 أبريل 2026، 9:00 ص")).toBeTruthy();
    expect(screen.getByText("430 جزء/مليون")).toBeTruthy();
    expect(screen.getByText("بئر الساحل الجوفي")).toBeTruthy();
    expect(screen.getByText("45 جالون/دقيقة")).toBeTruthy();
    expect(screen.getByText("يعمل")).toBeTruthy();
  });
});
