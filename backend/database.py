from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None

async def connect_to_mongo():
    global _client, _db
    _client = AsyncIOMotorClient(settings.mongodb_url)
    _db = _client[settings.database_name]
    await _db.users.create_index("username", unique=True)
    await _db.users.create_index("email", unique=True)
    await _db.farms.create_index("region_id")
    await _db.plantings.create_index("farm_id")
    await _db.plantings.create_index("crop_id")
    await _db.harvests.create_index("planting_id")
    await _db.costs.create_index("farm_id")

async def close_mongo_connection():
    global _client
    if _client:
        _client.close()

def get_database() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not connected")
    return _db
