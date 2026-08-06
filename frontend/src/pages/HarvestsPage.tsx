import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { harvestsApi, plantingsApi } from '../services/api';
import { SectionTitle, Badge, Modal, LoadingSpinner } from '../components/UI';
import { Plus } from 'lucide-react';

export default function HarvestsPage() {
  const { isAdmin, isFarmer } = useAuth();
  const canEdit = isAdmin || isFarmer;
  const [harvests, setHarvests] = useState<any[]>([]);
  const [plantings, setPlantings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ planting_id: '', harvest_date: '', yield_tons: '', quality_grade: 'جيد', seeds_saved_kg: '0', revenue_omr: '' });

  async function load() { setLoading(true); try { const [hRes, pRes] = await Promise.all([harvestsApi.list(), plantingsApi.list()]); setHarvests(hRes.data); setPlantings(pRes.data); setForm(p => ({...p, planting_id: pRes.data[0]?.id || ''})); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  function resetForm() { setForm({ planting_id: plantings[0]?.id || '', harvest_date: '', yield_tons: '', quality_grade: 'جيد', seeds_saved_kg: '0', revenue_omr: '' }); setEditingId(null); setShowForm(false); }

  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); const payload: any = { planting_id: form.planting_id, harvest_date: form.harvest_date || null, yield_tons: parseFloat(form.yield_tons) || null, quality_grade: form.quality_grade, seeds_saved_kg: parseFloat(form.seeds_saved_kg) || 0, revenue_omr: parseFloat(form.revenue_omr) || null }; try { if (editingId) await harvestsApi.update(editingId, payload); else await harvestsApi.create(payload); resetForm(); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  function openEdit(h: any) { setForm({ planting_id: h.planting_id, harvest_date: h.harvest_date || '', yield_tons: String(h.yield_tons || ''), quality_grade: h.quality_grade || 'جيد', seeds_saved_kg: String(h.seeds_saved_kg || '0'), revenue_omr: String(h.revenue_omr || '') }); setEditingId(h.id); setShowForm(true); }

  async function handleDelete(id: string) { if (!confirm('متأكد؟')) return; try { await harvestsApi.delete(id); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><SectionTitle eyebrow="العمليات" title="سجلات الحصاد" desc="تسجيل وتتبع نتائج الحصاد." />{canEdit && <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal shrink-0"><Plus size={16} /> تسجيل حصاد</button>}</div>
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'تعديل حصاد' : 'تسجيل حصاد'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.planting_id} onChange={e => setForm({...form, planting_id: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm">{plantings.map(p => <option key={p.id} value={p.id}>{p.farm_name} — {p.crop_name}</option>)}</select>
          <input value={form.harvest_date} onChange={e => setForm({...form, harvest_date: e.target.value})} type="date" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.yield_tons} onChange={e => setForm({...form, yield_tons: e.target.value})} type="number" step="0.001" placeholder="الإنتاج (طن)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <select value={form.quality_grade} onChange={e => setForm({...form, quality_grade: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"><option value="ممتاز">ممتاز</option><option value="جيد جداً">جيد جداً</option><option value="جيد">جيد</option></select>
          <input value={form.seeds_saved_kg} onChange={e => setForm({...form, seeds_saved_kg: e.target.value})} type="number" placeholder="بذور محفوظة (كجم)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.revenue_omr} onChange={e => setForm({...form, revenue_omr: e.target.value})} type="number" step="0.001" placeholder="الإيراد (ر.ع)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <button type="submit" className="w-full bg-ink text-white py-2.5 rounded-xl font-bold text-sm">{editingId ? 'حفظ' : 'تسجيل'}</button>
        </form>
      </Modal>
      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">المزرعة</th><th className="text-right p-4 font-bold text-textSecondary">المحصول</th><th className="text-right p-4 font-bold text-textSecondary">التاريخ</th><th className="text-right p-4 font-bold text-textSecondary">الإنتاج</th><th className="text-right p-4 font-bold text-textSecondary">الجودة</th><th className="text-right p-4 font-bold text-textSecondary">بذور</th><th className="text-right p-4 font-bold text-textSecondary">الإيراد</th>{canEdit && <th className="text-right p-4 font-bold text-textSecondary">إجراءات</th>}</tr></thead>
          <tbody>{harvests.map(h => (<tr key={h.id} className="border-t border-border"><td className="p-4 font-bold text-ink">{h.farm_name || '-'}</td><td className="p-4 text-textSecondary">{h.crop_name || '-'}</td><td className="p-4 text-textSecondary">{h.harvest_date || '-'}</td><td className="p-4 font-bold text-ink">{h.yield_tons || '-'}</td><td className="p-4"><Badge tone={h.quality_grade === 'ممتاز' ? 'good' : 'info'}>{h.quality_grade || '-'}</Badge></td><td className="p-4 text-textSecondary">{h.seeds_saved_kg || 0} كجم</td><td className="p-4 font-bold text-green">{h.revenue_omr ? `${Number(h.revenue_omr).toLocaleString()} ر.ع` : '-'}</td>{canEdit && <td className="p-4 flex gap-2"><button onClick={() => openEdit(h)} className="text-xs font-bold text-teal hover:underline">تعديل</button><button onClick={() => handleDelete(h.id)} className="text-xs font-bold text-rust hover:underline">حذف</button></td>}</tr>))}{harvests.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-textSecondary">لا توجد سجلات</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
