import React from "react";

export type WaterHistoryPoint = {
  date: string;
  measuredAt: string;
  salinityPpm: number;
  sourceName: string;
  ph: string | number;
  flowRate: string;
  operationalStatus: string;
};

export function WaterHistoryTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: WaterHistoryPoint }> }) {
  const record = payload?.[0]?.payload;
  if (!active || !record) return null;
  return <aside className="water-history-tooltip"><strong>{record.measuredAt}</strong><dl><div><dt>الملوحة</dt><dd>{record.salinityPpm} جزء/مليون</dd></div><div><dt>المصدر</dt><dd>{record.sourceName}</dd></div><div><dt>الرقم الهيدروجيني</dt><dd>{record.ph}</dd></div><div><dt>التدفق</dt><dd>{record.flowRate}</dd></div><div><dt>التشغيل</dt><dd>{record.operationalStatus}</dd></div></dl></aside>;
}
