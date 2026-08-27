export type RegionFilterRecord = {
  code: string;
  crop: string;
};

export function filterRegions<T extends RegionFilterRecord>(regions: T[] | undefined, regionCode: string, crop: string) {
  return (regions ?? []).filter((region) => {
    if (regionCode !== "all" && region.code !== regionCode) return false;
    if (crop !== "all" && !region.crop.includes(crop)) return false;
    return true;
  });
}
