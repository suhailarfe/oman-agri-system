import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { financeApi } from '../services/api';
import { KpiCard, ProgressRing, SectionTitle } from '../components/UI';
import { MapPin, TrendingUp, Wallet, Sprout } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const C = { teal: '#16707A', green: '#33633B', sand: '#B99A5B', rust: '#B5470E', inkLight: '#2C4A73' };

function PivotFieldsHero() {
  const circles = [{ cx: 70, cy: 65, r: 26 }, { cx: 145, cy: 45, r: 19 }, { cx: 205, cy: 85, r: 30 }, { cx: 285, cy: 55, r: 23 }, { cx: 115, cy: 135, r: 21 }, { cx: 195, cy: 145, r: 28 }, { cx: 265, cy: 125, r: 17 }, { cx: 335, cy: 105, r: 25 }];
  return (
    <svg viewBox="0 0 400 210" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="210" fill="#DCC48A" />
      {circles.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="#33633B" opacity={0.65 + (i % 3) * 0.1} />)}
    </svg>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [finance, setFinance] = useState<any>(null);

  useEffect(() => { financeApi.summary().then(r => setFinance(r.data)).catch(() => {}); }, []);

  const selfSufficiency = finance?.self_sufficiency || [{ name: 'الأسماك', value: 146 }, { name: 'التمور', value: 99 }, { name: 'الحليب', value: 96 }, { name: 'بيض المائدة', value: 95 }, { name: 'الخضروات', value: 79 }, { name: 'اللحوم البيضاء', value: 62 }, { name: 'اللحوم الحمراء', value: 45 }, { name: 'الفواكه (غير التمور)', value: 24 }];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border relative h-64">
          <PivotFieldsHero />
          <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(20,33,61,0.88), transparent 65%)' }}>
            <h1 className="text-white text-2xl md:text-3xl font-black leading-snug font-kufi">تحويل الأراضي الحكومية غير المستغلة إلى واحات زراعية منتجة</h1>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border p-6 bg-ink">
          <p className="text-xs font-bold text-white/60 mb-4">ملخص المشروع — النجد</p>
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-white/70 text-sm">المساحة</span><span className="text-white font-black text-lg">100 هكتار</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between"><span className="text-white/70 text-sm">التكاليف</span><span className="text-white font-black text-lg">{finance ? `${(finance.total_costs || 315000).toLocaleString()} ر.ع` : '315,000 ر.ع'}</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between"><span className="text-white/70 text-sm">الاسترداد</span><span className="text-white font-black text-lg">{finance?.payback_years || '3.6'} سنة</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between"><span className="text-white/70 text-sm">NPV</span><span className="font-black text-lg" style={{ color: '#7DD3C0' }}>+{(finance?.npv || 38900).toLocaleString()} ر.ع</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard icon={MapPin} label="مناطق واعدة" value="5" sub="4 محافظات" />
        <KpiCard icon={TrendingUp} label="الإيرادات" value={`${(finance?.total_revenue || 76400).toLocaleString()} ر.ع`} />
        <KpiCard icon={Wallet} label="صافي الربح" value={`${(finance?.net_profit || -198600).toLocaleString()} ر.ع`} />
        <KpiCard icon={Sprout} label="مزارع" value={`${finance?.farm_count || 1}`} sub={`${finance?.harvest_count || 3} حصاد`} />
      </div>
      <SectionTitle eyebrow="الاكتفاء الذاتي" title="أين تكمن الفرصة الحقيقية؟" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {selfSufficiency.map((item: any) => (
          <div key={item.name} className="bg-white rounded-2xl border border-border p-4 flex flex-col items-center text-center">
            <ProgressRing percent={item.value} color={item.value >= 90 ? C.green : item.value >= 50 ? C.teal : C.rust} />
            <p className="text-sm font-bold mt-2 text-ink">{item.name}</p>
          </div>
        ))}
      </div>
      {finance?.cashflow && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="font-bold mb-4 text-ink">التدفق النقدي التراكمي</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={finance.cashflow}><CartesianGrid strokeDasharray="3 3" stroke="#E2E4DD" /><XAxis dataKey="year" tick={{ fontSize: 12, fill: '#5C6370' }} /><YAxis tick={{ fontSize: 11, fill: '#5C6370' }} /><Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} ر.ع`, '']} /><Line type="monotone" dataKey="cumulative" stroke={C.teal} strokeWidth={3} dot={{ r: 5, fill: C.teal }} /></LineChart>
            </ResponsiveContainer>
          </div>
          {finance?.cost_breakdown?.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <p className="font-bold mb-4 text-ink">توزيع التكاليف</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart><Pie data={finance.cost_breakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} paddingAngle={2}>{finance.cost_breakdown.map((_: any, i: number) => <Cell key={i} fill={[C.sand, C.teal, C.green, C.inkLight, C.rust, '#8B6F47'][i % 6]} />)}</Pie><Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} ر.ع`} /></PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
