from fastapi import APIRouter, Depends, HTTPException
from models.region import RegionCreate, RegionUpdate, RegionResponse
from middleware.auth import get_current_user, require_admin
from database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/regions", tags=["المناطق"])

@router.get("", response_model=list[RegionResponse])
async def list_regions(_: dict = Depends(get_current_user)):
    db = get_database()
    regions = await db.regions.find().to_list(100)
    return [RegionResponse(_id=str(r["_id"]), name=r["name"], governorate=r.get("governorate"), climate_type=r.get("climate_type"), soil_type=r.get("soil_type"), water_source=r.get("water_source"), total_area_ha=r.get("total_area_ha"), crops=r.get("crops", []), color=r.get("color"), created_at=r.get("created_at")) for r in regions]

@router.post("", response_model=RegionResponse, status_code=201)
async def create_region(data: RegionCreate, _: dict = Depends(require_admin)):
    db = get_database()
    doc = data.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = await db.regions.insert_one(doc)
    return RegionResponse(_id=str(result.inserted_id), **doc, created_at=doc["created_at"])

@router.put("/{region_id}", response_model=RegionResponse)
async def update_region(region_id: str, data: RegionUpdate, _: dict = Depends(require_admin)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.regions.update_one({"_id": ObjectId(region_id)}, {"$set": update_data})
    r = await db.regions.find_one({"_id": ObjectId(region_id)})
    if not r: raise HTTPException(status_code=404, detail="المنطقة غير موجودة")
    return RegionResponse(_id=str(r["_id"]), name=r["name"], governorate=r.get("governorate"), climate_type=r.get("climate_type"), soil_type=r.get("soil_type"), water_source=r.get("water_source"), total_area_ha=r.get("total_area_ha"), crops=r.get("crops", []), color=r.get("color"), created_at=r.get("created_at"))

@router.delete("/{region_id}")
async def delete_region(region_id: str, _: dict = Depends(require_admin)):
    db = get_database()
    farm_count = await db.farms.count_documents({"region_id": region_id})
    if farm_count > 0: raise HTTPException(status_code=400, detail=f"لا يمكن حذف المنطقة - يوجد {farm_count} مزرعة مرتبطة بها")
    await db.regions.delete_one({"_id": ObjectId(region_id)})
    return {"status": "deleted"}
