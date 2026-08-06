import { useState, useEffect } from 'react';
import { seedsApi } from '../services/api';
import { SectionTitle, Badge, LoadingSpinner } from '../components/UI';
import { CheckCircle2 } from 'lucide-react';

export default function SeedsPage() {
  const [seeds, setSeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { seedsApi.list().then(r => setSeeds(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingSpinner />;
  const correctedNames = ['مركز عُمان للموارد الوراثية الحيوانية والنباتية (OAPRC)'];
  return (
    <div>
      <SectionTitle eyebrow="القسم 7 — مُصحَّح" title="مصادر البذور الطبيعية غير المعدلة جينياً" desc="جميع الجهات أدناه حقيقية وتم التحقق منها." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seeds.map(s => {
          const isCorrected = correctedNames.some(n => s.source_name.includes(n));
          return (
            <div key={s.id} className="bg-white rounded-2xl p-5" style={{ border: isCorrected ? '2px solid #16707A' : '1px solid #E2E4DD' }}>
              <div className="flex items-start justify-between gap-3 mb-3"><p className="font-black leading-snug text-ink">{s.source_name}</p>{isCorrected && <Badge tone="info">تصحيح</Badge>}</div>
              <div className="flex flex-wrap gap-1.5 mb-3">{s.source_type && <Badge tone="neutral">{s.source_type}</Badge>}{s.country && <Badge tone="neutral">{s.country}</Badge>}{s.is_non_gmo && <Badge tone="good"><CheckCircle2 size={12} /> Non-GMO 100%</Badge>}</div>
              {s.notes && <p className="text-xs text-textSecondary">{s.notes}</p>}
              {s.website && <a href={`https://${s.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal font-bold mt-2 inline-block hover:underline">{s.website}</a>}
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-white rounded-2xl border border-border p-6">
        <h3 className="font-black text-ink mb-3 font-kufi">توصية: إنشاء بنك بذور داخلي</h3>
        <ul className="space-y-2 text-sm text-textSecondary list-disc list-inside"><li>عزل 10% من كل محصول ناضج وتخزينه في ظروف محكومة (4–8°م).</li><li>يوفر تكلفة البذور تدريجياً حتى تصبح صفراً بحلول السنة الثالثة.</li><li>البذور المفتوحة تتكيف مع البيئة المحلية عبر الأجيال.</li></ul>
      </div>
    </div>
  );
}
