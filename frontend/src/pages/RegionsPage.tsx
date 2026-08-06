import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { regionsApi } from '../services/api';
import { SectionTitle, Badge, Modal, LoadingSpinner } from '../components/UI';
import { Droplets, Plus } from 'lucide-react';

export default function RegionsPage() {
  const { isAdmin } = useAuth();
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', governorate: '', climate_type: '', soil_type: '', water_source: '', crops: '', color: '#33633B' });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() { setLoading(true); try { setRegions((await regionsApi.list()).data); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  function resetForm() { setForm({ name: '', governorate: '', climate_type: '', soil_type: '', water_source: '', crops: '', color: '#33633B' }); setEditingId(null); setShowForm(false); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, crops: form.crops.split(',').map(c => c.trim()).filter(Boolean) };
    try { if (editingId) await regionsApi.update(editingId, payload); else await regionsApi.create(payload as any); resetForm(); load(); }
    catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); }
  }

  async function handleDelete(id: string) { if (!confirm('متأكد؟')) return; try { await regionsApi.delete(id); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  function openEdit(r: any) { setForm({ name: r.name, governorate: r.governorate || '', climate_type: r.climate_type || '', soil_type: r.soil_type || '', water_source: r.water_source || '', crops: (r.crops || []).join(', '), color: r.color || '#33633B' }); setEditingId(r.id); setShowForm(true); }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <SectionTitle eyebrow="القسم 2" title="المناطق الزراعية الحكومية الواعدة" desc="خمس مناطق تغطي محافظات ظفار والباطنة والظاهرة والوسطى والداخلية." />
        {isAdmin && <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal shrink-0"><Plus size={16} /> إضافة منطقة</button>}
      </div>
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'تعديل منطقة' : 'إضافة منطقة'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="اسم المنطقة *" required className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} placeholder="المحافظة" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.climate_type} onChange={e => setForm({...form, climate_type: e.target.value})} placeholder="المناخ" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.soil_type} onChange={e => setForm({...form, soil_type: e.target.value})} placeholder="التربة" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.water_source} onChange={e => setForm({...form, water_source: e.target.value})} placeholder="المياه" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.crops} onChange={e => setForm({...form, crops: e.target.value})} placeholder="المحاصيل (مفصولة بفواصل)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <div className="flex items-center gap-2"><label className="text-xs font-bold text-textSecondary">اللون:</label><input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-12 h-8 rounded" /></div>
          <button type="submit" className="w-full bg-ink text-white py-2.5 rounded-xl font-bold text-sm">{editingId ? 'حفظ' : 'إضافة'}</button>
        </form>
      </Modal>
      <div className="space-y-3">
        {regions.map((r, i) => (
          <div key={r.id} className="bg-white rounded-2xl border border-border overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-right">
              <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color || '#33633B' }} /><div><p className="font-black text-ink">{r.name}</p><p className="text-xs text-textSecondary">{r.governorate} · {r.climate_type}</p></div></div>
              <span className="text-xs font-bold shrink-0 text-teal">{open === i ? 'إخفاء' : 'التفاصيل'}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><p className="text-xs font-bold mb-2 text-textSecondary">التربة</p><p className="text-sm text-ink">{r.soil_type}</p></div>
                  <div><p className="text-xs font-bold mb-2 text-textSecondary">المحاصيل</p><div className="flex flex-wrap gap-1.5">{(r.crops || []).map((c: string) => <Badge key={c} tone="good">{c}</Badge>)}</div></div>
                  <div><p className="text-xs font-bold mb-2 flex items-center gap-1.5 text-textSecondary"><Droplets size={13} /> المياه</p><p className="text-sm text-ink">{r.water_source}</p></div>
                </div>
                {isAdmin && <div className="flex gap-2 pt-2 border-t border-border"><button onClick={() => openEdit(r)} className="text-xs font-bold text-teal hover:underline">تعديل</button><button onClick={() => handleDelete(r.id)} className="text-xs font-bold text-rust hover:underline">حذف</button></div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
