import { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { SectionTitle, Badge, LoadingSpinner } from '../components/UI';
import { ShieldCheck } from 'lucide-react';

const roleLabels: Record<string, string> = { admin: 'مدير النظام', farmer: 'المشغّل الميداني', supplier: 'مورد البذور' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() { setLoading(true); try { setUsers((await authApi.listUsers()).data); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  async function toggleUser(id: string) { try { await authApi.toggleUser(id); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <SectionTitle eyebrow="إدارة النظام" title="المستخدمين والصلاحيات" desc="إدارة حسابات المستخدمين." />
      <div className="bg-white rounded-2xl border border-border overflow-x-auto mb-8">
        <table className="w-full text-sm min-w-[600px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">المستخدم</th><th className="text-right p-4 font-bold text-textSecondary">البريد</th><th className="text-right p-4 font-bold text-textSecondary">الدور</th><th className="text-right p-4 font-bold text-textSecondary">الحالة</th><th className="text-right p-4 font-bold text-textSecondary">إجراءات</th></tr></thead>
          <tbody>{users.map(u => (<tr key={u.id} className="border-t border-border"><td className="p-4 font-bold text-ink">{u.display_name}</td><td className="p-4 text-textSecondary">{u.email}</td><td className="p-4"><Badge tone="info">{roleLabels[u.role] || u.role}</Badge></td><td className="p-4"><Badge tone={u.is_active ? 'good' : 'warn'}>{u.is_active ? 'نشط' : 'معطل'}</Badge></td><td className="p-4"><button onClick={() => toggleUser(u.id)} className={`text-xs font-bold hover:underline ${u.is_active ? 'text-rust' : 'text-green'}`}>{u.is_active ? 'تعطيل' : 'تفعيل'}</button></td></tr>))}</tbody></table>
      </div>
      <h3 className="font-black text-ink mb-4 font-kufi">الأدوار والصلاحيات</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['admin', 'farmer', 'supplier'].map(role => {
          const perms: Record<string, string[]> = { admin: ['إدارة المناطق', 'تسجيل المزارع', 'إدارة المياه', 'التقارير الكاملة'], farmer: ['تسجيل مزرعة', 'متابعة الزراعة', 'تسجيل الحصاد', 'عرض التقارير'], supplier: ['التحقق من الأصناف', 'توريد البذور Non-GMO', 'إصدار شهادة'] };
          return (
            <div key={role} className="bg-white rounded-2xl border border-border p-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-sand-light"><ShieldCheck size={20} style={{ color: '#7A5E2E' }} /></div>
              <p className="font-black mb-1 text-ink">{roleLabels[role]}</p>
              <div className="space-y-2 mt-3">{perms[role].map(p => (<div key={p} className="flex items-center gap-2 text-sm"><span className="text-teal shrink-0">✓</span><span className="text-ink">{p}</span></div>))}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
