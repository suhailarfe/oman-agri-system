import { useState } from "react";
import { ArrowRight, BadgeCheck, ClipboardPlus, Droplets, ShieldCheck } from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type WaterDraftForm = {
  regionCode: "najd" | "batinah" | "dhahirah" | "wusta" | "jabal";
  sourceName: string;
  sourceType: string;
  ph: string;
  salinityPpm: string;
  flowRate: string;
  operationalStatus: string;
  sampledAt: string;
};

const emptyDraft: WaterDraftForm = {
  regionCode: "najd",
  sourceName: "",
  sourceType: "",
  ph: "7.0",
  salinityPpm: "",
  flowRate: "",
  operationalStatus: "",
  sampledAt: new Date().toISOString().slice(0, 16),
};

const regionOptions = [
  ["najd", "النجد، ظفار"],
  ["batinah", "سهل الباطنة"],
  ["dhahirah", "محافظة الظاهرة"],
  ["wusta", "المنطقة الوسطى"],
  ["jabal", "الجبل الأخضر"],
] as const;

export default function AdminWaterPage() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<WaterDraftForm>(emptyDraft);
  const [approvalNotes, setApprovalNotes] = useState<Record<number, string>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const reviewQuery = trpc.program.water.reviewQueue.useQuery(undefined, { enabled: isAdmin });

  const createDraft = trpc.program.water.createDraft.useMutation({
    onSuccess: async () => {
      await utils.program.water.reviewQueue.invalidate();
      setDraft(emptyDraft);
      setStatusMessage("حُفظت القراءة كمسودة بانتظار الاعتماد.");
    },
    onError: () => setStatusMessage("تعذر حفظ المسودة. راجع البيانات المطلوبة ثم أعد المحاولة."),
  });
  const approveReading = trpc.program.water.approve.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.program.water.reviewQueue.invalidate(),
        utils.program.water.history.invalidate(),
        utils.agri.getWaterLedger.invalidate(),
      ]);
      setStatusMessage("تم اعتماد القراءة ونشرها في ملف المياه.");
    },
    onError: () => setStatusMessage("تعذر اعتماد القراءة. اكتب ملاحظة واضحة وتحقق من الصلاحية."),
  });

  const submitDraft = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createDraft.mutate({
      ...draft,
      ph: Number(draft.ph),
      salinityPpm: Number(draft.salinityPpm),
      sampledAt: new Date(draft.sampledAt),
    });
  };
  const approve = (id: number) => {
    const approvalNote = approvalNotes[id]?.trim() ?? "";
    if (approvalNote.length < 4) {
      setStatusMessage("اكتب ملاحظة اعتماد واضحة من أربعة أحرف على الأقل.");
      return;
    }
    approveReading.mutate({ id, approvalNote });
  };

  return (
    <div className="site-shell min-h-screen bg-paper text-ink" dir="rtl">
      <header className="site-header site-header--scrolled border-b border-line bg-white/90 px-8 py-4 backdrop-blur-md flex justify-between items-center">
        <a className="brand flex items-center gap-3" href="/"><span className="brand-copy"><strong className="font-kufi text-falaj-deep">إدارة قراءات المياه</strong><small className="text-[11px] text-muted">منصة واحات ومزارع عُمان 2040</small></span></a>
        <div className="flex items-center gap-3"><NotificationCenter /><a href="/" className="flex items-center gap-1 text-xs font-bold text-falaj hover:underline">العودة للواجهة الرئيسية <ArrowRight size={14} /></a></div>
      </header>
      <main className="page-pad mx-auto max-w-6xl py-24">
        <section className="mb-8 rounded-3xl border border-line bg-white p-8 md:p-10">
          <div className="mb-3 flex items-center gap-3 text-copper"><Droplets size={24} /><span className="text-xs font-bold tracking-wider">سجل الإدخال والاعتماد</span></div>
          <h1 className="mb-3 font-kufi text-3xl font-extrabold text-falaj-deep md:text-4xl">قراءات المياه تحت المراجعة</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">يسجل المشرف القراءة أولاً، ثم يعتمدها بملاحظة واضحة. لا تظهر المسودة في ملف المياه العام إلا بعد الاعتماد.</p>
          {!loading && !user && <button type="button" onClick={startLogin} className="mt-6 h-10 rounded-xl border border-falaj px-4 text-xs font-bold text-falaj transition-colors hover:bg-falaj-soft">سجّل الدخول للوصول إلى إدارة المياه</button>}
          {user && <p className="mt-5 flex items-center gap-2 text-xs font-bold text-falaj"><ShieldCheck size={15} /> الدور الحالي: {isAdmin ? "مشرف" : "مستثمر"}</p>}
          {user && !isAdmin && <p role="alert" className="mt-5 rounded-xl border border-line bg-paper p-4 text-xs leading-relaxed text-muted">هذه الشاشة متاحة للمشرفين فقط. لا يمكن لحساب المستثمر إنشاء أو اعتماد قراءات المياه.</p>}
        </section>

        {isAdmin && <>
          <section className="mb-8 rounded-3xl border border-line bg-white p-6 md:p-8">
            <div className="mb-5 flex items-center gap-2 text-falaj"><ClipboardPlus size={20} /><h2 className="font-kufi text-xl font-bold">إدخال قراءة جديدة</h2></div>
            <form onSubmit={submitDraft} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">المنطقة<select value={draft.regionCode} onChange={(event) => setDraft((current) => ({ ...current, regionCode: event.target.value as WaterDraftForm["regionCode"] }))} className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink">{regionOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">تاريخ ووقت القياس<input required type="datetime-local" value={draft.sampledAt} onChange={(event) => setDraft((current) => ({ ...current, sampledAt: event.target.value }))} className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">اسم البئر أو المحطة<input required value={draft.sourceName} onChange={(event) => setDraft((current) => ({ ...current, sourceName: event.target.value }))} className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">نوع المصدر<input required value={draft.sourceType} onChange={(event) => setDraft((current) => ({ ...current, sourceType: event.target.value }))} placeholder="بئر جوفي" className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">الرقم الهيدروجيني<input required type="number" min="0" max="14" step="0.1" value={draft.ph} onChange={(event) => setDraft((current) => ({ ...current, ph: event.target.value }))} className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">الملوحة، جزء/مليون<input required type="number" min="0" max="10000" value={draft.salinityPpm} onChange={(event) => setDraft((current) => ({ ...current, salinityPpm: event.target.value }))} className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">معدل التدفق<input required value={draft.flowRate} onChange={(event) => setDraft((current) => ({ ...current, flowRate: event.target.value }))} placeholder="75 جالون/دقيقة" className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <label className="grid gap-1 text-xs font-bold text-falaj-deep">حالة التشغيل<input required value={draft.operationalStatus} onChange={(event) => setDraft((current) => ({ ...current, operationalStatus: event.target.value }))} placeholder="يعمل بالطاقة الشمسية" className="h-10 rounded-lg border border-line bg-paper px-3 text-xs text-ink" /></label>
              <button type="submit" disabled={createDraft.isPending} className="inline-flex h-10 items-center justify-center rounded-xl bg-falaj px-4 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70 md:col-span-2">حفظ كمسودة للمراجعة</button>
            </form>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 md:p-8">
            <div className="mb-5 flex items-center gap-2 text-falaj"><BadgeCheck size={20} /><h2 className="font-kufi text-xl font-bold">طابور المراجعة</h2></div>
            {statusMessage && <p role="status" className="mb-4 text-xs font-bold text-falaj">{statusMessage}</p>}
            {reviewQuery.isLoading && <p className="text-sm text-muted">يجري تحميل قراءات المياه.</p>}
            {reviewQuery.error && <p role="alert" className="text-sm text-muted">تعذر تحميل طابور المراجعة. تحقق من صلاحية الحساب ثم أعد المحاولة.</p>}
            {reviewQuery.data && <div className="grid gap-3">{reviewQuery.data.map((reading) => <article key={reading.id} className="rounded-xl border border-line bg-paper p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-falaj-deep">{reading.sourceName}</h3><p className="mt-1 text-xs text-muted">{regionOptions.find(([value]) => value === reading.regionCode)?.[1]} · {reading.sourceType}</p></div><span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${reading.approvalStatus === "approved" ? "border-falaj/30 text-falaj" : "border-copper/40 text-copper"}`}>{reading.approvalStatus === "approved" ? "معتمدة" : "مسودة بانتظار الاعتماد"}</span></div><dl className="mt-4 grid gap-3 border-t border-line pt-3 text-xs md:grid-cols-4"><div><dt className="text-muted">الملوحة</dt><dd className="m-0 mt-1 font-bold text-ink">{reading.salinityPpm} جزء/مليون</dd></div><div><dt className="text-muted">الرقم الهيدروجيني</dt><dd className="m-0 mt-1 font-bold text-ink">{reading.ph}</dd></div><div><dt className="text-muted">وقت القياس</dt><dd className="m-0 mt-1 font-bold text-ink">{new Date(reading.sampledAt).toLocaleString("ar-OM")}</dd></div><div><dt className="text-muted">مرسل المسودة</dt><dd className="m-0 mt-1 break-all font-bold text-ink">{reading.submittedByOpenId || "سجل مرجعي"}</dd></div></dl>{reading.approvalStatus === "draft" ? <div className="mt-4 grid gap-2 border-t border-line pt-3 md:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor={`approval-${reading.id}`}>ملاحظة اعتماد القراءة</label><input id={`approval-${reading.id}`} value={approvalNotes[reading.id] ?? ""} onChange={(event) => setApprovalNotes((current) => ({ ...current, [reading.id]: event.target.value }))} placeholder="ملاحظة الاعتماد" className="h-9 rounded-lg border border-line bg-white px-3 text-xs text-ink" /><button type="button" onClick={() => approve(reading.id)} disabled={approveReading.isPending} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-falaj px-3 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70"><BadgeCheck size={13} /> اعتماد القراءة</button></div> : <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">اعتمدها {reading.approvedByOpenId || "السجل السابق"}{reading.approvalNote ? `: ${reading.approvalNote}` : ""}</p>}</article>)}</div>}
          </section>
        </>}
      </main>
    </div>
  );
}
