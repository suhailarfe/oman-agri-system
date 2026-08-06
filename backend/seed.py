from database import get_database
from datetime import datetime
from bson import ObjectId
from middleware.auth import hash_password

async def seed_database(force: bool = False):
    """Populate database with initial data matching the proposal document."""
    db = get_database()
    existing = await db.regions.count_documents({})
    if existing > 0 and not force:
        print(f"Database already has {existing} regions, skipping seed.")
        return
    print("🌱 Seeding database...")
    users = [
        {"username": "admin", "email": "admin@omanagri.om", "display_name": "مدير النظام", "role": "admin", "hashed_password": hash_password("admin123"), "is_active": True, "created_at": datetime.utcnow()},
        {"username": "farmer1", "email": "farmer1@omanagri.om", "display_name": "المشغّل الميداني — النجد", "role": "farmer", "hashed_password": hash_password("farmer123"), "is_active": True, "created_at": datetime.utcnow()},
        {"username": "supplier1", "email": "supplier1@omanagri.om", "display_name": "مورد البذور الطبيعية", "role": "supplier", "hashed_password": hash_password("supplier123"), "is_active": True, "created_at": datetime.utcnow()},
    ]
    user_map = {}
    for u in users:
        existing_user = await db.users.find_one({"username": u["username"]})
        if not existing_user:
            result = await db.users.insert_one(u)
            user_map[u["username"]] = str(result.inserted_id)
        else:
            user_map[u["username"]] = str(existing_user["_id"])
    print(f"  ✓ {len(users)} users")
    regions_data = [
        {"name": "النجد", "governorate": "محافظة ظفار", "climate_type": "شبه جاف، معتدل نسبياً في الخريف", "soil_type": "رملية طمية خصبة", "water_source": "خزان جوفي كبير، تحلية شمسية، حصاد ضباب", "total_area_ha": 4000000, "crops": ["القمح", "الشعير", "الذرة", "النخيل", "الأعلاف", "اللبان", "البطيخ", "الشمام"], "color": "#33633B"},
        {"name": "سهل الباطنة", "governorate": "شمال / جنوب الباطنة", "climate_type": "حار ورطب", "soil_type": "رسوبية طينية رملية", "water_source": "تملّح جوفي، مياه صرف صحي معالجة", "crops": ["طماطم", "خيار", "فلفل", "ليمون", "برتقال", "مانجو", "نخيل"], "color": "#16707A"},
        {"name": "محافظة الظاهرة", "governorate": "الظاهرة", "climate_type": "صحراوي جاف", "soil_type": "رملية فقيرة عضوياً", "water_source": "مياه جوفية، زراعة مائية", "crops": ["النخيل", "الشعير", "الذرة", "نباتات طبية وعطرية"], "color": "#B99A5B"},
        {"name": "المنطقة الوسطى", "governorate": "محافظة الوسطى", "climate_type": "صحراوي جاف وحار", "soil_type": "رملية، قد تكون مالحة", "water_source": "مياه جوفية محدودة", "crops": ["محاصيل ملحية", "نباتات رعوية", "زراعة مائية"], "color": "#B5470E"},
        {"name": "الجبل الأخضر", "governorate": "الداخلية", "climate_type": "معتدل صيفاً", "soil_type": "جبلية خصبة", "water_source": "أمطار وأفلاج، حصاد مياه الأمطار", "crops": ["الرمان", "الورد", "الجوز", "اللوز", "العنب", "الخوخ"], "color": "#2C4A73"},
    ]
    region_map = {}
    for r in regions_data:
        r["created_at"] = datetime.utcnow()
        result = await db.regions.insert_one(r)
        region_map[r["name"]] = str(result.inserted_id)
    print(f"  ✓ {len(regions_data)} regions")
    seed_sources_data = [
        {"source_name": "مركز عُمان للموارد الوراثية الحيوانية والنباتية (OAPRC)", "source_type": "بنك جيني حكومي", "country": "سلطنة عُمان", "is_non_gmo": True, "is_organic": True, "website": "www.oaprc.gov.om", "verified_real": True},
        {"source_name": "Baker Creek Heirloom Seeds", "source_type": "بذور متوارثة", "country": "الولايات المتحدة", "is_non_gmo": True, "website": "www.rareseeds.com", "verified_real": True},
        {"source_name": "ICARDA", "source_type": "بذور علمية لمناطق جافة", "country": "المغرب / لبنان", "is_non_gmo": True, "website": "www.icarda.org", "verified_real": True},
        {"source_name": "Seed Savers Exchange", "source_type": "منظمة غير ربحية", "country": "الولايات المتحدة", "is_non_gmo": True, "website": "www.seedsavers.org", "verified_real": True},
        {"source_name": "The Living Seed Company", "source_type": "بذور عضوية مفتوحة", "country": "الولايات المتحدة", "is_non_gmo": True, "is_organic": True, "website": "www.livingseedcompany.com", "verified_real": True},
        {"source_name": "ACSAD", "source_type": "بنك جيني عربي", "country": "الأردن", "is_non_gmo": True, "website": "www.acsad.org", "verified_real": True},
    ]
    seed_source_map = {}
    for s in seed_sources_data:
        result = await db.seed_sources.insert_one(s)
        seed_source_map[s["source_name"]] = str(result.inserted_id)
    print(f"  ✓ {len(seed_sources_data)} seed sources")
    oaprc_id = seed_source_map["مركز عُمان للموارد الوراثية الحيوانية والنباتية (OAPRC)"]
    baker_id = seed_source_map["Baker Creek Heirloom Seeds"]
    icarda_id = seed_source_map["ICARDA"]
    crops_data = [
        {"seed_source_id": oaprc_id, "name_ar": "القمح", "crop_type": "حبوب", "water_req_l_per_kg": 1300, "drought_tolerance": "متوسطة", "growth_cycle_days": 120},
        {"seed_source_id": oaprc_id, "name_ar": "الشعير", "crop_type": "حبوب", "water_req_l_per_kg": 1100, "drought_tolerance": "عالية", "growth_cycle_days": 100},
        {"seed_source_id": oaprc_id, "name_ar": "الذرة", "crop_type": "حبوب", "water_req_l_per_kg": 1200, "drought_tolerance": "متوسطة", "growth_cycle_days": 90},
        {"seed_source_id": oaprc_id, "name_ar": "النخيل", "crop_type": "فاكهة", "water_req_l_per_kg": 2500, "drought_tolerance": "عالية"},
        {"seed_source_id": oaprc_id, "name_ar": "الأعلاف", "crop_type": "أعلاف", "water_req_l_per_kg": 900, "drought_tolerance": "متوسطة", "growth_cycle_days": 60},
        {"seed_source_id": oaprc_id, "name_ar": "اللبان", "crop_type": "اقتصادي", "water_req_l_per_kg": 400, "drought_tolerance": "عالية"},
        {"seed_source_id": oaprc_id, "name_ar": "البطيخ", "crop_type": "فاكهة", "water_req_l_per_kg": 235, "drought_tolerance": "منخفضة", "growth_cycle_days": 80},
        {"seed_source_id": oaprc_id, "name_ar": "الشمام", "crop_type": "فاكهة", "water_req_l_per_kg": 250, "drought_tolerance": "منخفضة", "growth_cycle_days": 75},
        {"seed_source_id": baker_id, "name_ar": "طماطم", "crop_type": "خضروات", "water_req_l_per_kg": 214, "drought_tolerance": "منخفضة", "growth_cycle_days": 70},
        {"seed_source_id": baker_id, "name_ar": "خيار", "crop_type": "خضروات", "water_req_l_per_kg": 353, "drought_tolerance": "منخفضة", "growth_cycle_days": 55},
        {"seed_source_id": icarda_id, "name_ar": "نباتات طبية وعطرية", "crop_type": "اقتصادي", "water_req_l_per_kg": 500, "drought_tolerance": "عالية"},
    ]
    crop_map = {}
    for c in crops_data:
        result = await db.crops.insert_one(c)
        crop_map[c["name_ar"]] = str(result.inserted_id)
    print(f"  ✓ {len(crops_data)} crops")
    farm_data = {"region_id": region_map["النجد"], "farm_name": "المزرعة النموذجية — النجد", "area_ha": 100, "irrigation_system": "ري محوري (Pivot)", "status": "قيد التنفيذ", "coordinates": {"lat": 17.05, "lng": 54.15}, "managed_by_user_id": user_map["farmer1"], "created_at": datetime.utcnow()}
    farm_result = await db.farms.insert_one(farm_data)
    farm_id = str(farm_result.inserted_id)
    print(f"  ✓ 1 farm: المزرعة النموذجية — النجد")
    plantings_data = [
        {"farm_id": farm_id, "crop_id": crop_map["القمح"], "planted_area_ha": 40, "planting_date": datetime(2026, 11, 1), "expected_harvest": datetime(2027, 3, 1), "seed_qty_kg": 4000, "season": "شتوي"},
        {"farm_id": farm_id, "crop_id": crop_map["الأعلاف"], "planted_area_ha": 35, "planting_date": datetime(2026, 10, 15), "expected_harvest": datetime(2027, 2, 15), "seed_qty_kg": 1750, "season": "شتوي"},
        {"farm_id": farm_id, "crop_id": crop_map["النخيل"], "planted_area_ha": 15, "planting_date": datetime(2026, 9, 1), "expected_harvest": None, "season": "دائم"},
    ]
    planting_map = {}
    for p in plantings_data:
        result = await db.plantings.insert_one(p)
        crop = await db.crops.find_one({"_id": ObjectId(p["crop_id"])})
        if crop:
            planting_map[crop["name_ar"]] = str(result.inserted_id)
    print(f"  ✓ {len(plantings_data)} plantings")
    harvests_data = [
        {"planting_id": planting_map.get("القمح", ""), "harvest_date": datetime(2027, 3, 1), "yield_tons": 72, "quality_grade": "ممتاز", "seeds_saved_kg": 400, "revenue_omr": 21600},
        {"planting_id": planting_map.get("الأعلاف", ""), "harvest_date": datetime(2027, 2, 15), "yield_tons": 420, "quality_grade": "جيد جداً", "seeds_saved_kg": 0, "revenue_omr": 37800},
        {"planting_id": planting_map.get("النخيل", ""), "harvest_date": None, "yield_tons": 0, "seeds_saved_kg": 0, "revenue_omr": 8000},
    ]
    for h in harvests_data:
        if h["planting_id"]:
            await db.harvests.insert_one(h)
    print(f"  ✓ {len(harvests_data)} harvests")
    costs_data = [
        {"farm_id": farm_id, "category": "تجهيز الأرض وتسويتها", "amount_omr": 15000, "incurred_date": datetime(2026, 8, 1), "is_recurring": False},
        {"farm_id": farm_id, "category": "حفر الآبار", "amount_omr": 40000, "incurred_date": datetime(2026, 8, 15), "is_recurring": False},
        {"farm_id": farm_id, "category": "طاقة شمسية وتحلية", "amount_omr": 80000, "incurred_date": datetime(2026, 9, 1), "is_recurring": False},
        {"farm_id": farm_id, "category": "أنظمة الري المحوري", "amount_omr": 55000, "incurred_date": datetime(2026, 9, 15), "is_recurring": False},
        {"farm_id": farm_id, "category": "مبانٍ ومخازن", "amount_omr": 25000, "incurred_date": datetime(2026, 10, 1), "is_recurring": False},
        {"farm_id": farm_id, "category": "معدات وآليات", "amount_omr": 60000, "incurred_date": datetime(2026, 10, 1), "is_recurring": False},
        {"farm_id": farm_id, "category": "بذور طبيعية", "amount_omr": 8000, "incurred_date": datetime(2026, 10, 15), "is_recurring": True},
        {"farm_id": farm_id, "category": "أسمدة عضوية", "amount_omr": 12000, "incurred_date": datetime(2026, 10, 15), "is_recurring": True},
        {"farm_id": farm_id, "category": "أجور عمالة", "amount_omr": 15000, "incurred_date": datetime(2027, 1, 1), "is_recurring": True},
        {"farm_id": farm_id, "category": "صيانة وتشغيل", "amount_omr": 5000, "incurred_date": datetime(2027, 1, 1), "is_recurring": True},
    ]
    for c in costs_data:
        await db.costs.insert_one(c)
    print(f"  ✓ {len(costs_data)} costs")
    print("✅ Database seeding complete!")
