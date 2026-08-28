export type WaterLedgerRecord = {
  regionCode: string;
  salinityPpm: number;
  sampledAt: Date | string;
};

export type WaterSalinityFilter = "all" | "within-limit" | "requires-review";
export type WaterSort = "latest" | "salinity-desc" | "salinity-asc";

export function filterWaterLedger<T extends WaterLedgerRecord>(records: T[] | undefined, regionCode: string, salinityFilter: WaterSalinityFilter, sort: WaterSort) {
  const filtered = (records ?? []).filter((record) => {
    if (regionCode !== "all" && record.regionCode !== regionCode) return false;
    if (salinityFilter === "within-limit" && record.salinityPpm > 400) return false;
    if (salinityFilter === "requires-review" && record.salinityPpm <= 400) return false;
    return true;
  });

  return [...filtered].sort((left, right) => {
    if (sort === "salinity-desc") return right.salinityPpm - left.salinityPpm;
    if (sort === "salinity-asc") return left.salinityPpm - right.salinityPpm;
    return new Date(right.sampledAt).getTime() - new Date(left.sampledAt).getTime();
  });
}

export function toWaterChartPoints(records: WaterLedgerRecord[] | undefined, regionCode: string) {
  return (records ?? [])
    .filter((record) => record.regionCode === regionCode)
    .map((record) => ({
      date: new Intl.DateTimeFormat("ar-OM", { month: "short", year: "numeric" }).format(new Date(record.sampledAt)),
      salinityPpm: record.salinityPpm,
      timestamp: new Date(record.sampledAt).getTime(),
    }))
    .sort((left, right) => left.timestamp - right.timestamp);
}
