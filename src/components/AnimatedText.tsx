import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

function CharSpan({ char, progress, range }: { char: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span style={{ opacity: 0.2, display: "inline" }}>
        {char === " " ? "\u00A0" : char}
      </span>
      <motion.span style={{ opacity, position: "absolute", left: 0, top: 0 }}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className = "", style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} className={className} style={{ position: "relative", ...style }}>
      {chars.map((char, i) => (
        <CharSpan key={i} char={char} progress={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]} />
      ))}
    </p>
  );
}