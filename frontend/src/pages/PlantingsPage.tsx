import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { plantingsApi, farmsApi, cropsApi } from '../services/api';
import { SectionTitle, Badge, Modal, LoadingSpinner } from '../components/UI';
import { Plus } from 'lucide-react';

export default function PlantingsPage() {
  const { isAdmin, isFarmer } = useAuth();
  const canEdit = isAdmin || isFarmer;
  const [plantings, setPlantings] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ farm_id: '', crop_id: '', planted_area_ha: '', planting_date: '', expected_harvest: '', seed_qty_kg: '', season: 'شتوي' });

  async function load() { setLoading(true); try { const [pRes, fRes, cRes] = await Promise.all([plantingsApi.list(), farmsApi.list(), cropsApi.list()]); setPlantings(pRes.data); setFarms(fRes.data); setCrops(cRes.data); setForm(p => ({...p, farm_id: fRes.data[0]?.id || '', crop_id: cRes.data[0]?.id || ''})); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  function resetForm() { setForm({ farm_id: farms[0]?.id || '', crop_id: crops[0]?.id || '', planted_area_ha: '', planting_date: '', expected_harvest: '', seed_qty_kg: '', season: 'شتوي' }); setEditingId(null); setShowForm(false); }

  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); const payload: any = { farm_id: form.farm_id, crop_id: form.crop_id, planted_area_ha: parseFloat(form.planted_area_ha) || null, planting_date: form.planting_date || null, expected_harvest: form.expected_harvest || null, seed_qty_kg: parseFloat(form.seed_qty_kg) || null, season: form.season }; try { if (editingId) await plantingsApi.update(editingId, payload); else await plantingsApi.create(payload); resetForm(); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  function openEdit(p: any) { setForm({ farm_id: p.farm_id, crop_id: p.crop_id, planted_area_ha: String(p.planted_area_ha || ''), planting_date: p.planting_date || '', expected_harvest: p.expected_harvest || '', seed_qty_kg: String(p.seed_qty_kg || ''), season: p.season || 'شتوي' }); setEditingId(p.id); setShowForm(true); }

  async function handleDelete(id: string) { if (!confirm('متأكد؟')) return; try { await plantingsApi.delete(id); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><SectionTitle eyebrow="العمليات" title="دورات الزراعة" desc="تسجيل وتتبع دورات الزراعة." />{canEdit && <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal shrink-0"><Plus size={16} /> إضافة دورة</button>}</div>
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'تعديل دورة' : 'إضافة دورة زراعة'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.farm_id} onChange={e => setForm({...form, farm_id: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm">{farms.map(f => <option key={f.id} value={f.id}>{f.farm_name}</option>)}</select>
          <select value={form.crop_id} onChange={e => setForm({...form, crop_id: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm">{crops.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}</select>
          <input value={form.planted_area_ha} onChange={e => setForm({...form, planted_area_ha: e.target.value})} type="number" placeholder="المساحة (هكتار)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.planting_date} onChange={e => setForm({...form, planting_date: e.target.value})} type="date" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.expected_harvest} onChange={e => setForm({...form, expected_harvest: e.target.value})} type="date" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.seed_qty_kg} onChange={e => setForm({...form, seed_qty_kg: e.target.value})} type="number" placeholder="البذور (كجم)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <select value={form.season} onChange={e => setForm({...form, season: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"><option value="شتوي">شتوي</option><option value="صيفي">صيفي</option><option value="دائم">دائم</option></select>
          <button type="submit" className="w-full bg-ink text-white py-2.5 rounded-xl font-bold text-sm">{editingId ? 'حفظ' : 'إضافة'}</button>
        </form>
      </Modal>
      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">المزرعة</th><th className="text-right p-4 font-bold text-textSecondary">المحصول</th><th className="text-right p-4 font-bold text-textSecondary">المساحة</th><th className="text-right p-4 font-bold text-textSecondary">تاريخ الزراعة</th><th className="text-right p-4 font-bold text-textSecondary">الحصاد المتوقع</th><th className="text-right p-4 font-bold text-textSecondary">الموسم</th>{canEdit && <th className="text-right p-4 font-bold text-textSecondary">إجراءات</th>}</tr></thead>
          <tbody>{plantings.map(p => (<tr key={p.id} className="border-t border-border"><td className="p-4 font-bold text-ink">{p.farm_name || '-'}</td><td className="p-4 text-textSecondary">{p.crop_name || '-'}</td><td className="p-4 text-textSecondary">{p.planted_area_ha || '-'} هكتار</td><td className="p-4 text-textSecondary">{p.planting_date || '-'}</td><td className="p-4 text-textSecondary">{p.expected_harvest || '-'}</td><td className="p-4"><Badge tone="info">{p.season}</Badge></td>{canEdit && <td className="p-4 flex gap-2"><button onClick={() => openEdit(p)} className="text-xs font-bold text-teal hover:underline">تعديل</button><button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-rust hover:underline">حذف</button></td>}</tr>))}{plantings.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-textSecondary">لا توجد دورات زراعة</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
