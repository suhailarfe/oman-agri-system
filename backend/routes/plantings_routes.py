from fastapi import APIRouter, Depends, HTTPException
from models.planting import PlantingCreate, PlantingUpdate, PlantingResponse
from middleware.auth import get_current_user, require_admin_or_farmer
from database import get_database
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/plantings", tags=["دورات الزراعة"])

@router.get("", response_model=list[PlantingResponse])
async def list_plantings(current_user: dict = Depends(get_current_user), farm_id: Optional[str] = None):
    db = get_database()
    query = {}
    if farm_id: query["farm_id"] = farm_id
    if current_user["role"] == "farmer":
        user_farms = await db.farms.find({"managed_by_user_id": current_user["_id"]}).to_list(100)
        user_farm_ids = [str(f["_id"]) for f in user_farms]
        query["farm_id"] = {"$in": user_farm_ids}
    plantings = await db.plantings.find(query).to_list(200)
    farm_ids = list(set(p.get("farm_id") for p in plantings if p.get("farm_id")))
    crop_ids = list(set(p.get("crop_id") for p in plantings if p.get("crop_id")))
    farms_map, crops_map = {}, {}
    if farm_ids:
        farms = await db.farms.find({"_id": {"$in": [ObjectId(fid) for fid in farm_ids]}}).to_list(100)
        farms_map = {str(f["_id"]): f["farm_name"] for f in farms}
    if crop_ids:
        crops = await db.crops.find({"_id": {"$in": [ObjectId(cid) for cid in crop_ids]}}).to_list(100)
        crops_map = {str(c["_id"]): c["name_ar"] for c in crops}
    return [PlantingResponse(_id=str(p["_id"]), farm_id=p.get("farm_id",""), crop_id=p.get("crop_id",""), planted_area_ha=p.get("planted_area_ha"), planting_date=p.get("planting_date"), expected_harvest=p.get("expected_harvest"), seed_qty_kg=p.get("seed_qty_kg"), season=p.get("season"), farm_name=farms_map.get(p.get("farm_id","")), crop_name=crops_map.get(p.get("crop_id",""))) for p in plantings]

@router.post("", response_model=PlantingResponse, status_code=201)
async def create_planting(data: PlantingCreate, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    doc = data.model_dump()
    result = await db.plantings.insert_one(doc)
    farm = await db.farms.find_one({"_id": ObjectId(data.farm_id)})
    crop = await db.crops.find_one({"_id": ObjectId(data.crop_id)})
    return PlantingResponse(_id=str(result.inserted_id), **doc, farm_name=farm["farm_name"] if farm else None, crop_name=crop["name_ar"] if crop else None)

@router.put("/{planting_id}", response_model=PlantingResponse)
async def update_planting(planting_id: str, data: PlantingUpdate, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.plantings.update_one({"_id": ObjectId(planting_id)}, {"$set": update_data})
    p = await db.plantings.find_one({"_id": ObjectId(planting_id)})
    farm = await db.farms.find_one({"_id": ObjectId(p["farm_id"])}) if p.get("farm_id") else None
    crop = await db.crops.find_one({"_id": ObjectId(p["crop_id"])}) if p.get("crop_id") else None
    return PlantingResponse(_id=str(p["_id"]), farm_id=p.get("farm_id",""), crop_id=p.get("crop_id",""), planted_area_ha=p.get("planted_area_ha"), planting_date=p.get("planting_date"), expected_harvest=p.get("expected_harvest"), seed_qty_kg=p.get("seed_qty_kg"), season=p.get("season"), farm_name=farm["farm_name"] if farm else None, crop_name=crop["name_ar"] if crop else None)

@router.delete("/{planting_id}")
async def delete_planting(planting_id: str, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    await db.harvests.delete_many({"planting_id": planting_id})
    await db.plantings.delete_one({"_id": ObjectId(planting_id)})
    return {"status": "deleted"}
