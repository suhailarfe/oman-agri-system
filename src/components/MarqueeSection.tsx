import { useEffect, useRef, useState } from "react";

const FARM_IMAGES = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
  "https://images.unsplash.com/photo-1599940824399-b0e38efb7d73?w=800&q=80",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80",
  "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80",
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&q=80",
  "https://images.unsplash.com/photo-1607419722218-3e9a5cc336ff?w=800&q=80",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
  "https://images.unsplash.com/photo-1586771107445-b3ea888603ce?w=800&q=80",
  "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  "https://images.unsplash.com/photo-1599940824399-b0e38efb7d73?w=800&q=80",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
  "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80",
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&q=80",
];

const ROW1 = FARM_IMAGES.slice(0, 11);
const ROW2 = FARM_IMAGES.slice(11);

export default function MarqueeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      setOffset((window.scrollY - ref.current.offsetTop + window.innerHeight) * 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r1 = [...ROW1, ...ROW1, ...ROW1];
  const r2 = [...ROW2, ...ROW2, ...ROW2];

  return (
    <section ref={ref} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex gap-3 mb-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: "transform" }}>
        {r1.map((src, i) => <img key={i} src={src} alt={`مزرعة ${i+1}`} loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0" />)}
      </div>
      <div className="flex gap-3" style={{ transform: `translateX(-${offset - 200}px)`, willChange: "transform" }}>
        {r2.map((src, i) => <img key={i} src={src} alt={`واحة ${i+1}`} loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0" />)}
      </div>
    </section>
  );
}