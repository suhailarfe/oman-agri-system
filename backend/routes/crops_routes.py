from fastapi import APIRouter, Depends, HTTPException
from models.crop import CropCreate, CropUpdate, CropResponse
from middleware.auth import get_current_user, require_admin
from database import get_database
from bson import ObjectId

router = APIRouter(prefix="/api/crops", tags=["المحاصيل"])

@router.get("", response_model=list[CropResponse])
async def list_crops(_: dict = Depends(get_current_user)):
    db = get_database()
    crops = await db.crops.find().to_list(100)
    return [CropResponse(_id=str(c["_id"]), **{k: v for k, v in c.items() if k != "_id"}) for c in crops]

@router.post("", response_model=CropResponse, status_code=201)
async def create_crop(data: CropCreate, _: dict = Depends(require_admin)):
    db = get_database()
    doc = data.model_dump()
    result = await db.crops.insert_one(doc)
    return CropResponse(_id=str(result.inserted_id), **doc)

@router.put("/{crop_id}", response_model=CropResponse)
async def update_crop(crop_id: str, data: CropUpdate, _: dict = Depends(require_admin)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.crops.update_one({"_id": ObjectId(crop_id)}, {"$set": update_data})
    c = await db.crops.find_one({"_id": ObjectId(crop_id)})
    if not c: raise HTTPException(status_code=404, detail="المحصول غير موجود")
    return CropResponse(_id=str(c["_id"]), **{k: v for k, v in c.items() if k != "_id"})

@router.delete("/{crop_id}")
async def delete_crop(crop_id: str, _: dict = Depends(require_admin)):
    db = get_database()
    await db.crops.delete_one({"_id": ObjectId(crop_id)})
    return {"status": "deleted"}
