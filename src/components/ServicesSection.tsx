import FadeIn from "./FadeIn";

const SERVICES = [
  { num: "01", title: "الزراعة المستدامة", desc: "تقنيات زراعية حديثة تحافظ على الموارد الطبيعية وتزيد الإنتاجية، مناسبة للمناخ العُماني والتربة المحلية لتحقيق الاكتفاء الذاتي." },
  { num: "02", title: "أنظمة الري الحديثة", desc: "حلول ري متطورة تشمل الري بالتنقيط والري الذكي لتوفير المياه وزيادة كفاءة استخدامها في المزارع والواحات العُمانية." },
  { num: "03", title: "تطوير الواحات", desc: "إعادة إحياء الواحات التقليدية وتطويرها باستخدام أحدث الأساليب الزراعية مع الحفاظ على التراث العُماني الأصيل." },
  { num: "04", title: "تسويق المنتجات", desc: "منصات تسويقية مبتكرة لربط المزارعين بالأسواق المحلية والعالمية، وبناء هوية تجارية قوية للمنتجات الزراعية العُمانية." },
  { num: "05", title: "تدريب وتأهيل", desc: "برامج تدريبية شاملة للمزارعين والعاملين في القطاع الزراعي لنقل المعرفة وبناء قدرات وطنية مستدامة." },
];

export default function ServicesSection() {
  return (
    <section className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>خدماتنا</h2>
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