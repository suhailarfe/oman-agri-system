from fastapi import APIRouter, Depends, HTTPException, status
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from middleware.auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["المصادقة"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    db = get_database()
    existing = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="اسم المستخدم أو البريد الإلكتروني مستخدم مسبقاً")
    user_dict = {"username": user_data.username, "email": user_data.email, "display_name": user_data.display_name, "role": user_data.role, "hashed_password": hash_password(user_data.password), "is_active": True, "created_at": datetime.utcnow()}
    result = await db.users.insert_one(user_dict)
    return UserResponse(id=str(result.inserted_id), username=user_dict["username"], email=user_dict["email"], display_name=user_dict["display_name"], role=user_dict["role"], is_active=True)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, str(user["hashed_password"])):
        raise HTTPException(status_code=401, detail="اسم المستخدم أو كلمة المرور غير صحيحة")
    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "role": user["role"]})
    return TokenResponse(access_token=token, user=UserResponse(id=user_id, username=user["username"], email=user["email"], display_name=user["display_name"], role=user["role"], is_active=user.get("is_active", True)))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(id=current_user["_id"], username=current_user["username"], email=current_user["email"], display_name=current_user["display_name"], role=current_user["role"], is_active=current_user.get("is_active", True))

@router.get("/users", response_model=list[UserResponse])
async def list_users(current_user: dict = Depends(require_admin)):
    db = get_database()
    users = await db.users.find().to_list(100)
    return [UserResponse(id=str(u["_id"]), username=u["username"], email=u["email"], display_name=u["display_name"], role=u["role"], is_active=u.get("is_active", True)) for u in users]

@router.patch("/users/{user_id}/toggle-active")
async def toggle_user_active(user_id: str, current_user: dict = Depends(require_admin)):
    db = get_database()
    u = await db.users.find_one({"_id": ObjectId(user_id)})
    if not u:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")
    new_status = not u.get("is_active", True)
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"is_active": new_status}})
    return {"status": "success", "is_active": new_status}
