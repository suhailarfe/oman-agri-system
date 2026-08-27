import React from "react";
import { MapPin } from "lucide-react";
import { regionDetailHref } from "@/lib/regionLedger";

export type RegionCardRecord = {
  number: string;
  code: string;
  name: string;
  area: string;
  status: string;
  irrigationSystem: string;
};

type RegionFilterResultsProps<T extends RegionCardRecord> = {
  regions: T[];
  onOpen: (region: T) => void;
};

export function RegionFilterResults<T extends RegionCardRecord>({ regions, onOpen }: RegionFilterResultsProps<T>) {
  if (!regions.length) {
    return <p className="region-filter-empty" role="status">لا توجد مناطق تطابق الفلاتر المحددة. غيّر المنطقة أو المحصول لعرض السجلات المتاحة.</p>;
  }

  return (
    <div className="map-interactive-container">
      <div className="map-visual-grid" aria-live="polite">
        {regions.map((region) => (
          <article key={region.code} className="map-pin-card">
            <div className="pin-card-header">
              <span className="pin-number">{region.number}</span>
              <MapPin size={18} className="pin-icon" />
            </div>
            <h3>{region.name}</h3>
            <p>{region.area}</p>
            <div className="region-status-pill">{region.status}</div>
            <div className="mt-2 text-xs text-muted">نظام الري: <b>{region.irrigationSystem}</b></div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
              <button type="button" className="text-button text-falaj text-xs" onClick={() => onOpen(region)}>نافذة سريعة</button>
              <a href={regionDetailHref(region.code)} className="pin-action text-xs font-bold text-copper hover:underline">الصفحة المستقلة</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
