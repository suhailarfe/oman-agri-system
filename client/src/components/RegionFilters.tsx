import React from "react";
import { Filter, Sprout } from "lucide-react";

type RegionFiltersProps = {
  region: string;
  crop: string;
  onRegionChange: (value: string) => void;
  onCropChange: (value: string) => void;
};

export function RegionFilters({ region, crop, onRegionChange, onCropChange }: RegionFiltersProps) {
  return (
    <div className="filter-toolbar" aria-label="فلاتر المناطق الزراعية">
      <div className="filter-group">
        <label htmlFor="region-filter"><Filter size={15} /> تصفية حسب المنطقة:</label>
        <select id="region-filter" value={region} onChange={(event) => onRegionChange(event.target.value)}>
          <option value="all">جميع المناطق (٥)</option>
          <option value="najd">منطقة النجد، ظفار</option>
          <option value="batinah">سهل الباطنة</option>
          <option value="dhahirah">محافظة الظاهرة</option>
          <option value="wusta">المنطقة الوسطى</option>
          <option value="jabal">الجبل الأخضر</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="crop-filter"><Sprout size={15} /> تصفية حسب المحصول:</label>
        <select id="crop-filter" value={crop} onChange={(event) => onCropChange(event.target.value)}>
          <option value="all">جميع المحاصيل</option>
          <option value="قمح">القمح الاستراتيجي</option>
          <option value="نخيل">النخيل والتمور</option>
          <option value="خضروات">الخضروات الطازجة</option>
          <option value="رمان">الفواكه الجبلية</option>
        </select>
      </div>
    </div>
  );
}
