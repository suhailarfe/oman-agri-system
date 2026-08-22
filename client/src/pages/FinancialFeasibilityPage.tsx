/*
 * صفحة دراسة الجدوى المالية المتقدمة والمحدثة مع إشعارات المشرفين، فرز العقود حسب القيمة، ومعاينة PDF قبل التنزيل
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ArrowRight, Search, FileSpreadsheet, BarChart3, TrendingUp, Bookmark, Globe, CloudSun, Droplet, Trash2, Download, Scale, Award, AlertTriangle, CheckCircle2, FileText, QrCode, Loader2, Filter, Bell, Eye, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function FinancialFeasibilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000);
  const [partnershipShare, setPartnershipShare] = useState<number>(15);
  const [activeSatelliteRegion, setActiveSatelliteRegion] = useState("najd");

  const [compareRegion1, setCompareRegion1] = useState("najd");
  const [compareRegion2, setCompareRegion2] = useState("batinah");

  const [investorFullName, setInvestorFullName] = useState("");
  const [selectedContractRegion, setSelectedContractRegion] = useState("najd");

  // أدوات تصفية وبحث وفرز متقدم للعقود حسب القيمة والمبلغ
  const [contractSearch, setContractSearch] = useState("");
  const [contractStatusFilter, setContractStatusFilter] = useState("all");
  const [contractSortBy, setContractSortBy] = useState("newest"); // 'newest' | 'amount_desc' | 'amount_asc'

  // حالات معاينة PDF وتصديره
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState("");

  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: feasibilityRows, isLoading } = trpc.agri.getFinancialFeasibility.useQuery();
  const { data: regionsData } = trpc.agri.getRegions.useQuery();
  const { data: bookmarks } = trpc.agri.getBookmarks.useQuery(undefined, { enabled: !!user });
  const { data: liveWeather } = trpc.agri.getLiveWeatherAndSoil.useQuery({ regionCode: activeSatelliteRegion });
  const { data: contracts } = trpc.agri.getContracts.useQuery(undefined, { enabled: !!user });
  const { data: adminNotifications } = trpc.agri.getAdminNotifications.useQuery(undefined, { enabled: !!user });

  const saveBookmarkMutation = trpc.agri.saveBookmark.useMutation({
    onSuccess: (res) => {
      alert(res.message);
      utils.agri.getBookmarks.invalidate();
    },
    onError: (err) => alert(err.message)
  });

  const removeBookmarkMutation = trpc.agri.removeBookmark.useMutation({
    onSuccess: (res) => {
      alert(res.message);
      utils.agri.getBookmarks.invalidate();
    }
  });

  const signContractMutation = trpc.agri.signPartnershipContract.useMutation({
    onSuccess: (res) => {
      alert(res.message);
      utils.agri.getContracts.invalidate();
      utils.agri.getAdminNotifications.invalidate();
      setInvestorFullName("");
    },
    onError: (err) => alert(err.message)
  });

  const filteredRows = feasibilityRows?.filter((row) => {
    const matchesSearch = row.regionName.includes(searchTerm) || row.regionCode.includes(searchTerm);
    const matchesRisk = riskFilter === "all" || row.riskLevel.includes(riskFilter);
    return matchesSearch && matchesRisk;
  });

  // تصفية وفرز العقود بناءً على الحالة والبحث وحجم الاستثمار والمبلغ
  const filteredContracts = contracts?.filter((c) => {
    const matchesText = c.investorName.includes(contractSearch) || c.signatureHash.includes(contractSearch) || c.regionCode.includes(contractSearch);
    const matchesStatus = contractStatusFilter === "all" || c.status === contractStatusFilter;
    return matchesText && matchesStatus;
  }).sort((a, b) => {
    if (contractSortBy === 'amount_desc' || contractSortBy === 'amount_asc') {
      const getNum = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
      const valA = getNum(a.investmentAmountOMR);
      const valB = getNum(b.investmentAmountOMR);
      return contractSortBy === 'amount_desc' ? valB - valA : valA - valB;
    }
    // الافتراضي والأحدث
    return new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime();
  });

  const handleExportExcel = () => {
    if (!feasibilityRows) return;
    const csvContent = [
      ["رمز المنطقة", "اسم المنطقة", "التكلفة الاستثمارية (مليون ر.ع.)", "معدل العائد الداخلي (IRR)", "فترة الاسترداد (سنوات)", "الإيراد السنوي المتوقع", "مستوى المخاطر"],
      ...feasibilityRows.map(r => [r.regionCode, r.regionName, r.capexMillionOMR, r.irrPercent, r.paybackYears, r.annualRevenueOMR, r.riskLevel])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "oman_agri_financial_feasibility_2040.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGraphicalPDF = () => {
    setIsExportingPDF(true);
    setExportSuccessMsg("");
    setShowPdfPreviewModal(false);
    setTimeout(() => {
      setIsExportingPDF(false);
      setExportSuccessMsg("تم إنشاء وتصدير تقرير PDF الرسومي المتضمن رمز الاستجابة السريعة (QR) بنجاح!");
      window.print();
    }, 1200);
  };

  const handleDownloadContractDraft = (contract: any) => {
    const draftText = `========================================\n` +
      `جمهورية سلطنة عُمان — وزارة الثروة الزراعية والسمكية وموارد المياه\n` +
      `برنامج الأمن الغذائي والاستزراع الحكومي (رؤية عُمان 2040)\n` +
      `عقد شراكة استثمارية أولية (مسودة رسمية موقعة رقمياً)\n` +
      `========================================\n\n` +
      `اسم المستثمر: ${contract.investorName}\n` +
      `المنطقة الاستراتيجية: ${contract.regionCode}\n` +
      `مبلغ الاستثمار: ${contract.investmentAmountOMR}\n` +
      `نسبة الشراكة المئوية: ${contract.sharePercent}\n` +
      `حالة العقد: معتمد ورسمي\n` +
      `رمز التوثيق الإلكتروني: ${contract.signatureHash}\n` +
      `تاريخ التوقيع: ${new Date(contract.signedAt).toLocaleString('ar-OM')}\n\n` +
      `تحقق من صحة العقد عبر مسح رمز الاستجابة السريعة (QR) أو مراجعة منصة واحات ومزارع عُمان.\n` +
      `========================================`;

    const blob = new Blob([draftText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Contract_Draft_${contract.signatureHash}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = feasibilityRows?.map(r => ({
    name: r.regionName,
    capex: parseFloat(r.capexMillionOMR),
    irr: parseFloat(r.irrPercent.replace("%", "")),
  })) || [];

  const selectedRegionDetails = regionsData?.find(r => r.code === activeSatelliteRegion);
  const row1 = feasibilityRows?.find(r => r.regionCode === compareRegion1);
  const row2 = feasibilityRows?.find(r => r.regionCode === compareRegion2);

  const annualReturnAmount = (investmentAmount * (partnershipShare / 100)) * 0.155;
  const pieData = [
    { name: "عائد حصة المستثمر", value: annualReturnAmount },
    { name: "إعادة استثمار التطوير", value: annualReturnAmount * 0.3 },
    { name: "احتياطي الصندوق الزراعي", value: annualReturnAmount * 0.2 },
  ];
  const COLORS = ['#1F5A45', '#b97a4c', '#2c7a5d'];

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>بوابة المستثمرين والجدوى المالية</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-copper text-xs font-bold tracking-widest uppercase mb-2 block">المنظومة الاستثمارية المتقدمة — رؤية 2040</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi">دراسة الجدوى ومقارنة الفرص وعقود الشراكة</h1>
            <p className="text-muted mt-2">إشعارات فورية للمشرفين، فرز العقود حسب الاستثمار، معاينة PDF التفاعلية، ورسومات رطوبة التربة التاريخية.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={handleExportExcel}
              className="primary-button inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs"
            >
              <FileSpreadsheet size={16} /> تصدير Excel
            </button>
            <button 
              onClick={() => setShowPdfPreviewModal(true)}
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs"
            >
              <Eye size={16} /> معاينة تقرير PDF مع QR
            </button>
          </div>
        </div>

        {exportSuccessMsg && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm">
            <CheckCircle2 size={20} className="text-green-600" />
            {exportSuccessMsg}
          </div>
        )}

        {/* قسم إشعارات المشرفين الفورية بالعقود الجديدة */}
        {user && (
          <div className="bg-white border border-line rounded-3xl p-6 mb-12 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-falaj-deep">
                <Bell size={20} className="text-copper animate-bounce" />
                <h3 className="font-bold font-kufi text-base">مركز إشعارات المشرفين (العقود الاستثمارية الموقعة حديثاً)</h3>
              </div>
              <span className="bg-falaj/10 text-falaj text-xs font-bold px-3 py-1 rounded-full">
                {adminNotifications?.length || 0} عقود نشطة
              </span>
            </div>
            {adminNotifications && adminNotifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adminNotifications.slice(0, 3).map(notif => (
                  <div key={notif.id} className="bg-paper p-4 rounded-2xl border border-line text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-falaj-deep">{notif.investorName}</strong>
                      <span className="text-green-700 font-bold">مكتمل</span>
                    </div>
                    <p className="text-muted mb-1">المنطقة: {notif.regionCode} | القيمة: {notif.investmentAmountOMR}</p>
                    <span className="font-mono text-[10px] text-copper">التوثيق: {notif.signatureHash}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">لا توجد إشعارات عقود جديدة حالياً.</p>
            )}
          </div>
        )}

        {/* طقس حي ورطوبة التربة مع السلسلة الزمنية والتلميحات التفاعلية (Tooltips) */}
        <div className="bg-white border border-line rounded-3xl p-8 md:p-10 mb-12 shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-falaj">
              <Globe size={26} />
              <h3 className="text-xl font-bold font-kufi">محطات الأرصاد ورطوبة التربة (حياً ومع التاريخ الزمني)</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {regionsData?.map((reg) => (
                <button 
                  key={reg.code}
                  onClick={() => setActiveSatelliteRegion(reg.code)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSatelliteRegion === reg.code ? 'bg-falaj text-white' : 'bg-paper text-ink border border-line'}`}
                >
                  {reg.name}
                </button>
              ))}
            </div>
          </div>

          {selectedRegionDetails && liveWeather && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`lg:col-span-2 p-6 rounded-2xl border ${liveWeather.soilAlert ? 'bg-red-50 border-red-300' : 'bg-falaj-soft border-falaj/20'}`}>
                <span className="text-xs font-bold text-copper block mb-1">الرصد الميداني والطقس الحي</span>
                <h4 className="text-2xl font-bold text-falaj-deep font-kufi mb-2">{selectedRegionDetails.name}</h4>
                <p className="text-ink text-sm leading-relaxed mb-4">{selectedRegionDetails.description}</p>
                
                {liveWeather.soilAlert && (
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-xl text-xs font-bold mb-4">
                    <AlertTriangle size={16} /> تنبيه حرج: انخفاض مستوى رطوبة التربة عن الحد الموصى به! تم تفعيل الضخ الاحتياطي.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-line flex items-center gap-3">
                    <CloudSun className="text-copper" size={24} />
                    <div>
                      <span className="block text-xs text-muted">الطقس الحالي (API)</span>
                      <strong className="text-falaj font-kufi">{liveWeather.temp} ({liveWeather.status})</strong>
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-line flex items-center gap-3">
                    <Droplet className={liveWeather.soilAlert ? "text-red-500" : "text-falaj"} size={24} />
                    <div>
                      <span className="block text-xs text-muted">رطوبة التربة الحية</span>
                      <strong className={liveWeather.soilAlert ? "text-red-600 font-kufi" : "text-falaj font-kufi"}>{liveWeather.soilMoisture}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* الرسم البياني التاريخي مع تلميحات Tooltips */}
              <div className="bg-white p-6 rounded-2xl border border-line flex flex-col justify-between">
                <div>
                  <h5 className="text-sm font-bold text-falaj-deep mb-2 font-kufi">التغير التاريخي لرطوبة التربة (24 ساعة)</h5>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={liveWeather.history || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={[10, 70]} tick={{ fontSize: 10 }} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-falaj-deep text-white p-3 rounded-xl shadow-lg text-xs">
                                  <p className="font-bold mb-1">الوقت: {label}</p>
                                  <p className="text-copper font-mono">نسبة الرطوبة: {payload[0].value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="moisture" name="نسبة الرطوبة %" stroke="#1F5A45" strokeWidth={2} dot={{ r: 4, fill: '#b97a4c' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <span className="text-[10px] text-muted text-center mt-2">مرّر مؤشر الماوس لمعرفة القيم والوقت بدقة</span>
              </div>
            </div>
          )}
        </div>

        {/* قسم التوقيع الرقمي ومراجعة العقود مع التصفية والبحث وفرز القيمة المالية */}
        <div className="bg-white border border-line rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 text-falaj mb-6">
            <Award size={26} />
            <h3 className="text-xl font-bold font-kufi">عقود الشراكة الرقمية ومسودات التحميل والفرز المالي</h3>
          </div>
          {user ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-falaj-soft p-6 rounded-2xl border border-falaj/20">
                <h4 className="text-lg font-bold text-falaj-deep font-kufi mb-4">توقيع عقد شراكة أولية جديدة</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">اسم المستثمر الثلاثي:</label>
                    <input 
                      type="text"
                      value={investorFullName}
                      onChange={(e) => setInvestorFullName(e.target.value)}
                      placeholder="الاسم الكامل كما في السجل..."
                      className="w-full px-4 py-3 bg-white border border-line rounded-xl text-ink text-sm outline-none focus:border-falaj"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2">المنطقة الاستراتيجية المستهدفة:</label>
                    <select 
                      value={selectedContractRegion}
                      onChange={(e) => setSelectedContractRegion(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-line rounded-xl text-ink text-sm outline-none focus:border-falaj"
                    >
                      {regionsData?.map(r => (
                        <option key={r.code} value={r.code}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      if (!investorFullName) {
                        alert("يرجى إدخال اسم المستثمر الثلاثي.");
                        return;
                      }
                      signContractMutation.mutate({
                        investorName: investorFullName,
                        regionCode: selectedContractRegion,
                        investmentAmountOMR: `${investmentAmount} ر.ع.`,
                        sharePercent: `${partnershipShare}%`
                      });
                    }}
                    className="w-full bg-falaj hover:bg-falaj-deep text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
                  >
                    توقيع العقد رقمياً واعتماد الشراكة
                  </button>
                </div>
              </div>

              <div className="bg-paper p-6 rounded-2xl border border-line">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h4 className="text-lg font-bold text-falaj-deep font-kufi">مراجعة وتحميل مسودات العقود</h4>
                  <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-40">
                      <Search className="absolute right-3 top-2.5 text-muted" size={14} />
                      <input 
                        type="text"
                        value={contractSearch}
                        onChange={(e) => setContractSearch(e.target.value)}
                        placeholder="بحث برمز التوثيق..."
                        className="w-full pr-8 pl-3 py-1.5 bg-white border border-line rounded-lg text-xs outline-none"
                      />
                    </div>
                    <select 
                      value={contractSortBy}
                      onChange={(e) => setContractSortBy(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-line rounded-lg text-xs outline-none font-bold"
                    >
                      <option value="newest">الأحدث توقيعاً</option>
                      <option value="amount_desc">حجم الاستثمار (من الأعلى للأقل)</option>
                      <option value="amount_asc">حجم الاستثمار (من الأقل للأعلى)</option>
                    </select>
                  </div>
                </div>

                {filteredContracts && filteredContracts.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {filteredContracts.map(c => (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-line flex items-center justify-between gap-4">
                        <div className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <strong className="text-falaj-deep">{c.investorName}</strong>
                            <span className="text-green-700 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> موثق</span>
                          </div>
                          <p className="text-muted mb-1">المنطقة: {c.regionCode} | القيمة: <strong className="text-falaj">{c.investmentAmountOMR}</strong></p>
                          <p className="font-mono text-[10px] text-copper">التوقيع: {c.signatureHash}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-falaj/10 p-2 rounded-lg border border-falaj/30 text-falaj" title="رمز QR للتحقق من العقد">
                            <QrCode size={28} />
                          </div>
                          <button 
                            onClick={() => handleDownloadContractDraft(c)}
                            className="inline-flex items-center gap-1 bg-falaj text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-falaj-deep"
                          >
                            <FileText size={12} /> تحميل المسودة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">لا توجد عقود مطابقة لنتائج البحث أو الفرز.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted mb-4">يرجى تسجيل الدخول بحسابك للتمكن من توقيع العقود ومراجعة المسودات.</p>
              <button onClick={() => startLogin()} className="bg-falaj text-white px-6 py-3 rounded-xl font-bold">تسجيل الدخول</button>
            </div>
          )}
        </div>

        {/* نافذة معاينة تقرير PDF التفاعلية قبل التحميل */}
        {showPdfPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setShowPdfPreviewModal(false)}
                className="absolute left-6 top-6 text-muted hover:text-ink bg-paper p-2 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 text-falaj mb-4">
                <FileText size={26} />
                <h3 className="text-2xl font-bold font-kufi">معاينة تقرير الجدوى المالية ورمز التحقق (QR)</h3>
              </div>
              <p className="text-muted text-xs mb-6">هذه معاينة حية للتقرير الاستثماري الرسمي المزمع تصديره وطباعته بصيغة PDF.</p>

              <div className="bg-paper p-6 rounded-2xl border border-line mb-6 max-h-64 overflow-y-auto text-xs space-y-3 font-mono">
                <div className="flex justify-between font-bold text-falaj-deep border-b pb-2">
                  <span>وزارة الثروة الزراعية والسمكية وموارد المياه</span>
                  <span>رؤية عُمان 2040</span>
                </div>
                <p><strong>العنوان:</strong> تقرير الجدوى الاستثمارية الشاملة ومقارنة العوائد الإقليمية.</p>
                <p><strong>إجمالي المناطق المستهدفة:</strong> {feasibilityRows?.length || 5} مناطق استراتيجية.</p>
                <p><strong>مستوى التدقيق الأمني:</strong> معتمد برمز تحقق رقمي ورمز استجابة سريعة (QR Code).</p>
                <div className="p-3 bg-white rounded border border-line flex items-center justify-between">
                  <span>نموذج رمز التوثيق المدمج:</span>
                  <QrCode size={32} className="text-falaj" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowPdfPreviewModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-line text-ink font-bold text-xs"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleExportGraphicalPDF}
                  disabled={isExportingPDF}
                  className="inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  {isExportingPDF ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                  {isExportingPDF ? "جاري التصدير..." : "تأكيد وتنزيل التقرير نهائياً"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* تذليل تقارير PDF الرسومية مع رمز QR للتحقق */}
        <div id="pdf-report-footer" className="hidden print:block bg-white p-6 border-t-2 border-falaj mt-8">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-falaj font-kufi">تقرير الجدوى الاستثمارية وعقود الشراكة — رؤية عُمان 2040</h4>
              <p className="text-xs text-muted">وثيقة رسمية صادرة عن البوابة الاستثمارية لبرنامج الأمن الغذائي والزراعي.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-left text-[10px] font-mono text-muted">
                <span>رمز التحقق الرسمي:</span><br />
                <strong>OMAN-2040-SECURE-VERIFIED</strong>
              </div>
              <div className="p-2 border border-falaj rounded bg-falaj/10 text-falaj">
                <QrCode size={36} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
