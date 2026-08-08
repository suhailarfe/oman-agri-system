import FadeIn from "./FadeIn";
import ContactButton from "./ContactButton";
import Magnet from "./Magnet";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col overflow-x-clip">
      <FadeIn delay={0} y={-20} className="z-50">
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {["عن المبادرة", "المناطق", "الخدمات", "المشاريع", "تواصل"].map((link, i) => (
            <a key={i} href={`#${link}`} className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200">{link}</a>
          ))}
        </nav>
      </FadeIn>
      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5">رؤية عُمان 2040</h1>
        </FadeIn>
      </div>
      <div className="mt-auto flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}>
            أرض الخير والنماء<br />مزارع خضراء<br />وأمن غذائي مستدام
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><ContactButton /></FadeIn>
      </div>
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
          <img src="https://images.unsplash.com/photo-1599940824399-b0e38efb7d73?w=800&q=80" alt="واحة عُمانية" className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] object-cover rounded-t-full" style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }} />
        </Magnet>
      </FadeIn>
    </section>
  );
}