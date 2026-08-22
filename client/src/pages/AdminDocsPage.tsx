/*
 * صفحة وثائق المشرفين: عرض وقراءة مواصفات وسجلات MVP المدمجة مع محرك بحث وتصفية متقدم.
 */
import { useState } from "react";
import { Search, FileText, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Filter, Download } from "lucide-react";

export default function AdminDocsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          <a href="/admin" className="text-xs font-bold text-falaj hover:underline flex items-center gap-1">
            لوحة تحكم المشرفين <ArrowRight size={14} />
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
                <h3 className="text-lg font-bold text-falaj-deep font-kufi mb-2">{doc.title}</h3>
                <p className="text-xs text-muted mb-4 leading-relaxed">{doc.summary}</p>
                <div className="bg-paper p-4 rounded-xl border border-line text-xs text-ink leading-relaxed mb-4">
                  {doc.content}
                </div>
              </div>

              <div className="pt-4 border-t border-line flex justify-between items-center">
                <span className="text-[11px] text-muted">تاريخ الإصدار: {doc.date}</span>
                <button 
                  onClick={() => alert(`جاري تنزيل نسخة مرجعية من المستند: ${doc.title}`)}
                  className="bg-falaj hover:bg-falaj-deep text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download size={13} /> تحميل المستند
                </button>
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
