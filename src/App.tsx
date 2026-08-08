import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";

function ContactFooter() {
  return (
    <footer id="contact-footer" className="bg-[#0C0C0C] border-t border-[#D7E2EA]/20 px-5 sm:px-8 md:px-10 py-16 sm:py-20 text-center">
      <h2 className="hero-heading font-black uppercase text-center mb-10" style={{ fontSize: "clamp(2rem, 8vw, 80px)" }}>تواصل معنا</h2>
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        <a href="mailto:suhailarfe@gmail.com" className="text-[#D7E2EA] text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          suhailarfe@gmail.com
        </a>
        <a href="tel:+967736986271" className="text-[#D7E2EA] text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          00967736986271
        </a>
        <p className="text-[#D7E2EA]/50 text-sm mt-4">
          إعداد: سهيل عارف قائد أحمد الحكيمي — 2025/2026م
        </p>
        <p className="text-[#D7E2EA]/30 text-xs mt-2">
          🇴🇲 رؤية عُمان 2040 — الأمن الغذائي والزراعي
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main style={{ overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactFooter />
    </main>
  );
}