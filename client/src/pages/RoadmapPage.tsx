/* صفحة خارطة الطريق: تعرض مراحل قاعدة البيانات وسجل تدقيق تحديثاتها للمشرفين. */
import { useState } from "react";
import { ArrowRight, Calendar, ClipboardList, Clock, LoaderCircle, Save, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

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

export default function RoadmapPage() {
  const [draftProgress, setDraftProgress] = useState<Record<string, number>>({});
  const [draftReasons, setDraftReasons] = useState<Record<string, string>>({});
  const [updateMessage, setUpdateMessage] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const milestonesQuery = trpc.program.roadmap.list.useQuery();
  const auditQuery = trpc.program.roadmap.auditHistory.useQuery(undefined, { enabled: isAdmin });
  const updateProgress = trpc.program.roadmap.updateProgress.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.program.roadmap.list.invalidate(), utils.program.roadmap.auditHistory.invalidate()]);
      setDraftProgress({});
      setDraftReasons({});
      setUpdateMessage("تم حفظ نسبة الإنجاز وإضافة سجل تدقيق باسم المشرف.");
    },
    onError: () => setUpdateMessage("تعذر حفظ التحديث. تحقق من النسبة وسبب التعديل."),
  });

  const saveProgress = (code: string, defaultValue: number) => {
    const reason = draftReasons[code]?.trim() ?? "";
    if (reason.length < 4) {
      setUpdateMessage("اكتب سبباً واضحاً من أربعة أحرف على الأقل قبل الحفظ.");
      return;
    }
    const progressPercent = draftProgress[code] ?? defaultValue;
    updateProgress.mutate({ code, progressPercent: Math.max(0, Math.min(100, progressPercent)), reason });
  };

  return (
    <div className="site-shell min-h-screen bg-paper text-ink" dir="rtl">
      <header className="site-header site-header--scrolled border-b border-line bg-white/90 px-8 py-4 backdrop-blur-md flex justify-between items-center">
        <a className="brand flex items-center gap-3" href="/"><span className="brand-copy"><strong className="font-kufi text-falaj-deep">خارطة طريق الاستثمار والأمن الغذائي</strong><small className="text-[11px] text-muted">رؤية عُمان 2040</small></span></a>
        <a href="/" className="flex items-center gap-1 text-xs font-bold text-falaj hover:underline">العودة للواجهة الرئيسية <ArrowRight size={14} /></a>
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
            const currentProgress = draftProgress[item.code] ?? item.progressPercent;
            return (
              <article key={item.id} className="relative pr-12">
                <div className="absolute right-3.5 top-1.5 h-5 w-5 rounded-full border-4 border-white bg-falaj" />
                <div className="rounded-3xl border border-line bg-white p-6 transition-colors hover:border-falaj/40 md:p-8">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="flex items-center gap-1 rounded-full border border-falaj/20 bg-falaj/10 px-3 py-1 text-xs font-bold text-falaj"><Calendar size={13} /> {item.timeframe}</span><span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusClasses[item.status] ?? statusClasses.future}`}><Clock size={13} /> {statusLabels[item.status] ?? item.status}</span></div>
                  <h2 className="mb-2 font-kufi text-xl font-extrabold text-falaj-deep">{item.title}</h2>
                  <p className="mb-4 text-xs leading-relaxed text-muted">{item.description}</p>
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <div className="mb-2 flex items-center justify-between gap-4 text-xs"><span className="font-bold text-falaj-deep">نسبة الإنجاز الحالية</span><span className="font-mono font-bold text-falaj">{currentProgress}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-stone-200" role="progressbar" aria-label={`نسبة إنجاز ${item.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={currentProgress}><div className="h-full rounded-full bg-falaj transition-[width] duration-150 ease-out" style={{ width: `${currentProgress}%` }} /></div>
                    <p className="mt-2 text-[11px] text-muted">آخر تحديث: {new Date(item.updatedAt).toLocaleDateString("ar-OM")}</p>
                    {isAdmin && <div className="mt-4 grid gap-3 border-t border-line pt-3 md:grid-cols-[auto_1fr_auto]"><label className="grid gap-1 text-xs font-bold text-falaj-deep" htmlFor={`progress-${item.code}`}>النسبة<input id={`progress-${item.code}`} type="number" min="0" max="100" value={currentProgress} onChange={(event) => setDraftProgress((previous) => ({ ...previous, [item.code]: Number(event.target.value) }))} className="h-9 w-24 rounded-lg border border-line bg-white px-2 text-xs text-ink outline-none focus:border-falaj" /></label><label className="grid gap-1 text-xs font-bold text-falaj-deep" htmlFor={`reason-${item.code}`}>سبب التعديل<input id={`reason-${item.code}`} type="text" value={draftReasons[item.code] ?? ""} onChange={(event) => setDraftReasons((previous) => ({ ...previous, [item.code]: event.target.value }))} placeholder="مثال: اعتماد إنجاز ربط نظام المياه" className="h-9 w-full rounded-lg border border-line bg-white px-3 text-xs text-ink outline-none focus:border-falaj" /></label><button type="button" onClick={() => saveProgress(item.code, item.progressPercent)} disabled={updateProgress.isPending} className="mt-auto inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-falaj px-3 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70"><Save size={13} /> حفظ</button></div>}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        {updateMessage && <p role="status" className="mt-5 text-xs font-bold text-falaj">{updateProgress.isPending && <LoaderCircle size={14} className="ml-1 inline animate-spin" />}{updateMessage}</p>}

        {isAdmin && <section className="mt-10 rounded-3xl border border-line bg-white p-6 md:p-8"><div className="mb-5 flex items-center gap-2 text-falaj"><ClipboardList size={20} /><h2 className="font-kufi text-xl font-bold">سجل تدقيق تقدم المراحل</h2></div>{auditQuery.isLoading && <p className="text-sm text-muted">يجري تحميل السجل.</p>}{auditQuery.data?.length === 0 && <p className="rounded-xl border border-line bg-paper p-4 text-xs text-muted">لا توجد تعديلات مسجلة بعد.</p>}<div className="space-y-3">{auditQuery.data?.map((entry) => <article key={entry.id} className="rounded-xl border border-line bg-paper p-4"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-falaj-deep">{entry.milestoneTitle}</strong><span className="font-mono text-xs font-bold text-falaj">{entry.previousProgressPercent}% ← {entry.nextProgressPercent}%</span></div><p className="text-xs leading-relaxed text-ink">السبب: {entry.reason}</p><p className="mt-2 text-[11px] text-muted">بواسطة {entry.changedByName || "مشرف معتمد"} في {new Date(entry.changedAt).toLocaleString("ar-OM")}</p></article>)}</div></section>}
      </main>
    </div>
  );
}
