from fastapi import APIRouter, Depends, HTTPException
from models.farm import FarmCreate, FarmUpdate, FarmResponse
from middleware.auth import get_current_user, require_admin, require_admin_or_farmer
from database import get_database
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/farms", tags=["المزارع"])

@router.get("", response_model=list[FarmResponse])
async def list_farms(current_user: dict = Depends(get_current_user), region_id: Optional[str] = None):
    db = get_database()
    query = {}
    if current_user["role"] == "farmer":
        query["managed_by_user_id"] = current_user["_id"]
    if region_id:
        query["region_id"] = region_id
    farms = await db.farms.find(query).to_list(100)
    region_ids = list(set(f.get("region_id") for f in farms if f.get("region_id")))
    regions_map = {}
    if region_ids:
        region_docs = await db.regions.find({"_id": {"$in": [ObjectId(rid) for rid in region_ids]}}).to_list(100)
        regions_map = {str(r["_id"]): r["name"] for r in region_docs}
    return [FarmResponse(_id=str(f["_id"]), region_id=f.get("region_id", ""), farm_name=f["farm_name"], area_ha=f.get("area_ha"), irrigation_system=f.get("irrigation_system"), status=f.get("status", "قيد الإعداد"), manager_name=f.get("manager_name"), coordinates=f.get("coordinates"), managed_by_user_id=f.get("managed_by_user_id"), created_at=f.get("created_at"), region_name=regions_map.get(f.get("region_id", ""))) for f in farms]

@router.post("", response_model=FarmResponse, status_code=201)
async def create_farm(data: FarmCreate, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    doc = data.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = await db.farms.insert_one(doc)
    region = await db.regions.find_one({"_id": ObjectId(data.region_id)})
    return FarmResponse(_id=str(result.inserted_id), **doc, created_at=doc["created_at"], region_name=region["name"] if region else None)

@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(farm_id: str, data: FarmUpdate, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.farms.update_one({"_id": ObjectId(farm_id)}, {"$set": update_data})
    f = await db.farms.find_one({"_id": ObjectId(farm_id)})
    region = await db.regions.find_one({"_id": ObjectId(f.get("region_id", ""))}) if f.get("region_id") else None
    return FarmResponse(_id=str(f["_id"]), region_id=f.get("region_id", ""), farm_name=f["farm_name"], area_ha=f.get("area_ha"), irrigation_system=f.get("irrigation_system"), status=f.get("status", "قيد الإعداد"), manager_name=f.get("manager_name"), coordinates=f.get("coordinates"), managed_by_user_id=f.get("managed_by_user_id"), created_at=f.get("created_at"), region_name=region["name"] if region else None)

@router.delete("/{farm_id}")
async def delete_farm(farm_id: str, _: dict = Depends(require_admin)):
    db = get_database()
    await db.farms.delete_one({"_id": ObjectId(farm_id)})
    await db.plantings.delete_many({"farm_id": farm_id})
    await db.costs.delete_many({"farm_id": farm_id})
    return {"status": "deleted"}
