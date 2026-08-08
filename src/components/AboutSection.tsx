import FadeIn from "./FadeIn";
import AnimatedText from "./AnimatedText";
import ContactButton from "./ContactButton";

export default function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Qaboos_bin_Said_%282013%29.jpg/330px-Qaboos_bin_Said_%282013%29.jpg" alt="السلطان قابوس بن سعيد" className="absolute w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%] rounded-2xl object-cover opacity-80" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
        <img src="https://images.unsplash.com/photo-1599940824399-b0e38efb7d73?w=400&q=80" alt="نخيل عُماني" className="absolute w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] rounded-2xl object-cover opacity-70" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Haitham_bin_Tariq_Al_Said_in_2024.jpg/330px-Haitham_bin_Tariq_Al_Said_in_2024.jpg" alt="السلطان هيثم بن طارق" className="absolute w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%] rounded-2xl object-cover opacity-80" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
        <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80" alt="واحة عُمانية" className="absolute w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] rounded-2xl object-cover opacity-70" />
      </FadeIn>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>عن المبادرة</h2>
      </FadeIn>
      <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 mt-10 sm:mt-14 md:mt-16">
        <AnimatedText
          text="انطلاقاً من رؤية عُمان 2040، نعمل على دعم المزارع والواحات العُمانية وتعزيز الاكتفاء الذاتي. نؤمن بأن الزراعة المستدامة هي مفتاح مستقبل مشرق لعُمان. معاً نبني أرض الخير والنماء."
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />
        <ContactButton />
      </div>
    </section>
  );
}