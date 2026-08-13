/*
 * صفحة تفصيلية مستقلة لكل منطقة زراعية مع مؤشرات الأمن الغذائي الخاصة بها
 */
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, MapPin, Sprout, Droplets, ShieldCheck, BarChart3 } from "lucide-react";

export default function RegionPage() {
  const [match, params] = useRoute("/region/:code");
  const code = params?.code || "najd";

  const { data: regionsData, isLoading } = trpc.agri.getRegions.useQuery();
  const region = regionsData?.find((r) => r.code === code) || regionsData?.[0];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink">جاري تحميل بيانات المنطقة...</div>;
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6">
        <h2>عذراً، لم يتم العثور على المنطقة المطلوبة.</h2>
        <a href="/" className="primary-button mt-4">العودة للرئيسية</a>
      </div>
    );
  }

  // مؤشرات أمن غذائي مخصصة لكل منطقة استناداً إلى ملف الـ PDF
  const regionalFoodSecurity: Record<string, { selfSufficiency: string; target2040: string; strategicCrops: string[]; waterEfficiency: string }> = {
    najd: { selfSufficiency: "38%", target2040: "80%+", strategicCrops: ["القمح الصلب الاستراتيجي", "اللبان العُماني النقي", "الأعلاف الخضراء المرشدة"], waterEfficiency: "توفير مائي 45% عبر الري المحوري" },
    batinah: { selfSufficiency: "62%", target2040: "90%", strategicCrops: ["الحمضيات المحلية", "الخضروات المحمية الطازجة", "المانجو العُماني"], waterEfficiency: "استخدام مياه معالجة ثلاثياً وحصاد سدود" },
    dhahirah: { selfSufficiency: "54%", target2040: "85%", strategicCrops: ["النخيل والتمور الفاخرة", "المحاصيل الحقلية الجافة"], waterEfficiency: "زراعة مائية مغلقة (Hydroponics)" },
    wusta: { selfSufficiency: "25%", target2040: "75%", strategicCrops: ["أعلاف صحراوية مقاومة للملوحة", "نباتات الزيوت الحيوية"], waterEfficiency: "تحلية شمسية وآبار عميقة متطورة" },
    jabal: { selfSufficiency: "88%", target2040: "98%", strategicCrops: ["الرمان الجبلي الفاخر", "الورد الجبلي العطري", "الجوز والخوخ"], waterEfficiency: "أفلاج تقليدية مطورة بحساسات رطوبة ذكية" },
  };

  const currentSecurity = regionalFoodSecurity[region.code] || regionalFoodSecurity.najd;

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>ملف الأمن الغذائي الإقليمي</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24">
        <div className="max-w-4xl mx-auto bg-white border border-line rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 text-copper mb-4">
            <MapPin size={22} />
            <span className="text-sm font-bold tracking-wider">المنطقة الاستراتيجية {region.number}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi mb-4">{region.name}</h1>
          <p className="text-muted text-lg mb-8">{region.area} | المشرف المعتمد: <b>{region.supervisor}</b></p>

          {/* قسم مؤشرات الأمن الغذائي الخاصة بالمنطقة */}
          <div className="mb-10 p-6 rounded-2xl bg-falaj-soft border border-falaj/30">
            <div className="flex items-center gap-2 text-falaj mb-4">
              <ShieldCheck size={24} />
              <h3 className="text-lg font-bold font-kufi">مؤشرات الأمن الغذائي الخاصة بهذه المنطقة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">نسبة الاكتفاء الذاتي الحالي</span>
                <strong className="text-2xl font-kufi text-falaj">{currentSecurity.selfSufficiency}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">مستهدف الاكتفاء 2040</span>
                <strong className="text-2xl font-kufi text-copper">{currentSecurity.target2040}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">كفاءة ترشيد المياه</span>
                <strong className="text-sm font-bold text-ink">{currentSecurity.waterEfficiency}</strong>
              </div>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">المحاصيل الاستراتيجية المركزة:</span>
              <div className="flex gap-2 flex-wrap mt-2">
                {currentSecurity.strategicCrops.map((crop, idx) => (
                  <span key={idx} className="bg-white text-falaj px-3 py-1 rounded-full text-xs font-bold border border-falaj/20">
                    🌾 {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-paper border border-line">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Sprout size={20} />
                <strong>المحاصيل والإنتاج</strong>
              </div>
              <p className="text-ink text-base">{region.crop}</p>
            </div>
            <div className="p-6 rounded-2xl bg-paper border border-line">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Droplets size={20} />
                <strong>موارد وأنظمة الري</strong>
              </div>
              <p className="text-ink text-base">{region.water} ({region.irrigationSystem})</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-falaj-deep mb-3 font-kufi">التحليل الاستراتيجي وخطة 2040</h3>
            <p className="text-ink leading-relaxed text-base mb-4">{region.description}</p>
            <p className="text-ink leading-relaxed text-base">{region.details}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-falaj-soft border border-line mb-8 text-center">
            <div>
              <span className="block text-xs text-muted mb-1">الاستثمار المقدر</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.investment}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">السعة المكانية</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.capacity}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">معدل الاستدامة</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.sustainability}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-line">
            <span className="text-xs text-muted">الحالة التشغيلية: {region.status}</span>
            <a href="/" className="primary-button">استعراض الخريطة الكاملة</a>
          </div>
        </div>
      </main>
    </div>
  );
}
