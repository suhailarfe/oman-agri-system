/*
 * صفحة تخطيط وهندسة النظام المتكامل (ERD، دراسة الجدوى، وهندسة قواعد البيانات)
 */
import { ArrowRight, Database, FileText, Cpu, CheckCircle2, Layers } from "lucide-react";

export default function SystemArchitecturePage() {
  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>هندسة النظام المتكامل ودراسة الجدوى</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-copper text-xs font-bold tracking-widest uppercase mb-3 block">الهندسة المعمارية ونموذج البيانات</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi mb-4">هندسة ونظام الويب المتكامل 2040</h1>
          <p className="text-muted max-w-2xl mx-auto text-base">توثيق هيكل الكيانات (ERD)، دراسة الجدوى الاستثمارية للأمن الغذائي، ومسارات التدفق البرمجي المتكامل.</p>
        </div>

        {/* قسم ERD وهندسة الجداول */}
        <div className="bg-white border border-line rounded-3xl p-8 md:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 text-falaj mb-6">
            <Database size={26} />
            <h2 className="text-2xl font-bold font-kufi">مخطط الكيانات وعلاقات قاعدة البيانات (ERD)</h2>
          </div>
          <p className="text-ink leading-relaxed mb-6">
            يعتمد النظام على بنية قواعد بيانات مترابطة (Relational DB) مصممة لضمان سلامة البيانات وسرعة الاستعلام اللحظي بين مكاتب المشرفين والمزارع والواحات:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-falaj-soft border border-falaj/20">
              <h3 className="font-bold text-falaj-deep mb-2 font-kufi">جدول المستخدمين (Users)</h3>
              <ul className="text-xs text-ink space-y-1.5">
                <li>• id (Primary Key)</li>
                <li>• openId / email</li>
                <li>• role (admin / supervisor / user)</li>
                <li>• lastSignedIn</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-falaj-soft border border-falaj/20">
              <h3 className="font-bold text-falaj-deep mb-2 font-kufi">جدول المناطق (Regions)</h3>
              <ul className="text-xs text-ink space-y-1.5">
                <li>• code (Primary Key)</li>
                <li>• name, area, number</li>
                <li>• crop, water, irrigationSystem</li>
                <li>• supervisor, status</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-falaj-soft border border-falaj/20">
              <h3 className="font-bold text-falaj-deep mb-2 font-kufi">جدول الاستفسارات (Inquiries)</h3>
              <ul className="text-xs text-ink space-y-1.5">
                <li>• id (Primary Key)</li>
                <li>• name, email, regionCode</li>
                <li>• message, createdAt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* دراسة الجدوى */}
        <div className="bg-white border border-line rounded-3xl p-8 md:p-10 shadow-sm mb-12">
          <div className="flex items-center gap-3 text-copper mb-6">
            <FileText size={26} />
            <h2 className="text-2xl font-bold font-kufi">دراسة الجدوى الاستثمارية لبرنامج الأمن الغذائي</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-ink leading-relaxed mb-4">
                تستند دراسة الجدوى المدمجة في النظام إلى معطيات رؤية عُمان 2040 لتعظيم العائد الاقتصادي من الأراضي الحكومية الواعدة، وتقليل الاعتماد على الواردات الخارجية بنسبة تتجاوز 75% في المحاصيل الاستراتيجية.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-falaj mt-1 flex-shrink-0" />
                  <span className="text-xs text-ink">معدل العائد الداخلي المتوقع (IRR): 14.5% سنوياً.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-falaj mt-1 flex-shrink-0" />
                  <span className="text-xs text-ink">فترة استرداد رأس المال: 5.8 سنوات عبر الشراكة بين القطاعين (PPP).</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-falaj mt-1 flex-shrink-0" />
                  <span className="text-xs text-ink">استدامة الموارد المائية عبر التقنيات الحديثة وإعادة تدوير المياه.</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-paper border border-line">
              <h3 className="font-bold text-falaj-deep mb-3 font-kufi">البرامج والأدوات المستخدمة في تطوير النظام:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-falaj">React 19 & TypeScript</span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-falaj">Tailwind CSS 4</span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-falaj">tRPC & Express 4</span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-falaj">Drizzle ORM & MySQL</span>
                <span className="px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-falaj">Framer Motion & Lucide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="primary-button inline-flex items-center gap-2">
            العودة إلى المنصة الرئيسية <ArrowRight size={16} />
          </a>
        </div>
      </main>
    </div>
  );
}
