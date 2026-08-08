import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveProjectButton from "./LiveProjectButton";

const PROJECTS = [
  { num: "01", category: "منطقة زراعية واعدة", name: "النجد — ظفار", col1Img1: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", col1Img2: "https://images.unsplash.com/photo-1599940824399-b0e38efb7d73?w=800&q=80", col2Img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80", desc: "40 ألف كم² — قمح، نخيل، أعلاف، لبان. خزان جوفي ضخم + تحلية شمسية" },
  { num: "02", category: "منطقة زراعية واعدة", name: "سهل الباطنة", col1Img1: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80", col1Img2: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80", col2Img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80", desc: "خضروات، حمضيات، مانجو، نخيل — مياه صرف معالجة + تحلية" },
  { num: "03", category: "منطقة زراعية واعدة", name: "محافظة الظاهرة", col1Img1: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80", col1Img2: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80", col2Img: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&q=80", desc: "نخيل، محاصيل حقلية، نباتات طبية — زراعة مائية وبيوت محمية" },
];

function ProjectCard({ project, index, totalCards }: { project: typeof PROJECTS[0]; index: number; totalCards: number }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [targetScale, targetScale, 1]);

  return (
    <div ref={container} className="h-[85vh] flex-shrink-0 relative">
      <motion.div style={{ scale, top: `${index * 28}px` }} className="sticky top-24 md:top-32 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>{project.num}</span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/60 font-light uppercase text-sm tracking-wider">{project.category}</span>
              <h3 className="text-[#D7E2EA] font-medium uppercase text-lg sm:text-xl md:text-2xl">{project.name}</h3>
              <p className="text-[#D7E2EA]/50 text-xs sm:text-sm mt-1 max-w-xs leading-relaxed">{project.desc}</p>
            </div>
          </div>
          <LiveProjectButton />
        </div>
        <div className="flex gap-3 sm:gap-4 w-full">
          <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
            <img src={project.col1Img1} alt={`${project.name} 1`} loading="lazy" className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover" style={{ height: "clamp(130px, 16vw, 230px)" }} />
            <img src={project.col1Img2} alt={`${project.name} 2`} loading="lazy" className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover" style={{ height: "clamp(160px, 22vw, 340px)" }} />
          </div>
          <div className="w-[60%]">
            <img src={project.col2Img} alt={`${project.name} 3`} loading="lazy" className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>المناطق</h2>
      <div className="max-w-6xl mx-auto">
        {PROJECTS.map((project, i) => <ProjectCard key={i} project={project} index={i} totalCards={PROJECTS.length} />)}
      </div>
    </section>
  );
}