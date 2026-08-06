from fastapi import APIRouter, Depends, HTTPException
from models.cost import CostCreate, CostUpdate, CostResponse
from middleware.auth import get_current_user, require_admin
from database import get_database
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/costs", tags=["التكاليف"])

@router.get("", response_model=list[CostResponse])
async def list_costs(_: dict = Depends(get_current_user), farm_id: Optional[str] = None, is_recurring: Optional[bool] = None):
    db = get_database()
    query = {}
    if farm_id: query["farm_id"] = farm_id
    if is_recurring is not None: query["is_recurring"] = is_recurring
    costs = await db.costs.find(query).to_list(200)
    farm_ids = list(set(c.get("farm_id") for c in costs if c.get("farm_id")))
    farms_map = {}
    if farm_ids:
        farms = await db.farms.find({"_id": {"$in": [ObjectId(fid) for fid in farm_ids]}}).to_list(100)
        farms_map = {str(f["_id"]): f["farm_name"] for f in farms}
    return [CostResponse(_id=str(c["_id"]), farm_id=c.get("farm_id",""), category=c["category"], amount_omr=c["amount_omr"], incurred_date=c.get("incurred_date"), is_recurring=c.get("is_recurring",False), description=c.get("description"), farm_name=farms_map.get(c.get("farm_id",""))) for c in costs]

@router.post("", response_model=CostResponse, status_code=201)
async def create_cost(data: CostCreate, _: dict = Depends(require_admin)):
    db = get_database()
    doc = data.model_dump()
    result = await db.costs.insert_one(doc)
    farm = await db.farms.find_one({"_id": ObjectId(data.farm_id)})
    return CostResponse(_id=str(result.inserted_id), **doc, farm_name=farm["farm_name"] if farm else None)

@router.put("/{cost_id}", response_model=CostResponse)
async def update_cost(cost_id: str, data: CostUpdate, _: dict = Depends(require_admin)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.costs.update_one({"_id": ObjectId(cost_id)}, {"$set": update_data})
    c = await db.costs.find_one({"_id": ObjectId(cost_id)})
    farm = await db.farms.find_one({"_id": ObjectId(c["farm_id"])})
    return CostResponse(_id=str(c["_id"]), farm_id=c.get("farm_id",""), category=c["category"], amount_omr=c["amount_omr"], incurred_date=c.get("incurred_date"), is_recurring=c.get("is_recurring",False), description=c.get("description"), farm_name=farm["farm_name"] if farm else None)

@router.delete("/{cost_id}")
async def delete_cost(cost_id: str, _: dict = Depends(require_admin)):
    db = get_database()
    await db.costs.delete_one({"_id": ObjectId(cost_id)})
    return {"status": "deleted"}
