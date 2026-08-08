import { useRef, useState, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "translate3d(0,0,0)",
    transition: inactiveTransition,
    willChange: "transform",
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance < padding) {
      setStyle({
        transform: `translate3d(${distX / strength}px, ${distY / strength}px, 0)`,
        transition: activeTransition,
        willChange: "transform",
      });
    } else {
      setStyle({
        transform: "translate3d(0,0,0)",
        transition: inactiveTransition,
        willChange: "transform",
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "translate3d(0,0,0)",
      transition: inactiveTransition,
      willChange: "transform",
    });
  };

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
}