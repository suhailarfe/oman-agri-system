import { Sun, Building2, Wind, Droplets, Sprout } from 'lucide-react'
export const farms = [
  { name:'مزرعة النجد النموذجية', region:'النجد', area:100, irr:'ري محوري (Pivot)', status:'منتج', crops:'قمح، أعلاف', water:500, year:2025 },
  { name:'مزرعة الباطنة للخضروات', region:'سهل الباطنة', area:45, irr:'ري بالتنقيط', status:'منتج', crops:'طماطم، خيار، فلفل', water:180, year:2024 },
  { name:'مزرعة ظفار للنخيل', region:'النجد', area:200, irr:'ري بالتنقيط', status:'قيد الإنشاء', crops:'نخيل (مليون نخلة)', water:800, year:2026 },
  { name:'مزرعة الظاهرة التجريبية', region:'الظاهرة', area:50, irr:'زراعة مائية', status:'قيد التخطيط', crops:'نباتات طبية وعطرية', water:120, year:2027 },
]
export const waterSolutions = [
  { name:'تحلية بالطاقة الشمسية', cost:'عالية', cap:'500 م³/يوم', status:'نشط', icon:Sun },
  { name:'مياه صرف معالجة', cost:'متوسطة', cap:'300 م³/يوم', status:'نشط', icon:Building2 },
  { name:'حصاد الضباب', cost:'منخفضة', cap:'50 م³/يوم', status:'تجريبي', icon:Wind },
  { name:'ري بالتنقيط', cost:'منخفضة', cap:'توفير 60%', status:'نشط', icon:Droplets },
  { name:'ري محوري', cost:'متوسطة', cap:'كفاءة 90%', status:'نشط', icon:Sprout },
]
export const costData = {
  setup: [{ item:'تجهيز الأرض', amt:15000 },{ item:'حفر الآبار', amt:40000 },{ item:'محطة شمسية', amt:80000 },{ item:'أنظمة الري', amt:55000 },{ item:'مبانٍ ومخازن', amt:25000 },{ item:'معدات زراعية', amt:60000 }],
  ops: [{ item:'بذور طبيعية', amt:8000 },{ item:'أسمدة عضوية', amt:12000 },{ item:'أجور عمالة', amt:15000 },{ item:'صيانة وتشغيل', amt:5000 }]
}