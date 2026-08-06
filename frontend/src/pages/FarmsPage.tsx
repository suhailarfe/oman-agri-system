import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { farmsApi, regionsApi } from '../services/api';
import { SectionTitle, Badge, Modal, LoadingSpinner } from '../components/UI';
import { Plus } from 'lucide-react';

export default function FarmsPage() {
  const { isAdmin, isFarmer } = useAuth();
  const canEdit = isAdmin || isFarmer;
  const [farms, setFarms] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ farm_name: '', region_id: '', area_ha: '', irrigation_system: 'ري محوري (Pivot)', status: 'قيد الإعداد', manager_name: '', coordinates: '' });

  async function load() { setLoading(true); try { const [fRes, rRes] = await Promise.all([farmsApi.list(), regionsApi.list()]); setFarms(fRes.data); setRegions(rRes.data); setForm(p => ({...p, region_id: rRes.data[0]?.id || ''})); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  function resetForm() { setForm({ farm_name: '', region_id: regions[0]?.id || '', area_ha: '', irrigation_system: 'ري محوري (Pivot)', status: 'قيد الإعداد', manager_name: '', coordinates: '' }); setEditingId(null); setShowForm(false); }

  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); const payload: any = { farm_name: form.farm_name, region_id: form.region_id, area_ha: parseFloat(form.area_ha) || null, irrigation_system: form.irrigation_system, status: form.status, manager_name: form.manager_name || null }; if (form.coordinates) { const [lat, lng] = form.coordinates.split(',').map(Number); if (!isNaN(lat) && !isNaN(lng)) payload.coordinates = { lat, lng }; } try { if (editingId) await farmsApi.update(editingId, payload); else await farmsApi.create(payload); resetForm(); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  async function handleDelete(id: string) { if (!confirm('متأكد؟')) return; try { await farmsApi.delete(id); load(); } catch (err: any) { alert(err.response?.data?.detail || 'خطأ'); } }

  function openEdit(f: any) { setForm({ farm_name: f.farm_name, region_id: f.region_id, area_ha: String(f.area_ha || ''), irrigation_system: f.irrigation_system || '', status: f.status || 'قيد الإعداد', manager_name: f.manager_name || '', coordinates: f.coordinates ? `${f.coordinates.lat},${f.coordinates.lng}` : '' }); setEditingId(f.id); setShowForm(true); }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><SectionTitle eyebrow="المزارع" title="إدارة المزارع" desc="سجل المزارع النشطة." />{canEdit && <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal shrink-0"><Plus size={16} /> تسجيل مزرعة</button>}</div>
      <Modal open={showForm} onClose={resetForm} title={editingId ? 'تعديل مزرعة' : 'تسجيل مزرعة'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.farm_name} onChange={e => setForm({...form, farm_name: e.target.value})} placeholder="اسم المزرعة *" required className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <select value={form.region_id} onChange={e => setForm({...form, region_id: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm">{regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
          <input value={form.area_ha} onChange={e => setForm({...form, area_ha: e.target.value})} type="number" placeholder="المساحة (هكتار)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <input value={form.irrigation_system} onChange={e => setForm({...form, irrigation_system: e.target.value})} placeholder="نظام الري" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"><option value="قيد الإعداد">قيد الإعداد</option><option value="قيد التنفيذ">قيد التنفيذ</option><option value="نشطة">نشطة</option></select>
          <input value={form.coordinates} onChange={e => setForm({...form, coordinates: e.target.value})} placeholder="الإحداثيات (lat,lng)" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm" />
          <button type="submit" className="w-full bg-ink text-white py-2.5 rounded-xl font-bold text-sm">{editingId ? 'حفظ' : 'إضافة'}</button>
        </form>
      </Modal>
      <div className="bg-white rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]"><thead><tr className="bg-paper"><th className="text-right p-4 font-bold text-textSecondary">المزرعة</th><th className="text-right p-4 font-bold text-textSecondary">المنطقة</th><th className="text-right p-4 font-bold text-textSecondary">المساحة</th><th className="text-right p-4 font-bold text-textSecondary">الري</th><th className="text-right p-4 font-bold text-textSecondary">الحالة</th>{canEdit && <th className="text-right p-4 font-bold text-textSecondary">إجراءات</th>}</tr></thead>
          <tbody>{farms.map(f => (<tr key={f.id} className="border-t border-border"><td className="p-4 font-bold text-ink">{f.farm_name}</td><td className="p-4 text-textSecondary">{f.region_name || '-'}</td><td className="p-4 text-textSecondary">{f.area_ha} هكتار</td><td className="p-4 text-textSecondary">{f.irrigation_system || '-'}</td><td className="p-4"><Badge tone={f.status === 'قيد التنفيذ' ? 'info' : 'neutral'}>{f.status}</Badge></td>{canEdit && <td className="p-4 flex gap-2"><button onClick={() => openEdit(f)} className="text-xs font-bold text-teal hover:underline">تعديل</button>{isAdmin && <button onClick={() => handleDelete(f.id)} className="text-xs font-bold text-rust hover:underline">حذف</button>}</td>}</tr>))}{farms.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-textSecondary">لا توجد مزارع</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
}
