/*
 * Design system: سجلّ الواحة المعاصر + صورة السلطان في بطاقة 3D + شعار 2040 بجوار النص + الفلاتر ولوحة المشرفين والتصدير.
 */
import { useMemo, useState } from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trpc } from "@/lib/trpc";
import { regionDetailHref } from "@/lib/regionLedger";
import { filterRegions } from "@/lib/regionFilters";
import { filterWaterLedger, toWaterChartPoints, type WaterSalinityFilter, type WaterSort } from "@/lib/waterFilters";
import { buildWaterLedgerCsv, buildWaterLedgerPrintHtml, type WaterExportRecord } from "@/lib/waterExport";
import { useAuth } from "@/_core/hooks/useAuth";
import { RegionFilters } from "@/components/RegionFilters";
import { RegionFilterResults } from "@/components/RegionFilterResults";
import { startLogin } from "@/const";
import { sultanHaithamData, visionMarkData } from "@/attachedAssets";
import {
  ArrowUpLeft,
  Droplets,
  ExternalLink,
  MapPin,
  Menu,
  Sprout,
  X,
  Compass,
  ShieldCheck,
  UserCheck,
  Settings,
  FileDown,
  Filter,
  Download,
} from "lucide-react";

const assets = {
  hero: "/manus-storage/oman-oasis-hero-reference_def5e252.jpg",
  sultanHaitham: sultanHaithamData,
  visionMark: visionMarkData,
  about: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=86",
  water: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=86",
};

const navItems = [
  { label: "عن المبادرة", href: "#about" },
  { label: "الخريطة والفلاتر", href: "#map-section" },
  { label: "مؤشرات الأمن الغذائي", href: "#food-security" },
  { label: "لوحة المشرفين", href: "#admin-dashboard" },
  { label: "هندسة النظام وERD", href: "/architecture" },
  { label: "الجدوى المالية وتصدير Excel", href: "/feasibility" },
  { label: "تواصل", href: "#contact" },
];

function LogoMark() {
  return (
    <svg className="brand-mark brand-mark--svg" viewBox="0 0 64 64" role="img" aria-label="رمز واحات ومزارع عُمان">
      <path d="M10 44c8-9 16-11 23-7 6 3 12 2 21-6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M28 38c-1-11 1-20 9-27 1 10-1 18-9 27Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M37 12c7 2 11 6 14 13-7-1-12-5-14-13Z" fill="currentColor" opacity=".72" />
      <path d="M19 50h30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".45" />
      <text x="32" y="59" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="IBM Plex Sans Arabic, sans-serif" letterSpacing="1.2">2040</text>
    </svg>
  );
}

function SectionLabel({ number, children, dark = false }: { number: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`section-label ${dark ? "section-label--dark" : ""}`}>
      <span>{number}</span>
      <i />
      <span>{children}</span>
    </div>
  );
}

function WaterHistoryTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { date: string; salinityPpm: number; sourceName: string; ph: string | number; flowRate: string; operationalStatus: string } }> }) {
  const record = payload?.[0]?.payload;
  if (!active || !record) return null;
  return <aside className="water-history-tooltip"><strong>{record.date}</strong><dl><div><dt>الملوحة</dt><dd>{record.salinityPpm} جزء/مليون</dd></div><div><dt>المصدر</dt><dd>{record.sourceName}</dd></div><div><dt>الرقم الهيدروجيني</dt><dd>{record.ph}</dd></div><div><dt>التدفق</dt><dd>{record.flowRate}</dd></div><div><dt>التشغيل</dt><dd>{record.operationalStatus}</dd></div></dl></aside>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "water" | "metrics">("overview");

  // تصفية (فلاتر) الخريطة
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterCropType, setFilterCropType] = useState("all");
  const [waterRegion, setWaterRegion] = useState("all");
  const [waterSalinityFilter, setWaterSalinityFilter] = useState<WaterSalinityFilter>("all");
  const [waterSort, setWaterSort] = useState<WaterSort>("latest");
  const [waterExportMessage, setWaterExportMessage] = useState("");
  const [waterPdfExporting, setWaterPdfExporting] = useState(false);

  // جلب البيانات
  const utils = trpc.useUtils();
  const { data: regionsData, isLoading: regionsLoading } = trpc.agri.getRegions.useQuery();
  const { data: waterLedger, isLoading: waterLedgerLoading, isError: waterLedgerError } = trpc.agri.getWaterLedger.useQuery();
  const waterHistoryQuery = trpc.program.water.history.useQuery();
  const { data: foodSecurityMetrics } = trpc.agri.getFoodSecurityMetrics.useQuery();
  const { data: currentUser } = trpc.auth.me.useQuery();
  const savedAuditFiltersQuery = trpc.program.roadmap.savedFilters.list.useQuery(undefined, { enabled: currentUser?.role === "admin" });

  // نموذج تحديث المشرفين
  const [editRegionCode, setEditRegionCode] = useState("najd");
  const [editCrop, setEditCrop] = useState("");
  const [editIrrigation, setEditIrrigation] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRegion, setContactRegion] = useState("najd");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const inquiryMutation = trpc.agri.registerInquiry.useMutation({
    onSuccess: () => {
      setContactSent(true);
      setContactError("");
    },
    onError: (err) => {
      setContactError(err.message || "حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة لاحقاً.");
    }
  });

  const updateRegionMutation = trpc.agri.updateRegionData.useMutation({
    onSuccess: (res) => {
      setUpdateMsg(res.message);
      utils.agri.getRegions.invalidate();
    },
    onError: (err) => {
      setUpdateMsg(err.message);
    }
  });

  const handleAdminUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateRegionMutation.mutate({
      code: editRegionCode,
      crop: editCrop || "محاصيل استراتيجية حديثة",
      irrigationSystem: editIrrigation || "ري ذكي متطور",
      status: editStatus || "نشط ومعتمد 2040"
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredRegions = filterRegions(regionsData, filterRegion, filterCropType);
  const filteredWaterLedger = useMemo(
    () => filterWaterLedger(waterLedger, waterRegion, waterSalinityFilter, waterSort),
    [waterLedger, waterRegion, waterSalinityFilter, waterSort]
  );
  const activeChartRegion = waterRegion === "all" ? "najd" : waterRegion;
  const waterChartPoints = useMemo(
    () => toWaterChartPoints(waterHistoryQuery.data, activeChartRegion),
    [waterHistoryQuery.data, activeChartRegion]
  );
  const waterExportRecords = useMemo<WaterExportRecord[]>(() => filteredWaterLedger.map((reading) => ({
    regionName: regionsData?.find((region) => region.code === reading.regionCode)?.name ?? reading.regionCode,
    sourceName: reading.sourceName,
    sourceType: reading.sourceType,
    salinityPpm: reading.salinityPpm,
    ph: reading.ph,
    flowRate: reading.flowRate,
    operationalStatus: reading.operationalStatus,
    sampledAt: reading.sampledAt,
  })), [filteredWaterLedger, regionsData]);
  const downloadWaterCsv = () => {
    const blob = new Blob([buildWaterLedgerCsv(waterExportRecords)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "oman-agri-water-ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
    setWaterExportMessage("تم تنزيل قراءات المياه المصفاة بصيغة CSV.");
  };
  const downloadWaterPdf = async () => {
    if (!waterExportRecords.length) return;
    setWaterPdfExporting(true);
    setWaterExportMessage("");
    try {
      const printable = document.createElement("article");
      printable.dir = "rtl";
      printable.style.cssText = "position:fixed;right:-10000px;top:0;width:760px;padding:48px;background:#fffdf7;color:#163d30;font-family:Arial,sans-serif;line-height:1.9;box-sizing:border-box;";
      printable.innerHTML = buildWaterLedgerPrintHtml(waterExportRecords, new Date());
      document.body.appendChild(printable);
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")]);
      const canvas = await html2canvas(printable, { backgroundColor: "#fffdf7", scale: 2, useCORS: true });
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const margin = 10;
      const width = pdf.internal.pageSize.getWidth() - margin * 2;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", margin, margin, width, height);
      pdf.save("oman-agri-water-ledger.pdf");
      printable.remove();
      setWaterExportMessage("تم تنزيل تقرير ملف المياه بصيغة PDF.");
    } catch {
      setWaterExportMessage("تعذر إنشاء ملف PDF. أعد المحاولة لاحقاً.");
    } finally {
      setWaterPdfExporting(false);
    }
  };

  return (
    <div className="site-shell" dir="rtl">
      {/* شريط التنقل */}
      <header className="site-header site-header--scrolled">
        <a className="brand" href="#top" aria-label="واحات ومزارع عمان — الرئيسية">
          <LogoMark />
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>رؤية عُمان <b>2040</b></small>
          </span>
        </a>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          {currentUser ? (
            <>
              {currentUser.role === "admin" && <a href="/admin/water">إدارة قراءات المياه</a>}
              <span className="user-badge-pill"><UserCheck size={14} /> {currentUser.name || currentUser.email} ({currentUser.role})</span>
            </>
          ) : (
            <button className="nav-contact" onClick={() => startLogin()}>تسجيل الدخول <UserCheck size={14} /></button>
          )}
        </nav>
        <button className="menu-toggle" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {/* القسم الرئيسي: شعار 2040 بجوار النص، وبطاقة 3D تحتوي صورة جلالة السلطان المعظم */}
        <section className="hero-vision-official" aria-labelledby="hero-title">
          <div className="hero-vision-bg" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-vision-overlay" />

          <div className="hero-vision-container page-pad">
            <div className="hero-vision-content">
              {/* شعار رؤية عُمان 2040 بجوار عبارة البرنامج الحكومي */}
              <div className="vision-badge-header">
                <img src={assets.visionMark} alt="شعار رؤية عمان 2040" className="vision-official-mark" />
                <span>برنامج الأمن الغذائي والاستزراع الحكومي — رؤية عُمان 2040</span>
              </div>
              <h1 id="hero-title">
                نحو مستقبل زراعي مستدام<br />
                <em>برؤية عُمان 2040</em>
              </h1>
              <p className="hero-official-desc">
                استغلال الأراضي الحكومية الواعدة، توظيف التقنيات الحديثة، وتحقيق الأمن الغذائي المستدام تحت التوجيهات السامية لحضرة صاحب الجلالة السلطان هيثم بن طارق المعظم حفظه الله ورعاه.
              </p>
              <div className="hero-buttons">
                <a className="primary-button" href="#map-section">
                  الخريطة التفاعلية والفلاتر <Compass size={17} />
                </a>
                <button className="text-button text-white" onClick={handleExportPDF}>
                  تصدير تقرير الأمن الغذائي (PDF) <FileDown size={16} />
                </button>
              </div>
            </div>

            {/* بطاقة 3D تحتوي صورة جلالة السلطان المعظم */}
            <div className="motion-3d-card">
              <div className="motion-3d-inner">
                <div className="motion-3d-image">
                  <img src={assets.sultanHaitham} alt="المقام السامي لحضرة صاحب الجلالة السلطان هيثم بن طارق المعظم" />
                  <div className="motion-3d-caption">
                    <strong>حضرة صاحب الجلالة</strong>
                    <span>السلطان هيثم بن طارق المعظم حفظه الله ورعاه</span>
                  </div>
                </div>
                <div className="motion-3d-brand">
                  <img src={assets.visionMark} alt="شعار 2040" />
                  <span>سلطنة عُمان — نحو الأفق</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="claude-ledger-section page-pad" aria-labelledby="land-ledger-title">
          <div className="claude-ledger-intro">
            <div>
              <SectionLabel number="01" dark>ملف الأرض</SectionLabel>
              <h2 id="land-ledger-title">خريطة تبدأ<br /><span>من المكان.</span></h2>
            </div>
            <p>لكل منطقة قصتها ومحاصيلها وماؤها. هذه القراءة التحريرية تستخدم سجلات المناطق الحية نفسها، وتفتح الصفحة التفصيلية لكل فرصة دون تغيير مسارها.</p>
          </div>
          {regionsLoading ? (
            <p className="claude-ledger-loading">يجري قراءة سجل المناطق.</p>
          ) : (
            <div className="claude-ledger-grid">
              {filteredRegions?.map((reg) => (
                <article key={`ledger-${reg.code}`} className="claude-ledger-card">
                  <span className="claude-ledger-index">{reg.number}</span>
                  <div>
                    <h3>{reg.name}</h3>
                    <p>{reg.description}</p>
                  </div>
                  <dl>
                    <div><dt>المحاصيل</dt><dd>{reg.crop}</dd></div>
                    <div><dt>الماء</dt><dd>{reg.water}</dd></div>
                  </dl>
                  <a href={regionDetailHref(reg.code)} className="claude-ledger-link">عرض ملف المنطقة</a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="water-ledger-section page-pad" aria-labelledby="water-ledger-title">
          <div className="water-ledger-heading">
            <div>
              <SectionLabel number="02">ملف المياه</SectionLabel>
              <h2 id="water-ledger-title">القراءة الأخيرة<br /><span>من مصادر الماء.</span></h2>
            </div>
            <p>يعرض السجل أحدث قياس محفوظ في قاعدة البيانات لكل منطقة. يوضح الرقم حالة الملوحة في المصدر، ويقود إلى ملف المنطقة الكامل لمراجعة تاريخ القياسات.</p>
          </div>
          <div className="water-ledger-tools" aria-label="فلاتر ملف المياه">
            <label htmlFor="water-region-filter">المنطقة<select id="water-region-filter" value={waterRegion} onChange={(event) => setWaterRegion(event.target.value)}><option value="all">كل المناطق</option><option value="najd">النجد، ظفار</option><option value="batinah">سهل الباطنة</option><option value="dhahirah">محافظة الظاهرة</option><option value="wusta">المنطقة الوسطى</option><option value="jabal">الجبل الأخضر</option></select></label>
            <label htmlFor="water-salinity-filter">حالة الملوحة<select id="water-salinity-filter" value={waterSalinityFilter} onChange={(event) => setWaterSalinityFilter(event.target.value as WaterSalinityFilter)}><option value="all">كل الحالات</option><option value="within-limit">ضمن الحد المرجعي</option><option value="requires-review">يلزم فحص</option></select></label>
            <label htmlFor="water-sort">ترتيب القراءات<select id="water-sort" value={waterSort} onChange={(event) => setWaterSort(event.target.value as WaterSort)}><option value="latest">الأحدث أولاً</option><option value="salinity-desc">الملوحة الأعلى</option><option value="salinity-asc">الملوحة الأقل</option></select></label>
          </div>
          <div className="water-ledger-export" aria-label="تصدير ملف المياه"><button type="button" onClick={downloadWaterCsv} disabled={!waterExportRecords.length} className="water-ledger-export-button"><Download size={15} /> تصدير CSV</button><button type="button" onClick={downloadWaterPdf} disabled={!waterExportRecords.length || waterPdfExporting} className="water-ledger-export-button water-ledger-export-button--primary"><FileDown size={15} /> {waterPdfExporting ? "يجري إعداد PDF" : "تصدير PDF"}</button>{waterExportMessage && <p role="status">{waterExportMessage}</p>}</div>
          {waterLedgerLoading ? (
            <p className="water-ledger-state">يجري تحميل أحدث قياسات الآبار.</p>
          ) : waterLedgerError ? (
            <p className="water-ledger-state" role="alert">تعذر قراءة قياسات المياه حالياً. يرجى إعادة المحاولة لاحقاً.</p>
          ) : !filteredWaterLedger.length ? (
            <p className="water-ledger-state" role="status">لا توجد قياسات تطابق فلاتر ملف المياه المحددة.</p>
          ) : (
            <div className="water-ledger-grid">
              {filteredWaterLedger.map((reading) => {
                const region = regionsData?.find((item) => item.code === reading.regionCode);
                const requiresAttention = reading.salinityPpm > 400;
                return (
                  <article key={reading.id} className={`water-ledger-card ${requiresAttention ? "water-ledger-card--alert" : ""}`}>
                    <div className="water-ledger-card-top">
                      <span>{region?.number ?? "—"}</span>
                      <span className="water-ledger-status">{requiresAttention ? "يلزم فحص" : "ضمن الحد المرجعي"}</span>
                    </div>
                    <h3>{region?.name ?? reading.regionCode}</h3>
                    <p>{reading.sourceName}</p>
                    <dl>
                      <div><dt>الملوحة</dt><dd>{reading.salinityPpm} جزء/مليون</dd></div>
                      <div><dt>الرقم الهيدروجيني</dt><dd>{reading.ph}</dd></div>
                      <div><dt>التدفق</dt><dd>{reading.flowRate}</dd></div>
                    </dl>
                    <div className="water-ledger-footer">
                      <span>آخر تسجيل: {new Date(reading.sampledAt).toLocaleDateString("ar-OM")}</span>
                      <a href={regionDetailHref(reading.regionCode)}>ملف المنطقة</a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <section className="water-history-chart" aria-labelledby="water-history-title">
            <div><p className="section-label"><span>03</span><i /><span>السجل الزمني</span></p><h3 id="water-history-title">تغير الملوحة في {regionsData?.find((region) => region.code === activeChartRegion)?.name ?? activeChartRegion}</h3><p>الخط النحاسي يمثل حد المراجعة البالغ 400 جزء/مليون.</p></div>
            {waterHistoryQuery.isLoading ? <p className="water-ledger-state">يجري تحميل السجل التاريخي.</p> : waterHistoryQuery.error ? <p role="alert" className="water-ledger-state">تعذر تحميل السجل التاريخي للملوحة.</p> : waterChartPoints.length ? <div className="water-chart-frame"><ResponsiveContainer width="100%" height={240}><LineChart data={waterChartPoints} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5f6a63" }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#5f6a63" }} width={42} /><Tooltip content={<WaterHistoryTooltip />} cursor={{ stroke: "#b97a4c", strokeWidth: 1 }} /><ReferenceLine y={400} stroke="#b97a4c" strokeDasharray="4 4" /><Line type="monotone" dataKey="salinityPpm" stroke="#1f5a45" strokeWidth={2} dot={{ r: 3, fill: "#1f5a45" }} activeDot={{ r: 4 }} /></LineChart></ResponsiveContainer></div> : <p className="water-ledger-state">لا توجد قراءات تاريخية معتمدة لهذه المنطقة.</p>}
          </section>
        </section>

        {/* قسم الخريطة التفاعلية مع الفلاتر */}
        <section className="interactive-map-section page-pad" id="map-section">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">الخريطة الحية والفلاتر</SectionLabel>
              <h2>تصفية الواحات والمزارع<br /><span>حسب المنطقة والمحصول.</span></h2>
            </div>
            <p>استخدم أدوات التصفية أدناه لاستعراض المناطق الواعدة وفقاً لمتطلبات الاستثمار أو نوع المحاصيل المستهدفة.</p>
          </div>

          <RegionFilters
            region={filterRegion}
            crop={filterCropType}
            onRegionChange={setFilterRegion}
            onCropChange={setFilterCropType}
          />

          {regionsLoading ? (
            <div className="text-center py-12 text-muted">جاري تحميل الواحات...</div>
          ) : (
            <RegionFilterResults regions={filteredRegions} onOpen={setSelectedRegion} />
          )}
        </section>

        {/* نافذة التفاصيل Modal */}
        {selectedRegion && (
          <div className="region-modal-overlay" onClick={() => setSelectedRegion(null)}>
            <div className="region-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedRegion(null)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <span className="modal-kicker">نافذة المنطقة الزراعية — قاعدة البيانات</span>
                <h2>{selectedRegion.name}</h2>
                <p className="modal-sub">{selectedRegion.area} | المشرف المسؤول: <b>{selectedRegion.supervisor}</b></p>
              </div>

              <div className="modal-tabs">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>النظرة الاستراتيجية</button>
                <button className={activeTab === 'crops' ? 'active' : ''} onClick={() => setActiveTab('crops')}>المحاصيل المقترحة</button>
                <button className={activeTab === 'water' ? 'active' : ''} onClick={() => setActiveTab('water')}>الأنظمة المائية والري</button>
                <button className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>مؤشرات الاستثمار</button>
              </div>

              <div className="modal-body">
                {activeTab === 'overview' && (
                  <div className="tab-pane">
                    <p><strong>الوصف التحليلي:</strong> {selectedRegion.description}</p>
                    <p className="mt-4"><strong>الخطة التنفيذية 2040:</strong> {selectedRegion.details}</p>
                    <div className="modal-badge-row mt-6">
                      <span>الحالة التشغيلية: {selectedRegion.status}</span>
                      <span>المشرف: {selectedRegion.supervisor}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'crops' && (
                  <div className="tab-pane">
                    <h3>المحاصيل المعتمدة في قاعدة البيانات:</h3>
                    <div className="crop-highlight-box">
                      <Sprout size={22} />
                      <strong>{selectedRegion.crop}</strong>
                    </div>
                  </div>
                )}

                {activeTab === 'water' && (
                  <div className="tab-pane">
                    <h3>موارد وحلول المياه والري المخصصة:</h3>
                    <div className="water-highlight-box">
                      <Droplets size={22} />
                      <strong>{selectedRegion.water}</strong>
                    </div>
                    <p className="mt-3"><strong>نظام الري المعتمد حالياً:</strong> {selectedRegion.irrigationSystem}</p>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="tab-pane">
                    <h3>مؤشرات الجدوى والأداء:</h3>
                    <div className="metrics-grid">
                      <div className="metric-box">
                        <span>الاستثمار المقدر</span>
                        <strong>{selectedRegion.metrics.investment}</strong>
                      </div>
                      <div className="metric-box">
                        <span>السعة المكانية</span>
                        <strong>{selectedRegion.metrics.capacity}</strong>
                      </div>
                      <div className="metric-box">
                        <span>معدل الاستدامة</span>
                        <strong>{selectedRegion.metrics.sustainability}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="primary-button" onClick={() => setSelectedRegion(null)}>إغلاق النافذة</button>
              </div>
            </div>
          </div>
        )}

        {/* قسم الأمن الغذائي وتصدير PDF */}
        <section className="food-security-section page-pad" id="food-security">
          <div className="section-heading">
            <div>
              <SectionLabel number="02">تحليل وثيقة الـ PDF</SectionLabel>
              <h2>مؤشرات الأمن الغذائي<br /><span>لسلطنة عُمان 2040.</span></h2>
            </div>
            <div>
              <button className="primary-button" onClick={handleExportPDF}>
                تصدير التقرير بصيغة PDF <FileDown size={16} />
              </button>
            </div>
          </div>

          <div className="metrics-cards-grid">
            {foodSecurityMetrics?.selfSufficiencyGoals.map((goal, idx) => (
              <div className="security-metric-card" key={idx}>
                <div className="metric-card-top">
                  <ShieldCheck size={24} className="text-copper" />
                  <span className="target-badge">هدف 2040: {goal.target}</span>
                </div>
                <h3>{goal.crop}</h3>
                <div className="progress-bar-container">
                  <div className="progress-fill" style={{ width: goal.current }} />
                </div>
                <div className="metric-card-footer">
                  <span>النسبة الحالية: <b>{goal.current}</b></span>
                  <small>{goal.status}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* لوحة تحكم المشرفين */}
        <section className="admin-dashboard-section page-pad" id="admin-dashboard">
          <div className="section-heading">
            <div>
              <SectionLabel number="03">لوحة تحكم المشرفين</SectionLabel>
              <h2>إدارة وتحديث المحاصيل<br /><span>وحالة الري فورياً.</span></h2>
            </div>
            <p>يتيح هذا القسم للمشرفين المخولين تحديث نوع المحاصيل ونظام الري في أي منطقة زراعية مباشرة عبر قاعدة البيانات.</p>
          </div>

          <div className="admin-panel-box">
            {currentUser?.role !== 'admin' ? (
              <div className="admin-lock-banner">
                <Settings size={28} className="text-copper" />
                <div>
                  <strong>منطقة مخصصة للمشرفين والإدارة العليا</strong>
                  <p>أنت مسجل حالياً بدور ({currentUser?.role || 'زائر'}). لتجربة تحديث البيانات، يرجى تسجيل الدخول بحساب مشرف أو ترقية الصلاحية.</p>
                </div>
                <button className="primary-button" onClick={() => startLogin()}>تسجيل الدخول كمشرف <UserCheck size={16} /></button>
              </div>
            ) : (
              <>
                <section className="mb-5 rounded-xl border border-line bg-paper p-4">
                  <div className="mb-3 flex items-center gap-2 text-falaj"><Filter size={16} /><strong className="text-sm">وصول سريع لسجل التدقيق</strong></div>
                  <p className="mb-3 text-xs leading-relaxed text-muted">طبّق أحد الفلاتر المحفوظة مباشرة لفتح سجل خارطة الطريق بالبحث والنطاق الزمني المحددين.</p>
                  {savedAuditFiltersQuery.data?.length ? <div className="flex flex-wrap gap-2">{savedAuditFiltersQuery.data.map((filter) => <a key={filter.id} href={`/roadmap?auditFilter=${filter.id}`} className="inline-flex h-9 items-center rounded-lg border border-falaj px-3 text-xs font-bold text-falaj hover:bg-falaj-soft">{filter.name}</a>)}</div> : <p className="text-xs text-muted">لم تُحفظ فلاتر بعد. أنشئ فلترًا من سجل تدقيق خارطة الطريق ليظهر هنا.</p>}
                </section>
              <form onSubmit={handleAdminUpdate} className="admin-form">
                <h3>لوحة تعديل بيانات الواحات الزراعية (مشرف معتمد)</h3>
                {updateMsg && <div className="update-alert">{updateMsg}</div>}
                <div className="admin-form-grid">
                  <div>
                    <label>اختر المنطقة الزراعية:</label>
                    <select value={editRegionCode} onChange={(e) => setEditRegionCode(e.target.value)}>
                      <option value="najd">منطقة النجد — ظفار</option>
                      <option value="batinah">سهل الباطنة</option>
                      <option value="dhahirah">محافظة الظاهرة</option>
                      <option value="wusta">المنطقة الوسطى</option>
                      <option value="jabal">الجبل الأخضر</option>
                    </select>
                  </div>
                  <div>
                    <label>تحديث المحاصيل المعتمدة:</label>
                    <input 
                      type="text" 
                      placeholder="مثال: قمح استراتيجي، طماطم عضوية..." 
                      value={editCrop} 
                      onChange={(e) => setEditCrop(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label>تحديث نظام وحالة الري:</label>
                    <input 
                      type="text" 
                      placeholder="مثال: ري محوري ذكي متحكم بالحاسوب" 
                      value={editIrrigation} 
                      onChange={(e) => setEditIrrigation(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label>الحالة التشغيلية:</label>
                    <input 
                      type="text" 
                      placeholder="مثال: نشط / توسع 2040" 
                      value={editStatus} 
                      onChange={(e) => setEditStatus(e.target.value)} 
                    />
                  </div>
                </div>
                <button type="submit" className="primary-button mt-4">
                  حفظ وتحديث البيانات فوراً في قاعدة البيانات
                </button>
              </form>
              </>
            )}
          </div>
        </section>

        {/* نافذة تواصل معنا: معلومات التواصل ونموذج الاستفسار */}
        <section className="contact-section page-pad" id="contact">
          <div className="contact-section-intro">
            <SectionLabel number="04">تواصل معنا</SectionLabel>
            <h2>نحوّل الفكرة<br /><span>إلى مشروع قابل للنمو.</span></h2>
            <p>للاستفسارات حول الأراضي الزراعية، فرص الاستثمار، تحديثات الري، أو التعاون مع مشرفي المناطق، تواصل مع فريق المبادرة عبر القنوات التالية.</p>
            <div className="contact-details">
              <a href="mailto:suhailarfe@gmail.com">suhailarfe@gmail.com</a>
              <a href="tel:+967736986271">+967 736 986 271</a>
              <span>سلطنة عُمان — برنامج الأمن الغذائي والاستزراع الحكومي</span>
            </div>
          </div>
          <div className="contact-form-card">
            {contactSent ? (
              <div className="contact-success">
                <strong>تم استلام رسالتك بنجاح.</strong>
                <p>حُفظ الاستفسار في سجل التواصل، وسيقوم فريق المبادرة بمراجعته.</p>
                <button className="text-button text-falaj mt-4 underline text-xs" onClick={() => { setContactSent(false); setContactName(""); setContactEmail(""); setContactMessage(""); }}>إرسال استفسار جديد</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={(event) => {
                event.preventDefault();
                let hasError = false;
                if (!contactName.trim()) {
                  setNameError("حقل الاسم الكامل مطلوب.");
                  hasError = true;
                } else {
                  setNameError("");
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!contactEmail.trim() || !emailRegex.test(contactEmail)) {
                  setEmailError("يرجى إدخال بريد إلكتروني صحيح (مثال: name@domain.com).");
                  hasError = true;
                } else {
                  setEmailError("");
                }
                if (hasError) {
                  setContactError("يرجى تصحيح الأخطاء أدناه قبل المتابعة.");
                  return;
                }
                setContactError("");
                inquiryMutation.mutate({
                  name: contactName,
                  email: contactEmail,
                  regionCode: contactRegion,
                  message: contactMessage || "طلب تواصل عام حول مبادرة الأمن الغذائي.",
                });
              }}>
                <h3>أرسل استفسارك</h3>
                {contactError && <div className="contact-error-alert text-xs bg-red-500/20 border border-red-500 text-white p-2.5 rounded-lg mb-3">{contactError}</div>}
                <div className="mb-3">
                  <input value={contactName} onChange={(event) => { setContactName(event.target.value); if(event.target.value.trim()) setNameError(""); }} placeholder="الاسم الكامل أو اسم الجهة (مطلوب)" />
                  {nameError && <span className="text-xs text-red-300 mt-1 block">{nameError}</span>}
                </div>
                <div className="mb-3">
                  <input type="email" value={contactEmail} onChange={(event) => { setContactEmail(event.target.value); if(event.target.value.includes("@")) setEmailError(""); }} placeholder="البريد الإلكتروني (مطلوب)" />
                  {emailError && <span className="text-xs text-red-300 mt-1 block">{emailError}</span>}
                </div>
                <div className="mb-3">
                  <select value={contactRegion} onChange={(event) => setContactRegion(event.target.value)}>
                    <option value="najd">النجد — ظفار</option>
                    <option value="batinah">سهل الباطنة</option>
                    <option value="dhahirah">الظاهرة</option>
                    <option value="wusta">المنطقة الوسطى</option>
                    <option value="jabal">الجبل الأخضر</option>
                  </select>
                </div>
                <div className="mb-4">
                  <textarea value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} placeholder="اكتب رسالتك أو استفسارك هنا (اختياري)..." />
                </div>
                <button className="primary-button w-full justify-center" type="submit" disabled={inquiryMutation.isPending}>
                  {inquiryMutation.isPending ? "جارٍ الإرسال..." : "إرسال الرسالة"} <ExternalLink size={16} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer page-pad">
        <div className="footer-brand">
          <LogoMark />
          <div>
            <strong>واحات ومزارع عُمان</strong>
            <span>رؤية 2040 للأمن الغذائي والزراعي</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>صنع في عُمان · ٢٠٢٦</span>
          <a href="#top">العودة إلى الأعلى <ArrowUpLeft size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
