import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function KpiCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-teal-light">
        <Icon size={20} className="text-teal" />
      </div>
      <div>
        <p className="text-sm text-textSecondary">{label}</p>
        <p className="text-2xl font-black mt-0.5 text-ink">{value}</p>
        {sub && <p className="text-xs mt-1 text-textSecondary">{sub}</p>}
      </div>
    </div>
  );
}

export function ProgressRing({ percent, size = 84, stroke = 8, color = '#16707A' }: { percent: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E4DD" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fontSize={size * 0.2} fontWeight="700" fill="#14213D">{percent}%</text>
    </svg>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'info' | 'warn' }) {
  const tones = { neutral: { background: '#F3ECDC', color: '#7A5E2E' }, good: { background: '#E7F0E4', color: '#33633B' }, info: { background: '#E1EFF0', color: '#16707A' }, warn: { background: '#FBEAE2', color: '#B5470E' } };
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold" style={tones[tone]}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-xs font-bold tracking-wide mb-1 text-teal">{eyebrow}</p>}
      <h2 className="text-2xl font-black text-ink font-kufi">{title}</h2>
      {desc && <p className="text-sm mt-1.5 max-w-2xl text-textSecondary">{desc}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-ink font-kufi">{title}</h3>
          <button onClick={onClose} className="text-textSecondary hover:text-ink text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal" /></div>;
}
