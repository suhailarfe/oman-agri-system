/*
 * صفحة خارطة الطريق: جدول زمني تفاعلي يعرض مراحل التطور الاستراتيجي للمنصة والأمن الغذائي حتى 2040.
 */
import { ArrowRight, Calendar, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export default function RoadmapPage() {
  const roadmapMilestones = [
    {
      phase: "المرحلة الأولى: التأسيس والبنية التحتية",
      timeline: "الربع الأول - الربع الثاني 2026",
      status: "مكتمل",
      progress: 100,
      description: "إطلاق النواة الأولى للمنصة، ربط قواعد البيانات الدائمة (MySQL)، إدراج خريطة المناطق الزراعية ومحطات الري الرئيسية.",
      keyDeliverables: ["ربط قاعدة البيانات الدائمة", "إطلاق الخريطة التفاعلية الإقليمية", "اعتماد الهوية المؤسسية (سجلّ الواحة المعاصر)"]
    },
    {
      phase: "المرحلة الثانية: حوسبة الاستثمار وعقود الشراكة الرقمية",
      timeline: "الربع الثالث - الربع الرابع 2026",
      status: "قيد التنفيذ النشط",
      progress: 68,
      description: "تطوير لوحة تحكم المستثمرين، حاسبة العوائد المالية المتوقعة، إدخال التوقيع الرقمي المعتمد ورمز التحقق (QR Code).",
      keyDeliverables: ["لوحة تحكم المستثمرين وحاسبة العوائد", "نظام العقود الرقمية ورمز QR Code", "تصدير تقارير الجدوى بصيغة PDF و Excel"]
    },
    {
      phase: "المرحلة الثالثة: الربط الحي لحساسات الطقس والمياه",
      timeline: "2027 - 2030",
      status: "مخطط استراتيجي",
      progress: 30,
      description: "توسيع شبكة الاستشعار الميداني لربط درجات الحرارة والرطوبة ومستويات الملوحة بالمنصة بشكل حي ولحظي.",
      keyDeliverables: ["ربط مباشر بمحطات الأرصاد العُمانية", "تنبيهات تلقائية عند تجاوز حدود الملوحة الآمنة", "عروض بانورامية ثلاثية الأبعاد لكل حقل"]
    },
    {
      phase: "المرحلة الرابعة: التكامل الشامل والوصول لاستهداف 2040",
      timeline: "2031 - 2040",
      status: "رؤية مستقبلية",
      progress: 5,
      description: "تحقيق مستهدفات الاكتفاء الذاتي الاستراتيجي لسلطنة عُمان (80-90%+) وتوظيف الذكاء الاصطناعي الكامل في التنبؤ الزراعي.",
      keyDeliverables: ["الوصول لاكتفاء ذاتي استراتيجي بنسبة 90%+", "أتمتة كاملة لإدارة الآبار والري المحوري", "منصة تصدير وتسويق عالمية للمنتجات العُمانية"]
    }
  ];

  return (
    <div className="site-shell bg-paper min-h-screen text-ink" dir="rtl">
      <header className="site-header site-header--scrolled bg-white/90 backdrop-blur-md border-b border-line px-8 py-4 flex justify-between items-center">
        <a className="brand flex items-center gap-3" href="/">
          <span className="brand-copy">
            <strong className="text-falaj-deep font-kufi">خارطة طريق الاستثمار والأمن الغذائي</strong>
            <small className="text-muted text-[11px]">رؤية عُمان 2040</small>
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs font-bold text-falaj hover:underline flex items-center gap-1">
            العودة للرئيسية <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main className="page-pad py-24 max-w-5xl mx-auto px-6">
        <div className="bg-white border border-line rounded-3xl p-8 md:p-12 shadow-sm mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-falaj/10 text-falaj px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-falaj/20">
            <TrendingUp size={14} /> المسار الزمني الاستراتيجي للمنصة
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi mb-4">خارطة طريق واحات ومزارع عُمان 2040</h1>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            تعرض هذه الصفحة الجدول الزمني والتنفيذي لتطور المنصة الاستثمارية والزراعية، مصممة خصيصاً لتوضيح مراحل الإنجاز والنمو للمستثمرين والجهات المعنية.
          </p>
        </div>

        {/* الجدول الزمني التفاعلي (Timeline) */}
        <div className="space-y-6 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-falaj/20">
          {roadmapMilestones.map((item, idx) => (
            <div key={idx} className="relative pr-12">
              {/* نقطة العلامة */}
              <div className="absolute right-3.5 top-1.5 w-5 h-5 rounded-full bg-falaj border-4 border-white shadow-md flex items-center justify-center"></div>

              <div className="bg-white border border-line rounded-3xl p-6 md:p-8 shadow-sm hover:border-falaj/40 transition-all">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <span className="bg-falaj/10 text-falaj text-xs font-bold px-3 py-1 rounded-full border border-falaj/20 flex items-center gap-1">
                    <Calendar size={13} /> {item.timeline}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                    item.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                    item.status === 'قيد التنفيذ النشط' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Clock size={13} /> {item.status}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-falaj-deep font-kufi mb-2">{item.phase}</h3>
                <p className="text-xs text-muted mb-4 leading-relaxed">{item.description}</p>

                <div className="mb-4 rounded-xl border border-line bg-paper p-4">
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-bold text-falaj-deep">نسبة الإنجاز الحالية</span>
                    <span className="font-mono font-bold text-falaj">{item.progress}%</span>
                  </div>
                  <div
                    className="h-2.5 overflow-hidden rounded-full bg-stone-200"
                    role="progressbar"
                    aria-label={`نسبة إنجاز ${item.phase}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.progress}
                  >
                    <div className="h-full rounded-full bg-falaj transition-[width] duration-150 ease-out" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>

                <div className="bg-paper p-4 rounded-xl border border-line">
                  <span className="text-[11px] font-bold text-falaj-deep block mb-2">المنجزات والمستهدفات الرئيسية:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {item.keyDeliverables.map((deliv, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-ink bg-white p-2.5 rounded-lg border border-line">
                        <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
