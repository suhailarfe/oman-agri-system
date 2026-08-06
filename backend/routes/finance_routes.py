from fastapi import APIRouter, Depends
from middleware.auth import get_current_user
from database import get_database
from bson import ObjectId
from typing import Optional

router = APIRouter(prefix="/api/finance", tags=["الجدوى المالية"])

@router.get("/summary")
async def get_financial_summary(_: dict = Depends(get_current_user), farm_id: Optional[str] = None):
    db = get_database()
    query = {"_id": ObjectId(farm_id)} if farm_id else {}
    farms = await db.farms.find(query).to_list(100)
    farm_ids = [str(f["_id"]) for f in farms]
    cost_query = {"farm_id": {"$in": farm_ids}} if farm_ids else {}
    costs = await db.costs.find(cost_query).to_list(500)
    setup_costs = sum(c["amount_omr"] for c in costs if not c.get("is_recurring", False))
    recurring_costs = sum(c["amount_omr"] for c in costs if c.get("is_recurring", False))
    total_costs = setup_costs + recurring_costs
    cost_by_category = {}
    for c in costs:
        cat = c["category"]
        cost_by_category[cat] = cost_by_category.get(cat, 0) + c["amount_omr"]
    plantings = await db.plantings.find({"farm_id": {"$in": farm_ids}}).to_list(500) if farm_ids else []
    planting_ids = [str(p["_id"]) for p in plantings]
    harvest_query = {"planting_id": {"$in": planting_ids}} if planting_ids else {}
    harvests = await db.harvests.find(harvest_query).to_list(500)
    total_revenue = sum(h.get("revenue_omr", 0) or 0 for h in harvests)
    total_yield = sum(h.get("yield_tons", 0) or 0 for h in harvests)
    seeds_saved = sum(h.get("seeds_saved_kg", 0) or 0 for h in harvests)
    crop_revenues = {}
    for h in harvests:
        planting = next((p for p in plantings if str(p["_id"]) == h.get("planting_id")), None)
        if planting:
            cid = planting.get("crop_id", "")
            crop_revenues[cid] = crop_revenues.get(cid, 0) + (h.get("revenue_omr", 0) or 0)
            crop_revenues[f"{cid}_yield"] = crop_revenues.get(f"{cid}_yield", 0) + (h.get("yield_tons", 0) or 0)
    crop_names = {}
    for cid in set(k for k in crop_revenues if not k.endswith("_yield")):
        crop = await db.crops.find_one({"_id": ObjectId(cid)})
        if crop: crop_names[cid] = crop["name_ar"]
    crop_profitability = [{"crop_id": cid, "crop_name": crop_names.get(cid, "غير معروف"), "revenue": crop_revenues.get(cid, 0), "yield_tons": crop_revenues.get(f"{cid}_yield", 0)} for cid in set(k for k in crop_revenues if not k.endswith("_yield"))]
    discount_rate = 0.08
    cashflow = []
    cumulative = -setup_costs
    cashflow.append({"year": "السنة 0", "cumulative": -setup_costs})
    for yr in range(1, 6):
        rev_factor = min(yr / 5 * 3.4, 3.4)
        year_revenue = total_revenue * rev_factor if total_revenue else 76400 * rev_factor
        year_cost = recurring_costs if recurring_costs else 70000
        net = year_revenue - year_cost
        cumulative += net
        cashflow.append({"year": f"السنة {yr}", "cumulative": round(cumulative, 0)})
    npv = -setup_costs
    for yr in range(1, 6):
        year_revenue = total_revenue * min(yr / 5 * 3.4, 3.4) if total_revenue else 76400 * min(yr / 5 * 3.4, 3.4)
        year_cost = recurring_costs if recurring_costs else 70000
        npv += (year_revenue - year_cost) / ((1 + discount_rate) ** yr)
    payback_years = None
    cum = -setup_costs
    for yr in range(1, 11):
        yr_rev = total_revenue * min(yr / 5 * 3.4, 3.4) if total_revenue else 76400 * min(yr / 5 * 3.4, 3.4)
        yr_cost = recurring_costs if recurring_costs else 70000
        cum += (yr_rev - yr_cost)
        if cum >= 0:
            prev_cum = cum - (yr_rev - yr_cost)
            fraction = abs(prev_cum) / (yr_rev - yr_cost) if (yr_rev - yr_cost) > 0 else 0
            payback_years = round(yr - 1 + fraction, 1)
            break
    irr = round((total_revenue - recurring_costs if recurring_costs else 70000) / setup_costs * 100, 1) if setup_costs > 0 and total_revenue > 0 else None
    seed_save_pct = round(100.0 * seeds_saved / (total_yield * 1000), 2) if total_yield else 0
    self_sufficiency = [{"name": "الأسماك", "value": 146}, {"name": "التمور", "value": 99}, {"name": "الحليب", "value": 96}, {"name": "بيض المائدة", "value": 95}, {"name": "الخضروات", "value": 79}, {"name": "اللحوم البيضاء", "value": 62}, {"name": "اللحوم الحمراء", "value": 45}, {"name": "الفواكه (غير التمور)", "value": 24}]
    base_irr = irr or 13.5
    sensitivity = [{"scenario": "الأساسي", "irr": f"{base_irr}%", "payback": f"{payback_years or 3.6} سنة", "tone": "info"}, {"scenario": "تشاؤمي", "irr": f"{max(1, base_irr * 0.44):.1f}%", "payback": f"{(payback_years or 3.6) * 1.44:.1f} سنة", "tone": "warn"}, {"scenario": "متفائل", "irr": f"{min(25, base_irr * 1.33):.1f}%", "payback": f"{(payback_years or 3.6) * 0.8:.1f} سنة", "tone": "good"}]
    return {"total_setup_costs": round(setup_costs, 3), "total_recurring_costs": round(recurring_costs, 3), "total_costs": round(total_costs, 3), "total_revenue": round(total_revenue, 3), "net_profit": round(total_revenue - total_costs, 3), "total_yield_tons": round(total_yield, 3), "seeds_saved_kg": round(seeds_saved, 2), "seed_save_pct": seed_save_pct, "cost_breakdown": [{"name": k, "value": round(v, 2)} for k, v in cost_by_category.items()], "crop_profitability": crop_profitability, "cashflow": cashflow, "npv": round(npv, 2), "payback_years": payback_years, "irr": irr, "sensitivity": sensitivity, "self_sufficiency": self_sufficiency, "farm_count": len(farms), "harvest_count": len(harvests)}
