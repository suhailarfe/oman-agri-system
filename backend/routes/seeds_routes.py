from fastapi import APIRouter, Depends, HTTPException
from models.seed_source import SeedSourceCreate, SeedSourceUpdate, SeedSourceResponse
from middleware.auth import get_current_user, require_admin
from database import get_database
from bson import ObjectId

router = APIRouter(prefix="/api/seeds", tags=["مصادر البذور"])

@router.get("", response_model=list[SeedSourceResponse])
async def list_seed_sources(_: dict = Depends(get_current_user)):
    db = get_database()
    sources = await db.seed_sources.find().to_list(100)
    return [SeedSourceResponse(_id=str(s["_id"]), **{k: v for k, v in s.items() if k != "_id"}) for s in sources]

@router.post("", response_model=SeedSourceResponse, status_code=201)
async def create_seed_source(data: SeedSourceCreate, _: dict = Depends(require_admin)):
    db = get_database()
    doc = data.model_dump()
    result = await db.seed_sources.insert_one(doc)
    return SeedSourceResponse(_id=str(result.inserted_id), **doc)

@router.put("/{source_id}", response_model=SeedSourceResponse)
async def update_seed_source(source_id: str, data: SeedSourceUpdate, _: dict = Depends(require_admin)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.seed_sources.update_one({"_id": ObjectId(source_id)}, {"$set": update_data})
    s = await db.seed_sources.find_one({"_id": ObjectId(source_id)})
    if not s: raise HTTPException(status_code=404, detail="المصدر غير موجود")
    return SeedSourceResponse(_id=str(s["_id"]), **{k: v for k, v in s.items() if k != "_id"})

@router.delete("/{source_id}")
async def delete_seed_source(source_id: str, _: dict = Depends(require_admin)):
    db = get_database()
    await db.seed_sources.delete_one({"_id": ObjectId(source_id)})
    return {"status": "deleted"}
