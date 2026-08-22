/* صفحة وثائق MVP: سجل إصدارات للمشرفين وتنزيل PDF بمحتوى مقيد حسب الدور. */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Download, FileText, Filter, GitCompareArrows, History, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { getSearchSegments } from "@/lib/documentSearch";
import { trpc } from "@/lib/trpc";

export default function AdminDocsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocumentKey, setSelectedDocumentKey] = useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("document")
  );
  const [selectedVersionIds, setSelectedVersionIds] = useState<{ previousId: number | null; currentId: number | null }>({ previousId: null, currentId: null });
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const documentsQuery = trpc.program.documents.list.useQuery(undefined, { enabled: Boolean(user) });
  const historyInput = useMemo(() => ({ documentKey: selectedDocumentKey ?? "" }), [selectedDocumentKey]);
  const historyQuery = trpc.program.documents.history.useQuery(historyInput, {
    enabled: isAdmin && Boolean(selectedDocumentKey),
  });
  useEffect(() => {
    if (!historyQuery.data || historyQuery.data.length < 2) return;
    setSelectedVersionIds((current) =>
      current.previousId && current.currentId
        ? current
        : { previousId: historyQuery.data[1].id, currentId: historyQuery.data[0].id }
    );
  }, [historyQuery.data]);
  const compareInput = useMemo(() => {
    if (!selectedVersionIds.previousId || !selectedVersionIds.currentId || selectedVersionIds.previousId === selectedVersionIds.currentId) return null;
    return { previousId: selectedVersionIds.previousId, currentId: selectedVersionIds.currentId };
  }, [selectedVersionIds]);
  const comparisonQuery = trpc.program.documents.compare.useQuery(compareInput ?? { previousId: 1, currentId: 1 }, {
    enabled: isAdmin && Boolean(compareInput),
  });
  const exportMutation = trpc.program.documents.exportPayload.useMutation();

  const documentsList = documentsQuery.data ?? [];
  const filteredDocs = documentsList.filter((doc) => {
    const normalized = searchTerm.toLocaleLowerCase();
    return (doc.title.toLocaleLowerCase().includes(normalized) || doc.summary.toLocaleLowerCase().includes(normalized)) &&
      (selectedCategory === "all" || doc.category === selectedCategory);
  });

  const highlightSearchTerm = (value: string): ReactNode =>
    getSearchSegments(value, searchTerm).map((segment, index) =>
      segment.isMatch ? (
        <mark key={`${segment.text}-${index}`} className="rounded-sm bg-amber-200 px-0.5 text-ink">{segment.text}</mark>
      ) : (
        <span key={`${segment.text}-${index}`}>{segment.text}</span>
      )
    );

  const downloadDocumentPdf = async (documentKey: string) => {
    if (!user) {
      startLogin();
      return;
    }

    setIsExporting(true);
    setExportMessage("");

    try {
      const payload = await exportMutation.mutateAsync({ documentKey });
      const exportDate = new Intl.DateTimeFormat("ar-OM", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
      const printableDocument = document.createElement("article");
      printableDocument.dir = "rtl";
      printableDocument.style.cssText = "position:fixed;right:-10000px;top:0;width:760px;padding:48px;background:#fffdf7;color:#163d30;font-family:Arial,sans-serif;line-height:1.9;box-sizing:border-box;";
      printableDocument.innerHTML = `
        <header style="border-bottom:2px solid #1f5a45;padding-bottom:20px;margin-bottom:28px;">
          <div style="font-size:14px;color:#b97a4c;font-weight:700;">واحات ومزارع عُمان | رؤية 2040</div>
          <h1 style="font-size:28px;margin:8px 0;color:#163d30;">${payload.title}</h1>
          <p style="margin:0;font-size:13px;color:#5f6a63;">تاريخ التصدير: ${exportDate} | الإصدار: ${payload.versionTag} | نسخة ${payload.exportAudience}</p>
        </header>
        <section style="background:#edf5ef;border:1px solid #cfe0d3;padding:18px 20px;margin-bottom:20px;">
          <h2 style="font-size:17px;margin:0 0 8px;color:#163d30;">الملخص المعتمد</h2><p style="margin:0;font-size:14px;">${payload.summary}</p>
        </section>
        <section><h2 style="font-size:17px;margin:0 0 8px;color:#163d30;">نطاق المعلومات</h2><p style="margin:0;font-size:14px;">${payload.content}</p></section>
        <section style="margin-top:20px;"><h2 style="font-size:17px;margin:0 0 8px;color:#163d30;">ملاحظة الإصدار</h2><p style="margin:0;font-size:14px;">${payload.changeSummary}</p></section>
        <footer style="border-top:1px solid #d8ded9;padding-top:16px;margin-top:28px;font-size:12px;color:#5f6a63;">محتوى هذا الملف محدد وفق صلاحية المستخدم عند وقت التصدير.</footer>
      `;
      document.body.appendChild(printableDocument);

      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
      const canvas = await html2canvas(printableDocument, { backgroundColor: "#fffdf7", scale: 2, useCORS: true });
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const margin = 10;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const contentHeight = pageHeight - margin * 2;
      const imageData = canvas.toDataURL("image/png");
      let remainder = imageHeight;
      let y = margin;
      pdf.addImage(imageData, "PNG", margin, y, imageWidth, imageHeight);
      remainder -= contentHeight;
      while (remainder > 0) {
        y = margin - (imageHeight - remainder);
        pdf.addPage();
        pdf.addImage(imageData, "PNG", margin, y, imageWidth, imageHeight);
        remainder -= contentHeight;
      }
      pdf.save(`oman-agri-${documentKey}-${payload.versionTag}.pdf`);
      setExportMessage(`تم تنزيل نسخة ${payload.exportAudience} بصيغة PDF.`);
      printableDocument.remove();
    } catch {
      setExportMessage("تعذر إنشاء ملف PDF. تحقق من صلاحية الحساب وحاول مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="site-shell min-h-screen bg-paper text-ink" dir="rtl">
      <header className="site-header site-header--scrolled border-b border-line bg-white/90 px-8 py-4 backdrop-blur-md flex justify-between items-center">
        <a className="brand flex items-center gap-3" href="/"><span className="brand-copy"><strong className="font-kufi text-falaj-deep">لوحة وثائق ومواصفات MVP</strong><small className="text-[11px] text-muted">منصة واحات ومزارع عُمان 2040</small></span></a>
        <a href="/" className="flex items-center gap-1 text-xs font-bold text-falaj hover:underline">العودة للواجهة الرئيسية <ArrowRight size={14} /></a>
      </header>

      <main className="page-pad mx-auto max-w-6xl py-24">
        <section className="mb-8 rounded-3xl border border-line bg-white p-8 md:p-10">
          <div className="mb-2 flex items-center gap-3 text-copper"><BookOpen size={24} /><span className="text-xs font-bold tracking-wider">مستودع المعرفة والمواصفات المعتمدة</span></div>
          <h1 className="mb-4 font-kufi text-3xl font-extrabold text-falaj-deep md:text-4xl">وثائق وسجلات MVP المدمجة</h1>
          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted">تُقرأ الوثائق الحالية من قاعدة البيانات. يظهر سجل الإصدارات والمقارنة للمشرفين فقط، وتختلف تفاصيل PDF وفق دور الحساب المسجّل.</p>
          {!authLoading && !user && <button type="button" onClick={startLogin} className="mb-5 h-10 rounded-xl border border-falaj px-4 text-xs font-bold text-falaj transition-colors hover:bg-falaj-soft">سجّل الدخول لعرض المستندات وتنزيلها</button>}
          {user && <p className="mb-5 flex items-center gap-2 text-xs font-bold text-falaj"><ShieldCheck size={15} /> الدور الحالي: {isAdmin ? "مشرف" : "مستثمر"}</p>}
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-paper p-4 md:flex-row">
            <div className="relative w-full md:w-96"><Search className="absolute right-3 top-3 text-muted" size={18} /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث في عنوان الوثيقة أو الملخص..." className="w-full rounded-xl border border-line bg-white py-2.5 pl-4 pr-10 text-xs outline-none focus:border-falaj" /></div>
            <div className="flex w-full items-center gap-2 overflow-x-auto md:w-auto"><Filter size={16} className="ml-1 shrink-0 text-falaj" />{[["all", "الكل"], ["data", "البيانات والـ MVP"], ["ui", "الواجهات والهوية"], ["approval", "سجلات الموافقة"], ["strategy", "الاستراتيجية"]].map(([key, label]) => <button key={key} type="button" onClick={() => setSelectedCategory(key)} className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${selectedCategory === key ? "bg-falaj text-white" : "border border-line bg-white text-ink hover:bg-falaj-soft"}`}>{label}</button>)}</div>
          </div>
          {exportMessage && <p role="status" className="mt-3 text-xs font-bold text-falaj">{exportMessage}</p>}
        </section>

        {documentsQuery.isLoading && <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-muted">يجري تحميل الوثائق المعتمدة من قاعدة البيانات.</div>}
        {documentsQuery.error && <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-muted">تعذر الوصول إلى المستندات. سجّل الدخول بحساب مخول ثم أعد المحاولة.</div>}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredDocs.map((doc) => (
            <article key={doc.id} className="flex flex-col justify-between rounded-3xl border border-line bg-white p-6 transition-colors hover:border-falaj/40">
              <div><div className="mb-3 flex items-center justify-between"><span className="rounded-full border border-falaj/20 bg-falaj/10 px-3 py-1 text-[11px] font-bold text-falaj">{doc.versionTag}</span><span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-800"><CheckCircle2 size={12} /> {doc.status}</span></div><h2 className="mb-2 font-kufi text-lg font-bold text-falaj-deep">{highlightSearchTerm(doc.title)}</h2><p className="mb-4 text-xs leading-relaxed text-muted">{highlightSearchTerm(doc.summary)}</p><div className="mb-4 rounded-xl border border-line bg-paper p-4 text-xs leading-relaxed text-ink">{highlightSearchTerm(doc.content)}</div></div>
              <div className="flex items-center justify-between gap-3 border-t border-line pt-4"><span className="text-[11px] text-muted">آخر تحديث: {new Date(doc.createdAt).toLocaleDateString("ar-OM")}</span><div className="flex items-center gap-2"><button type="button" onClick={() => downloadDocumentPdf(doc.documentKey)} disabled={isExporting} className="inline-flex items-center gap-1.5 rounded-xl bg-falaj px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70"><Download size={13} /> تنزيل PDF</button>{isAdmin && <button type="button" onClick={() => { setSelectedDocumentKey(doc.documentKey); setSelectedVersionIds({ previousId: null, currentId: null }); }} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-1.5 text-xs font-bold text-falaj transition-colors hover:bg-falaj-soft"><History size={13} /> الإصدارات</button>}</div></div>
            </article>
          ))}
        </section>
        {!documentsQuery.isLoading && !documentsQuery.error && filteredDocs.length === 0 && <div className="mt-6 rounded-3xl border border-line bg-white p-12 text-center"><FileText className="mx-auto mb-3 text-muted" size={36} /><h2 className="font-bold text-falaj-deep">لا توجد وثائق مطابقة</h2><p className="mt-1 text-xs text-muted">غيّر عبارة البحث أو الفئة لإظهار نتائج أخرى.</p></div>}

        {isAdmin && selectedDocumentKey && <section className="mt-8 rounded-3xl border border-line bg-white p-6 md:p-8"><div className="mb-5 flex items-center gap-2 text-falaj"><History size={20} /><h2 className="font-kufi text-xl font-bold">سجل الإصدارات والمقارنة</h2></div>{historyQuery.isLoading && <p className="text-sm text-muted">يجري تحميل النسخ السابقة.</p>}{historyQuery.data && <div className="grid gap-3">{historyQuery.data.map((version) => <article key={version.id} className="rounded-xl border border-line bg-paper p-4"><div className="mb-2 flex items-center justify-between gap-3"><strong className="text-sm text-falaj-deep">{version.versionTag} · {version.status}</strong><span className="text-[11px] text-muted">{new Date(version.createdAt).toLocaleDateString("ar-OM")}</span></div><p className="text-xs leading-relaxed text-muted">{version.changeSummary}</p></article>)}</div>}{historyQuery.data && historyQuery.data.length > 1 && <div className="mt-6 rounded-xl border border-line bg-paper p-4"><div className="mb-4 flex items-center gap-2 text-falaj"><GitCompareArrows size={17} /><strong className="text-sm">اختيار نسختين للمقارنة</strong></div><div className="grid gap-3 md:grid-cols-2"><label className="grid gap-1 text-xs font-bold text-falaj-deep">النسخة السابقة<select value={selectedVersionIds.previousId ?? ""} onChange={(event) => setSelectedVersionIds((current) => ({ ...current, previousId: Number(event.target.value) }))} className="h-10 rounded-lg border border-line bg-white px-3 text-xs text-ink"><option value="" disabled>اختر نسخة</option>{historyQuery.data.map((version) => <option key={version.id} value={version.id}>{version.versionTag} · {version.status}</option>)}</select></label><label className="grid gap-1 text-xs font-bold text-falaj-deep">النسخة الأحدث<select value={selectedVersionIds.currentId ?? ""} onChange={(event) => setSelectedVersionIds((current) => ({ ...current, currentId: Number(event.target.value) }))} className="h-10 rounded-lg border border-line bg-white px-3 text-xs text-ink"><option value="" disabled>اختر نسخة</option>{historyQuery.data.map((version) => <option key={version.id} value={version.id}>{version.versionTag} · {version.status}</option>)}</select></label></div></div>}{historyQuery.data && historyQuery.data.length === 1 && <p className="mt-6 rounded-xl border border-line bg-paper p-4 text-xs text-muted">لا توجد إلا نسخة واحدة معتمدة لهذه الوثيقة، لذا لا تتوفر مقارنة بعد.</p>}{comparisonQuery.data && <div className="mt-6 rounded-xl border border-line p-4"><div className="mb-3 flex items-center gap-2 text-falaj"><GitCompareArrows size={17} /><strong className="text-sm">الفروق بين النسختين المختارتين</strong></div><div className="grid gap-4 md:grid-cols-2"><div><p className="mb-2 text-xs font-bold text-falaj-deep">إضافات</p>{comparisonQuery.data.contentDiff.added.length ? <ul className="space-y-1 text-xs text-ink">{comparisonQuery.data.contentDiff.added.map((item) => <li key={item}>+ {item}</li>)}</ul> : <p className="text-xs text-muted">لا توجد إضافات نصية مسجلة.</p>}</div><div><p className="mb-2 text-xs font-bold text-falaj-deep">حذف أو استبدال</p>{comparisonQuery.data.contentDiff.removed.length ? <ul className="space-y-1 text-xs text-ink">{comparisonQuery.data.contentDiff.removed.map((item) => <li key={item}>− {item}</li>)}</ul> : <p className="text-xs text-muted">لا توجد بنود محذوفة مسجلة.</p>}</div></div></div>}</section>}
      </main>
    </div>
  );
}
