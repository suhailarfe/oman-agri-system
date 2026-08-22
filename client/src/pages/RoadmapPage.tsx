import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bookmark,
  BookmarkPlus,
  Calendar,
  ClipboardList,
  Clock,
  Download,
  LoaderCircle,
  Pencil,
  Save,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useAuth } from "@/_core/hooks/useAuth";
import { createRoadmapAuditCsv } from "@/lib/auditCsv";
import { trpc } from "@/lib/trpc";

type AuditFilters = { query: string; fromDate: string; toDate: string };

const statusLabels: Record<string, string> = {
  complete: "مكتمل",
  active: "قيد التنفيذ النشط",
  planned: "مخطط استراتيجي",
  future: "رؤية مستقبلية",
};

const statusClasses: Record<string, string> = {
  complete: "bg-green-100 text-green-800",
  active: "bg-amber-100 text-amber-900",
  planned: "bg-stone-100 text-stone-700",
  future: "bg-stone-100 text-stone-700",
};

function SavedAuditFilterPanel({ filters, onSelect }: { filters: AuditFilters; onSelect: (filters: AuditFilters) => void }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const utils = trpc.useUtils();
  const savedFiltersQuery = trpc.program.roadmap.savedFilters.list.useQuery();
  const createFilter = trpc.program.roadmap.savedFilters.create.useMutation({
    onSuccess: async () => {
      setName("");
      await utils.program.roadmap.savedFilters.list.invalidate();
    },
  });
  const deleteFilter = trpc.program.roadmap.savedFilters.delete.useMutation({
    onSuccess: () => utils.program.roadmap.savedFilters.list.invalidate(),
  });
  const renameFilter = trpc.program.roadmap.savedFilters.rename.useMutation({
    onSuccess: () => {
      setEditingId(null);
      utils.program.roadmap.savedFilters.list.invalidate();
    },
  });
  const reorderFilters = trpc.program.roadmap.savedFilters.reorder.useMutation({
    onSuccess: () => utils.program.roadmap.savedFilters.list.invalidate(),
  });

  const saveCurrentFilter = () => {
    if (name.trim().length < 2) return;
    createFilter.mutate({
      name: name.trim(),
      query: filters.query || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    });
  };

  const moveFilter = (id: number, direction: -1 | 1) => {
    const ordered = savedFiltersQuery.data ?? [];
    const index = ordered.findIndex((filter) => filter.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return;
    const ids = ordered.map((filter) => filter.id);
    [ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
    reorderFilters.mutate({ ids });
  };

  return (
    <section className="mt-5 rounded-xl border border-line bg-paper p-4">
      <div className="mb-3 flex items-center gap-2 text-falaj">
        <Bookmark size={16} />
        <h3 className="text-sm font-bold">الفلاتر المحفوظة</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="اسم الفلتر، مثال: تحديثات هذا الشهر"
          className="h-9 min-w-56 flex-1 rounded-lg border border-line bg-white px-3 text-xs text-ink outline-none focus:border-falaj"
        />
        <button
          type="button"
          onClick={saveCurrentFilter}
          disabled={createFilter.isPending || name.trim().length < 2}
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-falaj px-3 text-xs font-bold text-white disabled:opacity-50"
        >
          <BookmarkPlus size={14} /> حفظ الفلتر
        </button>
      </div>
      {savedFiltersQuery.data?.length === 0 && <p className="mt-3 text-xs text-muted">لم تُحفظ فلاتر بعد.</p>}
      <div className="mt-3 space-y-2">
        {savedFiltersQuery.data?.map((filter, index) => (
          <div key={filter.id} className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-white p-1">
            {editingId === filter.id ? <><input value={editingName} onChange={(event) => setEditingName(event.target.value)} className="h-7 min-w-40 flex-1 rounded border border-line px-2 text-xs text-ink" /><button type="button" onClick={() => editingName.trim().length >= 2 && renameFilter.mutate({ id: filter.id, name: editingName.trim() })} className="h-7 px-2 text-xs font-bold text-falaj">حفظ</button></> : <button type="button" onClick={() => onSelect({ query: filter.query ?? "", fromDate: filter.fromDate ?? "", toDate: filter.toDate ?? "" })} className="h-7 flex-1 px-2 text-right text-xs font-bold text-falaj hover:bg-falaj-soft">{filter.name}</button>}
            <button type="button" onClick={() => { setEditingId(filter.id); setEditingName(filter.name); }} aria-label={`تعديل اسم فلتر ${filter.name}`} className="grid h-7 w-7 place-items-center text-muted hover:text-falaj"><Pencil size={13} /></button>
            <button type="button" onClick={() => moveFilter(filter.id, -1)} disabled={index === 0 || reorderFilters.isPending} aria-label={`نقل فلتر ${filter.name} للأعلى`} className="grid h-7 w-7 place-items-center text-muted hover:text-falaj disabled:opacity-30"><ArrowUp size={13} /></button>
            <button type="button" onClick={() => moveFilter(filter.id, 1)} disabled={index === (savedFiltersQuery.data?.length ?? 0) - 1 || reorderFilters.isPending} aria-label={`نقل فلتر ${filter.name} للأسفل`} className="grid h-7 w-7 place-items-center text-muted hover:text-falaj disabled:opacity-30"><ArrowDown size={13} /></button>
            <button type="button" onClick={() => deleteFilter.mutate({ id: filter.id })} aria-label={`حذف فلتر ${filter.name}`} className="grid h-7 w-7 place-items-center text-muted hover:text-red-700"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function RoadmapPage() {
  const [draftProgress, setDraftProgress] = useState<Record<string, number>>({});
  const [draftReasons, setDraftReasons] = useState<Record<string, string>>({});
  const [auditFilters, setAuditFilters] = useState<AuditFilters>({ query: "", fromDate: "", toDate: "" });
  const [updateMessage, setUpdateMessage] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const milestonesQuery = trpc.program.roadmap.list.useQuery();
  const auditInput = useMemo(
    () => ({ query: auditFilters.query.trim() || undefined, fromDate: auditFilters.fromDate || undefined, toDate: auditFilters.toDate || undefined }),
    [auditFilters]
  );
  const auditQuery = trpc.program.roadmap.auditHistory.useQuery(auditInput, { enabled: isAdmin });
  const updateProgress = trpc.program.roadmap.updateProgress.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.program.roadmap.list.invalidate(), utils.program.roadmap.auditHistory.invalidate()]);
      setDraftProgress({});
      setDraftReasons({});
      setUpdateMessage("تم حفظ نسبة الإنجاز وإضافة سجل تدقيق باسم المشرف.");
    },
    onError: () => setUpdateMessage("تعذر حفظ التحديث. تحقق من النسبة وسبب التعديل."),
  });

  const saveProgress = (code: string, initialProgress: number) => {
    const reason = draftReasons[code]?.trim() ?? "";
    if (reason.length < 4) {
      setUpdateMessage("اكتب سبباً واضحاً من أربعة أحرف على الأقل قبل الحفظ.");
      return;
    }
    updateProgress.mutate({ code, progressPercent: Math.max(0, Math.min(100, draftProgress[code] ?? initialProgress)), reason });
  };

  const exportAuditCsv = () => {
    const csv = createRoadmapAuditCsv(auditQuery.data ?? []);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "oman-agri-roadmap-audit.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="site-shell min-h-screen bg-paper text-ink" dir="rtl">
      <header className="site-header site-header--scrolled flex items-center justify-between border-b border-line bg-white/90 px-8 py-4 backdrop-blur-md">
        <a className="brand flex items-center gap-3" href="/">
          <span className="brand-copy">
            <strong className="font-kufi text-falaj-deep">خارطة طريق الاستثمار والأمن الغذائي</strong>
            <small className="text-[11px] text-muted">رؤية عُمان 2040</small>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/weekly-summary" className="text-xs font-bold text-falaj hover:underline">ملخص الأسبوع</a>
          <NotificationCenter />
          <a href="/" className="flex items-center gap-1 text-xs font-bold text-falaj hover:underline">العودة للواجهة الرئيسية <ArrowRight size={14} /></a>
        </div>
      </header>

      <main className="page-pad mx-auto max-w-5xl py-24">
        <section className="mb-12 rounded-3xl border border-line bg-white p-8 text-center md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-falaj/20 bg-falaj/10 px-4 py-1.5 text-xs font-bold text-falaj"><TrendingUp size={14} /> المسار الزمني الاستراتيجي للمنصة</div>
          <h1 className="mb-4 font-kufi text-3xl font-extrabold text-falaj-deep md:text-5xl">خارطة طريق واحات ومزارع عُمان 2040</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-muted md:text-base">تُقرأ النسب وتواريخها من قاعدة البيانات. يحفظ كل تعديل إداري النسبة السابقة واللاحقة وسبب التغيير واسم منفذه في سجل تدقيق مستقل.</p>
        </section>

        {milestonesQuery.isLoading && <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-muted">يجري تحميل مراحل خارطة الطريق من قاعدة البيانات.</div>}
        {milestonesQuery.error && <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-muted">تعذر تحميل مراحل خارطة الطريق حالياً.</div>}

        <section className="relative space-y-6 before:absolute before:bottom-4 before:right-6 before:top-4 before:w-px before:bg-falaj/20">
          {milestonesQuery.data?.map((item) => {
            const progress = draftProgress[item.code] ?? item.progressPercent;
            return (
              <article key={item.id} className="relative pr-12">
                <div className="absolute right-3.5 top-1.5 h-5 w-5 rounded-full border-4 border-white bg-falaj" />
                <div className="rounded-3xl border border-line bg-white p-6 transition-colors hover:border-falaj/40 md:p-8">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-falaj/20 bg-falaj/10 px-3 py-1 text-xs font-bold text-falaj"><Calendar size={13} /> {item.timeframe}</span>
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusClasses[item.status] ?? statusClasses.future}`}><Clock size={13} /> {statusLabels[item.status] ?? item.status}</span>
                  </div>
                  <h2 className="mb-2 font-kufi text-xl font-extrabold text-falaj-deep">{item.title}</h2>
                  <p className="mb-4 text-xs leading-relaxed text-muted">{item.description}</p>
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <div className="mb-2 flex items-center justify-between gap-4 text-xs"><span className="font-bold text-falaj-deep">نسبة الإنجاز الحالية</span><span className="font-mono font-bold text-falaj">{progress}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-label={`نسبة إنجاز ${item.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div className="h-full rounded-full bg-falaj transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} /></div>
                    <p className="mt-2 text-[11px] text-muted">آخر تحديث: {new Date(item.updatedAt).toLocaleDateString("ar-OM")}</p>
                    {isAdmin && <div className="mt-4 grid gap-3 border-t border-line pt-3 md:grid-cols-[auto_1fr_auto]">
                      <label className="grid gap-1 text-xs font-bold text-falaj-deep">النسبة<input type="number" min="0" max="100" value={progress} onChange={(event) => setDraftProgress((old) => ({ ...old, [item.code]: Number(event.target.value) }))} className="h-9 w-24 rounded-lg border border-line bg-white px-2 text-xs text-ink outline-none focus:border-falaj" /></label>
                      <label className="grid gap-1 text-xs font-bold text-falaj-deep">سبب التعديل<input type="text" value={draftReasons[item.code] ?? ""} onChange={(event) => setDraftReasons((old) => ({ ...old, [item.code]: event.target.value }))} placeholder="مثال: اعتماد إنجاز ربط نظام المياه" className="h-9 w-full rounded-lg border border-line bg-white px-3 text-xs text-ink outline-none focus:border-falaj" /></label>
                      <button type="button" onClick={() => saveProgress(item.code, item.progressPercent)} disabled={updateProgress.isPending} className="mt-auto inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-falaj px-3 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70"><Save size={13} /> حفظ</button>
                    </div>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {updateMessage && <p role="status" className="mt-5 text-xs font-bold text-falaj">{updateProgress.isPending && <LoaderCircle size={14} className="ml-1 inline animate-spin" />}{updateMessage}</p>}

        {isAdmin && <section className="mt-10 rounded-3xl border border-line bg-white p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-falaj"><ClipboardList size={20} /><h2 className="font-kufi text-xl font-bold">سجل تدقيق تقدم المراحل</h2></div><button type="button" onClick={exportAuditCsv} disabled={!auditQuery.data?.length} className="inline-flex h-9 items-center gap-1 rounded-lg border border-falaj px-3 text-xs font-bold text-falaj transition-colors hover:bg-falaj-soft disabled:opacity-50"><Download size={14} /> تصدير CSV</button></div>
          <div className="grid gap-3 rounded-xl border border-line bg-paper p-4 md:grid-cols-[1fr_auto_auto_auto]">
            <input value={auditFilters.query} onChange={(event) => setAuditFilters((old) => ({ ...old, query: event.target.value }))} placeholder="ابحث باسم المشرف أو سبب التعديل" className="h-9 rounded-lg border border-line bg-white px-3 text-xs text-ink outline-none focus:border-falaj" />
            <label className="grid gap-1 text-[11px] font-bold text-falaj-deep">من تاريخ<input type="date" value={auditFilters.fromDate} onChange={(event) => setAuditFilters((old) => ({ ...old, fromDate: event.target.value }))} className="h-9 rounded-lg border border-line bg-white px-2 text-xs text-ink" /></label>
            <label className="grid gap-1 text-[11px] font-bold text-falaj-deep">إلى تاريخ<input type="date" value={auditFilters.toDate} onChange={(event) => setAuditFilters((old) => ({ ...old, toDate: event.target.value }))} className="h-9 rounded-lg border border-line bg-white px-2 text-xs text-ink" /></label>
            <button type="button" onClick={() => setAuditFilters({ query: "", fromDate: "", toDate: "" })} className="mt-auto inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-line px-3 text-xs font-bold text-falaj transition-colors hover:bg-falaj-soft"><X size={14} /> مسح</button>
          </div>
          <SavedAuditFilterPanel filters={auditFilters} onSelect={setAuditFilters} />
          {auditQuery.isLoading && <p className="mt-4 text-sm text-muted">يجري تحميل السجل.</p>}
          {auditQuery.data?.length === 0 && <p className="mt-4 rounded-xl border border-line bg-paper p-4 text-xs text-muted">لا توجد تعديلات مطابقة للتصفية الحالية.</p>}
          <div className="mt-4 space-y-3">{auditQuery.data?.map((entry) => <article key={entry.id} className="rounded-xl border border-line bg-paper p-4"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-falaj-deep">{entry.milestoneTitle}</strong><span className="font-mono text-xs font-bold text-falaj">{entry.previousProgressPercent}% ← {entry.nextProgressPercent}%</span></div><p className="text-xs leading-relaxed text-ink">السبب: {entry.reason}</p><p className="mt-2 text-[11px] text-muted">بواسطة {entry.changedByName || "مشرف معتمد"} في {new Date(entry.changedAt).toLocaleString("ar-OM")}</p></article>)}</div>
        </section>}
      </main>
    </div>
  );
}
