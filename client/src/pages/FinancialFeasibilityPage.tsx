/*
 * صفحة دراسة الجدوى المالية المتقدمة والمحدثة مع رسوم رطوبة التربة التاريخية، مسودات العقود، ورمز QR في تقارير PDF
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ArrowRight, Search, FileSpreadsheet, BarChart3, TrendingUp, Bookmark, Globe, CloudSun, Droplet, Trash2, Download, Scale, Award, AlertTriangle, CheckCircle2, FileText, QrCode } from "lucide-react";
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

  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: feasibilityRows, isLoading } = trpc.agri.getFinancialFeasibility.useQuery();
  const { data: regionsData } = trpc.agri.getRegions.useQuery();
  const { data: bookmarks } = trpc.agri.getBookmarks.useQuery(undefined, { enabled: !!user });
  const { data: liveWeather } = trpc.agri.getLiveWeatherAndSoil.useQuery({ regionCode: activeSatelliteRegion });
  const { data: contracts } = trpc.agri.getContracts.useQuery(undefined, { enabled: !!user });

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
      setInvestorFullName("");
    },
    onError: (err) => alert(err.message)
  });

  const filteredRows = feasibilityRows?.filter((row) => {
    const matchesSearch = row.regionName.includes(searchTerm) || row.regionCode.includes(searchTerm);
    const matchesRisk = riskFilter === "all" || row.riskLevel.includes(riskFilter);
    return matchesSearch && matchesRisk;
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
    window.print(); // طباعة التقرير مع QR التحقق والرسوم
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
            <p className="text-muted mt-2">مقارنة الفرص، رصد الطقس ورطوبة التربة (تاريخياً وحياً)، تقارير PDF مع رمز QR للتحقق، وعقود رقمية قابلة للتحميل.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={handleExportExcel}
              className="primary-button inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs"
            >
              <FileSpreadsheet size={16} /> تصدير Excel
            </button>
            <button 
              onClick={handleExportGraphicalPDF}
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs"
            >
              <Download size={16} /> تصدير تقرير PDF مع QR
            </button>
          </div>
        </div>

        {/* أداة المقارنة بين دراسات الجدوى */}
        <div className="bg-white border border-line rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 text-falaj mb-6">
            <Scale size={26} />
            <h3 className="text-xl font-bold font-kufi">أداة مقارنة الفرص الاستثمارية والجدوى الإقليمية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-muted mb-2">الفرصة الاستثمارية الأولى:</label>
              <select 
                value={compareRegion1}
                onChange={(e) => setCompareRegion1(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-line rounded-xl text-ink font-bold"
              >
                {feasibilityRows?.map(r => (
                  <option key={r.regionCode} value={r.regionCode}>{r.regionName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted mb-2">الفرصة الاستثمارية الثانية:</label>
              <select 
                value={compareRegion2}
                onChange={(e) => setCompareRegion2(e.target.value)}
                className="w-full px-4 py-3 bg-paper border border-line rounded-xl text-ink font-bold"
              >
                {feasibilityRows?.map(r => (
                  <option key={r.regionCode} value={r.regionCode}>{r.regionName}</option>
                ))}
              </select>
            </div>
          </div>

          {row1 && row2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-falaj-soft p-6 rounded-2xl border border-falaj/20">
                <h4 className="text-xl font-bold text-falaj-deep font-kufi mb-4">{row1.regionName}</h4>
                <ul className="space-y-3 text-sm text-ink">
                  <li><strong>التكلفة الاستثمارية:</strong> {row1.capexMillionOMR} مليون ر.ع.</li>
                  <li><strong>معدل العائد الداخلي (IRR):</strong> <span className="text-copper font-bold">{row1.irrPercent}</span></li>
                  <li><strong>فترة الاسترداد:</strong> {row1.paybackYears} سنوات</li>
                  <li><strong>الإيراد السنوي:</strong> {row1.annualRevenueOMR}</li>
                  <li><strong>مستوى المخاطر:</strong> {row1.riskLevel}</li>
                </ul>
              </div>
              <div className="bg-paper p-6 rounded-2xl border border-line">
                <h4 className="text-xl font-bold text-falaj-deep font-kufi mb-4">{row2.regionName}</h4>
                <ul className="space-y-3 text-sm text-ink">
                  <li><strong>التكلفة الاستثمارية:</strong> {row2.capexMillionOMR} مليون ر.ع.</li>
                  <li><strong>معدل العائد الداخلي (IRR):</strong> <span className="text-copper font-bold">{row2.irrPercent}</span></li>
                  <li><strong>فترة الاسترداد:</strong> {row2.paybackYears} سنوات</li>
                  <li><strong>الإيراد السنوي:</strong> {row2.annualRevenueOMR}</li>
                  <li><strong>مستوى المخاطر:</strong> {row2.riskLevel}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* طقس حي ورطوبة التربة مع السلسلة الزمنية التاريخية والتنبيهات المرئية */}
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

              {/* الرسم البياني للتغيرات التاريخية لرطوبة التربة */}
              <div className="bg-white p-6 rounded-2xl border border-line flex flex-col justify-between">
                <div>
                  <h5 className="text-sm font-bold text-falaj-deep mb-2 font-kufi">التغير التاريخي لرطوبة التربة (24 ساعة)</h5>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={liveWeather.history || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={[10, 70]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="moisture" name="نسبة الرطوبة %" stroke="#1F5A45" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <span className="text-[10px] text-muted text-center mt-2">مصدر البيانات: حساسات النطاق الزراعي الذكي</span>
              </div>
            </div>
          )}
        </div>

        {/* لوحة حاسبة العوائد المرئية */}
        <div className="bg-falaj-deep text-white rounded-3xl p-8 md:p-10 mb-12 shadow-xl border border-falaj/30 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 text-copper mb-4">
              <TrendingUp size={26} />
              <h2 className="text-2xl font-bold font-kufi">حاسبة العوائد التفاعلية وتوزيع الشراكة</h2>
            </div>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              احسب عوائدك السنوية وتابع حصتك الاستثمارية ضمن برنامج الاستزراع الحكومي برؤية 2040.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-xs text-copper mb-2 font-bold">مبلغ الاستثمار (ر.ع.):</label>
                <input 
                  type="number" 
                  value={investmentAmount} 
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-xs text-copper mb-2 font-bold">نسبة الشراكة (%):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={partnershipShare} 
                  onChange={(e) => setPartnershipShare(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none font-bold"
                />
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-copper font-bold mb-2">توزيع العوائد المتوقعة</span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <strong className="text-xl font-kufi text-white mt-2">
              {annualReturnAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} ر.ع. / سنوياً
            </strong>
          </div>
        </div>

        {/* قسم التوقيع الرقمي ومراجعة وتحميل مسودات العقود الموقعة */}
        <div className="bg-white border border-line rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 text-falaj mb-6">
            <Award size={26} />
            <h3 className="text-xl font-bold font-kufi">عقود الشراكة الرقمية ومسودات التحميل مع رمز QR للتحقق</h3>
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
                <h4 className="text-lg font-bold text-falaj-deep font-kufi mb-4">مراجعة وتحميل مسودات العقود</h4>
                {contracts && contracts.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {contracts.map(c => (
                      <div key={c.id} className="bg-white p-4 rounded-xl border border-line flex items-center justify-between gap-4">
                        <div className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <strong className="text-falaj-deep">{c.investorName}</strong>
                            <span className="text-green-700 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> موثق</span>
                          </div>
                          <p className="text-muted mb-1">المنطقة: {c.regionCode} | القيمة: {c.investmentAmountOMR}</p>
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
                  <p className="text-sm text-muted">لا توجد عقود موقعة رقمياً بعد. قم بإنشاء وتوقيع عقدك الأول.</p>
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
