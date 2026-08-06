from fastapi import APIRouter, Depends, HTTPException
from models.harvest import HarvestCreate, HarvestUpdate, HarvestResponse
from middleware.auth import get_current_user, require_admin_or_farmer
from database import get_database
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/harvests", tags=["الحصاد"])

@router.get("", response_model=list[HarvestResponse])
async def list_harvests(current_user: dict = Depends(get_current_user), planting_id: Optional[str] = None, farm_id: Optional[str] = None):
    db = get_database()
    query = {}
    if planting_id: query["planting_id"] = planting_id
    if farm_id:
        farm_plantings = await db.plantings.find({"farm_id": farm_id}).to_list(200)
        query["planting_id"] = {"$in": [str(p["_id"]) for p in farm_plantings]}
    harvests = await db.harvests.find(query).to_list(200)
    planting_ids = list(set(h.get("planting_id") for h in harvests if h.get("planting_id")))
    plantings_map = {}
    if planting_ids:
        plantings = await db.plantings.find({"_id": {"$in": [ObjectId(pid) for pid in planting_ids]}}).to_list(200)
        farm_ids = list(set(p.get("farm_id") for p in plantings if p.get("farm_id")))
        crop_ids = list(set(p.get("crop_id") for p in plantings if p.get("crop_id")))
        farms = await db.farms.find({"_id": {"$in": [ObjectId(fid) for fid in farm_ids]}}).to_list(100) if farm_ids else []
        crops = await db.crops.find({"_id": {"$in": [ObjectId(cid) for cid in crop_ids]}}).to_list(100) if crop_ids else []
        farms_map = {str(f["_id"]): f["farm_name"] for f in farms}
        crops_map = {str(c["_id"]): c["name_ar"] for c in crops}
        plantings_map = {str(p["_id"]): {"farm_name": farms_map.get(p.get("farm_id","")), "crop_name": crops_map.get(p.get("crop_id","")), "planting_date": p.get("planting_date")} for p in plantings}
    return [HarvestResponse(_id=str(h["_id"]), planting_id=h.get("planting_id",""), harvest_date=h.get("harvest_date"), yield_tons=h.get("yield_tons"), quality_grade=h.get("quality_grade"), seeds_saved_kg=h.get("seeds_saved_kg",0), revenue_omr=h.get("revenue_omr"), farm_name=plantings_map.get(h.get("planting_id",""),{}).get("farm_name"), crop_name=plantings_map.get(h.get("planting_id",""),{}).get("crop_name"), planting_date=plantings_map.get(h.get("planting_id",""),{}).get("planting_date")) for h in harvests]

@router.post("", response_model=HarvestResponse, status_code=201)
async def create_harvest(data: HarvestCreate, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    doc = data.model_dump()
    result = await db.harvests.insert_one(doc)
    planting = await db.plantings.find_one({"_id": ObjectId(data.planting_id)})
    farm_name = crop_name = None
    if planting:
        farm = await db.farms.find_one({"_id": ObjectId(planting["farm_id"])})
        crop = await db.crops.find_one({"_id": ObjectId(planting["crop_id"])})
        farm_name = farm["farm_name"] if farm else None
        crop_name = crop["name_ar"] if crop else None
    return HarvestResponse(_id=str(result.inserted_id), **doc, farm_name=farm_name, crop_name=crop_name, planting_date=planting.get("planting_date") if planting else None)

@router.delete("/{harvest_id}")
async def delete_harvest(harvest_id: str, _: dict = Depends(require_admin_or_farmer)):
    db = get_database()
    await db.harvests.delete_one({"_id": ObjectId(harvest_id)})
    return {"status": "deleted"}
