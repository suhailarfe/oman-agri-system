from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import connect_to_mongo, close_mongo_connection
from seed import seed_database

from routes.auth_routes import router as auth_router
from routes.regions_routes import router as regions_router
from routes.seeds_routes import router as seeds_router
from routes.crops_routes import router as crops_router
from routes.farms_routes import router as farms_router
from routes.plantings_routes import router as plantings_router
from routes.harvests_routes import router as harvests_router
from routes.costs_routes import router as costs_router
from routes.finance_routes import router as finance_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 بدء تشغيل نظام إدارة المشروع الزراعي — رؤية عُمان 2040")
    await connect_to_mongo()
    await seed_database()
    yield
    await close_mongo_connection()
    print("👋 تم إيقاف النظام")


app = FastAPI(
    title=settings.app_name,
    description="نظام متكامل لإدارة المشاريع الزراعية الحكومية في سلطنة عُمان ضمن رؤية 2040",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(regions_router)
app.include_router(seeds_router)
app.include_router(crops_router)
app.include_router(farms_router)
app.include_router(plantings_router)
app.include_router(harvests_router)
app.include_router(costs_router)
app.include_router(finance_router)


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "نظام إدارة المشروع الزراعي — رؤية عُمان 2040",
        "version": "1.0.0"
    }
