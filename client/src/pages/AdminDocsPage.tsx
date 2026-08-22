/*
 * صفحة وثائق المشرفين: عرض وقراءة مواصفات وسجلات MVP المدمجة مع محرك بحث وتصفية متقدم.
 */
import { useState, type ReactNode } from "react";
import { Search, FileText, CheckCircle2, ArrowRight, BookOpen, Filter, Download } from "lucide-react";
import { getSearchSegments } from "@/lib/documentSearch";

export default function AdminDocsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const documentsList = [
    {
      id: "doc-1",
      title: "مواصفات بيانات الحد الأدنى للمنتج (Agri MVP Data Spec)",
      category: "data",
      version: "v1.0",
      date: "أغسطس 2026",
      status: "معتمد رسمياً",
      summary: "يحدد الهيكل الأساسي لبيانات الجداول الاستثمارية، معلومات الآبار، وإحداثيات المناطق الزراعية في عُمان.",
      content: "تتضمن مواصفات البيانات الهياكل العلائقية لجداول المناطق، الآبار، عقود الشراكة الرقمية، ومؤشرات الأمن الغذائي لضمان المزامنة الفورية مع قاعدة البيانات الدائمة."
    },
    {
      id: "doc-2",
      title: "مواصفات واجهة المستخدم وإصدار المنصة (UI Release Spec)",
      category: "ui",
      version: "v2.1",
      date: "أغسطس 2026",
      status: "معتمد وساري",
      summary: "دليل التصميم الموحد وهوية (سجلّ الواحة المعاصر) مع الحفاظ على معايير مكافحة المحتوى السطحي والنمطي.",
      content: "يشترط هذا الدليل استخدام اللون الأساسي الأخضر الفلجي، تجنب الظلال المفرطة، منع استخدام الرموز التعبيرية (Emoji) في الواجهات، وتوظيف صور الأراضي الحقيقية وقطع صورة السلطان عند اللحية."
    },
    {
      id: "doc-3",
      title: "سجل اعتماد وافق وتدقيق الإصدار (MVP Approval Record)",
      category: "approval",
      version: "v1.2",
      date: "أغسطس 2026",
      status: "مكتمل التدقيق",
      summary: "سجل المراجعات والموافقات الأمنية والإدارية على العقود الرقمية وتوقيعات المستثمرين عبر رمز الاستجابة السريعة (QR).",
      content: "يسجل هذا المستند كافة عمليات التحقق والتوقيع الرقمي للمستثمرين، مع توليد رموز QR فريدة لكل عقد وتخزين السجلات في قاعدة بيانات MySQL."
    },
    {
      id: "doc-4",
      title: "خارطة طريق منصة واحات ومزارع عُمان 2040 (Roadmap)",
      category: "strategy",
      version: "v2.0",
      date: "استراتيجي",
      status: "قيد التنفيذ النشط",
      summary: "المراحل الزمنية الأربع لتطوير الاستثمار الزراعي والأمن الغذائي حتى عام 2040.",
      content: "تغطي خارطة الطريق مراحل التأسيس والربط الجغرافي الذكي، إطلاق لوحات المستثمرين والعوائد، توسيع حساسات الطقس والري الحية، وصولاً إلى التكامل الكامل للذكاء الاصطناعي والتصدير."
    }
  ];

  const filteredDocs = documentsList.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const highlightSearchTerm = (value: string): ReactNode => {
    return getSearchSegments(value, searchTerm).map((segment, index) =>
      segment.isMatch ? (
        <mark key={`${segment.text}-${index}`} className="rounded-sm bg-amber-200 px-0.5 text-ink">
          {segment.text}
        </mark>
      ) : (
        <span key={`${segment.text}-${index}`}>{segment.text}</span>
      )
    );
  };

  const downloadMvpPdf = async () => {
    const mvpSpec = documentsList.find((doc) => doc.id === "doc-1");
    if (!mvpSpec) return;

    setIsExporting(true);
    setExportMessage("");

    const exportDate = new Intl.DateTimeFormat("ar-OM", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());

    const printableDocument = document.createElement("article");
    printableDocument.dir = "rtl";
    printableDocument.style.cssText = [
      "position:fixed",
      "right:-10000px",
      "top:0",
      "width:760px",
      "padding:48px",
      "background:#fffdf7",
      "color:#163d30",
      "font-family:Arial, sans-serif",
      "line-height:1.9",
      "box-sizing:border-box",
    ].join(";");
    printableDocument.innerHTML = `
      <header style="border-bottom:2px solid #1f5a45;padding-bottom:20px;margin-bottom:28px;">
        <div style="font-size:14px;color:#b97a4c;font-weight:700;">واحات ومزارع عُمان | رؤية 2040</div>
        <h1 style="font-size:28px;margin:8px 0;color:#163d30;">${mvpSpec.title}</h1>
        <p style="margin:0;font-size:13px;color:#5f6a63;">تاريخ التصدير: ${exportDate} | الإصدار: ${mvpSpec.version}</p>
      </header>
      <section style="background:#edf5ef;border:1px solid #cfe0d3;padding:18px 20px;margin-bottom:20px;">
        <h2 style="font-size:17px;margin:0 0 8px;color:#163d30;">ملخص المواصفات</h2>
        <p style="margin:0;font-size:14px;">${mvpSpec.summary}</p>
      </section>
      <section>
        <h2 style="font-size:17px;margin:0 0 8px;color:#163d30;">نطاق البيانات</h2>
        <p style="margin:0;font-size:14px;">${mvpSpec.content}</p>
      </section>
      <footer style="border-top:1px solid #d8ded9;padding-top:16px;margin-top:28px;font-size:12px;color:#5f6a63;">
        نسخة مرجعية صادرة من مستودع وثائق المشرفين في منصة واحات ومزارع عُمان 2040.
      </footer>
    `;

    document.body.appendChild(printableDocument);

    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(printableDocument, {
        backgroundColor: "#fffdf7",
        scale: 2,
        useCORS: true,
      });
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const margin = 10;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const pageContentHeight = pageHeight - margin * 2;
      const imageData = canvas.toDataURL("image/png");

      let remainingHeight = imageHeight;
      let yOffset = margin;
      pdf.addImage(imageData, "PNG", margin, yOffset, imageWidth, imageHeight);
      remainingHeight -= pageContentHeight;

      while (remainingHeight > 0) {
        yOffset = margin - (imageHeight - remainingHeight);
        pdf.addPage();
        pdf.addImage(imageData, "PNG", margin, yOffset, imageWidth, imageHeight);
        remainingHeight -= pageContentHeight;
      }

      pdf.save("oman-agri-mvp-specification.pdf");
      setExportMessage("تم تنزيل مواصفات MVP بصيغة PDF بنجاح.");
    } catch {
      setExportMessage("تعذر إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    } finally {
      document.body.removeChild(printableDocument);
      setIsExporting(false);
    }
  };

  return (
    <div className="site-shell bg-paper min-h-screen text-ink" dir="rtl">
      <header className="site-header site-header--scrolled bg-white/90 backdrop-blur-md border-b border-line px-8 py-4 flex justify-between items-center">
        <a className="brand flex items-center gap-3" href="/">
          <span className="brand-copy">
            <strong className="text-falaj-deep font-kufi">لوحة وثائق ومواصفات MVP</strong>
            <small className="text-muted text-[11px]">منصة واحات ومزارع عُمان 2040</small>
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs font-bold text-falaj hover:underline flex items-center gap-1">
            العودة للواجهة الرئيسية <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main className="page-pad py-24 max-w-6xl mx-auto px-6">
        <div className="bg-white border border-line rounded-3xl p-8 md:p-10 shadow-sm mb-8">
          <div className="flex items-center gap-3 text-copper mb-2">
            <BookOpen size={24} />
            <span className="text-xs font-bold tracking-wider">مستودع المعرفة والمواصفات المعتمدة</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-falaj-deep font-kufi mb-4">وثائق وسجلات MVP المدمجة</h1>
          <p className="text-muted text-sm leading-relaxed max-w-3xl mb-8">
            تستعرض هذه الصفحة كافة المستندات التقنية، مواصفات البيانات، وسجلات الاعتماد المدمجة من ملف المشروع المرجعي. يمكنك البحث والتصفية للوصول السريع إلى أي متطلب تشغيلي أو هندسي.
          </p>

          {/* أدوات البحث والتصفية */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-paper p-4 rounded-2xl border border-line">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-3 text-muted" size={18} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في عنوان الوثيقة أو الملخص..."
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <Filter size={16} className="text-falaj shrink-0 ml-1" />
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'all' ? 'bg-falaj text-white' : 'bg-white text-ink border border-line hover:bg-falaj/10'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setSelectedCategory("data")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'data' ? 'bg-falaj text-white' : 'bg-white text-ink border border-line hover:bg-falaj/10'}`}
              >
                البيانات والـ MVP
              </button>
              <button 
                onClick={() => setSelectedCategory("ui")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'ui' ? 'bg-falaj text-white' : 'bg-white text-ink border border-line hover:bg-falaj/10'}`}
              >
                الواجهات والهوية
              </button>
              <button 
                onClick={() => setSelectedCategory("approval")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'approval' ? 'bg-falaj text-white' : 'bg-white text-ink border border-line hover:bg-falaj/10'}`}
              >
                سجلات الموافقة
              </button>
              <button 
                onClick={() => setSelectedCategory("strategy")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === 'strategy' ? 'bg-falaj text-white' : 'bg-white text-ink border border-line hover:bg-falaj/10'}`}
              >
                الاستراتيجية
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-xs text-muted">تتضمن النسخة القابلة للتنزيل العنوان والإصدار وتاريخ التصدير وملخص نطاق البيانات.</p>
            <button
              type="button"
              onClick={downloadMvpPdf}
              disabled={isExporting}
              className="h-10 shrink-0 rounded-xl bg-falaj px-4 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:cursor-wait disabled:opacity-70 inline-flex items-center gap-2"
            >
              <Download size={15} />
              {isExporting ? "يجري إعداد ملف PDF" : "تنزيل مواصفات MVP بصيغة PDF"}
            </button>
          </div>
          {exportMessage && <p role="status" className="mt-3 text-xs font-bold text-falaj">{exportMessage}</p>}
        </div>

        {/* شبكة عرض المستندات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white border border-line rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-falaj/40 transition-all">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-falaj/10 text-falaj text-[11px] font-bold px-3 py-1 rounded-full border border-falaj/20">
                    {doc.version}
                  </span>
                  <span className="bg-green-100 text-green-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} /> {doc.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-falaj-deep font-kufi mb-2">{highlightSearchTerm(doc.title)}</h3>
                <p className="text-xs text-muted mb-4 leading-relaxed">{highlightSearchTerm(doc.summary)}</p>
                <div className="bg-paper p-4 rounded-xl border border-line text-xs text-ink leading-relaxed mb-4">
                  {highlightSearchTerm(doc.content)}
                </div>
              </div>

              <div className="pt-4 border-t border-line flex justify-between items-center">
                <span className="text-[11px] text-muted">تاريخ الإصدار: {doc.date}</span>
                {doc.id === "doc-1" ? (
                  <button
                    type="button"
                    onClick={downloadMvpPdf}
                    disabled={isExporting}
                    className="rounded-xl bg-falaj px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-falaj-deep disabled:opacity-70 inline-flex items-center gap-1.5"
                  >
                    <Download size={13} /> تنزيل PDF
                  </button>
                ) : (
                  <span className="text-[11px] text-muted">المحتوى متاح للقراءة أعلاه</span>
                )}
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="col-span-2 text-center py-16 bg-white border border-line rounded-3xl">
              <FileText size={48} className="mx-auto text-muted mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-falaj-deep">لا توجد وثائق تطابق بحثك</h3>
              <p className="text-xs text-muted mt-1">جرب إدخال كلمات بحث أخرى أو تغيير تصفية الفئات.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
