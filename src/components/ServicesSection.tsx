import FadeIn from "./FadeIn";

const SERVICES = [
  { num: "01", title: "المناطق الزراعية الواعدة", desc: "5 مناطق رئيسية: النجد (ظفار) — 40 ألف كم² للقمح والنخيل، سهل الباطنة — للخضروات والحمضيات، محافظة الظاهرة — للنخيل والمحاصيل الحقلية، المنطقة الوسطى — للزراعة الصحراوية، والجبل الأخضر — للرمان والورد." },
  { num: "02", title: "حلول المياه المبتكرة", desc: "6 حلول: تحلية المياه بالطاقة الشمسية، معالجة مياه الصرف الصحي الثلاثية، حصاد الضباب في جبال ظفار، أنظمة الري بالتنقيط والري المحوري، حصاد مياه الأمطار في الوديان، استكشاف الخزانات الجوفية العميقة." },
  { num: "03", title: "البذور الطبيعية Non-GMO", desc: "6 مصادر موثوقة: مركز موارد عُمان (17,623 سجل)، Baker Creek Heirloom (1000+ صنف)، ICARDA للأراضي الجافة، Seed Savers Exchange (20,000+ صنف)، The Living Seed Company، و ACSAD. مع إنشاء بنك بذور داخلي لتخفيض التكلفة إلى الصفر بحلول السنة الثالثة." },
  { num: "04", title: "النظام البرمجي المتكامل", desc: "قاعدة بيانات SQL من 7 جداول مترابطة: المناطق، مصادر البذور، المحاصيل، المزارع، دورات الزراعة، سجلات الحصاد، تكاليف المشروع. مع نظام صلاحيات (Admin / Farmer / Supplier) ولوحة تقارير وتحليلات." },
  { num: "05", title: "دراسة الجدوى والتكلفة", desc: "تكلفة تأسيسية: 275,000 ريال عُماني. تكلفة تشغيلية موسمية: 40,000 ريال. إجمالي بدء المشروع: 315,000 ريال (~819,000$). خطة تنفيذ من 4 مراحل خلال 12 شهراً لنموذج مزرعة 100 هكتار في النجد." },
];

export default function ServicesSection() {
  return (
    <section className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>المنظومة</h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="flex items-start gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12" style={{ borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(12, 12, 12, 0.15)" : "none" }}>
              <span className="text-[#0C0C0C] font-black flex-shrink-0 leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>{s.num}</span>
              <div className="flex flex-col gap-1 pt-2">
                <h3 className="text-[#0C0C0C] font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>{s.title}</h3>
                <p className="text-[#0C0C0C] font-light leading-relaxed max-w-2xl opacity-60" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}>{s.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}