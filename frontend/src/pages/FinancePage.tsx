import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { financeApi, costsApi } from '../services/api';
import { SectionTitle, Badge, KpiCard, LoadingSpinner } from '../components/UI';
import { Wallet, TrendingUp, BarChart3, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const C = ['#B99A5B', '#16707A', '#33633B', '#2C4A73', '#B5470E', '#8B6F47'];

export default function FinancePage() {
  const { isAdmin } = useAuth();
  const [finance, setFinance] = useState<any>(null);
  const [costs, setCosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() { setLoading(true); try { const [fRes, cRes] = await Promise.all([financeApi.summary(), costsApi.list()]); setFinance(fRes.data); setCosts(cRes.data); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionTitle eyebrow="القسم 9" title="الجدوى المالية والاستثمارية" desc="مؤشرات الأداء المالي تُحسب تلقائياً من البيانات الفعلية." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard icon={Wallet} label="إجمالي التكاليف" value={`${(finance?.total_costs || 0).toLocaleString()} ر.ع`} />
        <KpiCard icon={TrendingUp} label="الإيرادات" value={`${(finance?.total_revenue || 0).toLocaleString()} ر.ع`} />
        <KpiCard icon={BarChart3} label="الاسترداد" value={`${finance?.payback_years || '-'} سنة`} />
        <KpiCard icon={Award} label="NPV (8%)" value={finance?.npv ? `${finance.npv >= 0 ? '+' : ''}${finance.npv.toLocaleString()} ر.ع` : '-'} />
      </div>
      {finance?.cashflow && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="font-bold mb-4 text-ink">التدفق النقدي</p>
            <ResponsiveContainer width="100%" height={260}><LineChart data={finance.cashflow}><CartesianGrid strokeDasharray="3 3" stroke="#E2E4DD" /><XAxis dataKey="year" tick={{ fontSize: 12, fill: '#5C6370' }} /><YAxis tick={{ fontSize: 11, fill: '#5C6370' }} /><Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} ر.ع`, '']} /><Line type="monotone" dataKey="cumulative" stroke="#16707A" strokeWidth={3} dot={{ r: 5, fill: '#16707A' }} /></LineChart></ResponsiveContainer></div>
          {finance?.cost_breakdown?.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <p className="font-bold mb-4 text-ink">توزيع التكاليف</p>
              <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={finance.cost_breakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} paddingAngle={2}>{finance.cost_breakdown.map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}</Pie><Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} ر.ع`} /></PieChart></ResponsiveContainer>
            </div>
          )}
        </div>
      )}
      {finance?.sensitivity && (
        <><p className="font-bold mb-3 text-ink">تحليل الحساسية</p>
        <div className="bg-white rounded-2xl border border-border overflow-x-auto mb-8"><table className="w-full text-sm min-w-[500px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">السيناريو</th><th className="text-right p-4 font-bold text-textSecondary">IRR</th><th className="text-right p-4 font-bold text-textSecondary">الاسترداد</th></tr></thead><tbody>{finance.sensitivity.map((s: any) => (<tr key={s.scenario} className="border-t border-border"><td className="p-4 text-ink">{s.scenario}</td><td className="p-4"><Badge tone={s.tone}>{s.irr}</Badge></td><td className="p-4 text-textSecondary">{s.payback}</td></tr>))}</tbody></table></div></>
      )}
      {isAdmin && (
        <>
          <p className="font-bold mb-3 text-ink">التكاليف المسجلة</p>
          <div className="bg-white rounded-2xl border border-border overflow-x-auto"><table className="w-full text-sm min-w-[600px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">الفئة</th><th className="text-right p-4 font-bold text-textSecondary">المبلغ</th><th className="text-right p-4 font-bold text-textSecondary">التاريخ</th><th className="text-right p-4 font-bold text-textSecondary">النوع</th></tr></thead><tbody>{costs.map(c => (<tr key={c.id} className="border-t border-border"><td className="p-4 font-bold text-ink">{c.category}</td><td className="p-4 font-bold text-ink">{c.amount_omr.toLocaleString()} ر.ع</td><td className="p-4 text-textSecondary">{c.incurred_date || '-'}</td><td className="p-4"><Badge tone={c.is_recurring ? 'info' : 'warn'}>{c.is_recurring ? 'تشغيلية' : 'تأسيسية'}</Badge></td></tr>))}</tbody></table></div>
        </>
      )}
    </div>
  );
}
