export interface Farm { id:number; name:string; regionId:number; regionName:string; areaHa:number; irrigationSystem:string; status:string; crops:string; waterConsumptionDaily:number; establishedYear:number }
export const farms: Farm[] = [
  { id:1, name:'مزرعة النجد النموذجية', regionId:1, regionName:'النجد', areaHa:100, irrigationSystem:'ري محوري', status:'منتج', crops:'قمح، أعلاف', waterConsumptionDaily:500, establishedYear:2025 },
  { id:2, name:'مزرعة الباطنة للخضروات', regionId:2, regionName:'سهل الباطنة', areaHa:45, irrigationSystem:'ري بالتنقيط', status:'منتج', crops:'طماطم، خيار', waterConsumptionDaily:180, establishedYear:2024 },
  { id:3, name:'مزرعة ظفار للنخيل', regionId:1, regionName:'النجد', areaHa:200, irrigationSystem:'ري بالتنقيط', status:'قيد الإنشاء', crops:'نخيل', waterConsumptionDaily:800, establishedYear:2026 },
  { id:4, name:'مزرعة الظاهرة', regionId:3, regionName:'الظاهرة', areaHa:50, irrigationSystem:'زراعة مائية', status:'قيد التخطيط', crops:'نباتات طبية', waterConsumptionDaily:120, establishedYear:2027 },
]
export const waterSolutions = [
  { name:'تحلية بالطاقة الشمسية', cost:'عالية', capacity:'500 م³/يوم', status:'نشط' },
  { name:'مياه صرف معالجة', cost:'متوسطة', capacity:'300 م³/يوم', status:'نشط' },
  { name:'حصاد الضباب', cost:'منخفضة', capacity:'50 م³/يوم', status:'تجريبي' },
  { name:'ري بالتنقيط', cost:'منخفضة', capacity:'توفير 60%', status:'نشط' },
  { name:'ري محوري', cost:'متوسطة', capacity:'كفاءة 90%', status:'نشط' },
]
export const seedSources = [
  { name:'مركز موارد عُمان', type:'بنك جيني حكومي', records:'17,623+ سجل', status:'نشط' },
  { name:'Baker Creek', type:'بذور متوارثة', records:'1,000+ صنف', status:'نشط' },
  { name:'ICARDA', type:'أبحاث الجفاف', records:'دولي', status:'نشط' },
  { name:'Seed Savers Exchange', type:'غير ربحية', records:'20,000+ صنف', status:'نشط' },
]