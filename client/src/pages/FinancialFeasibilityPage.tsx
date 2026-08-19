/*
 * صفحة دراسة الجدوى المالية المتقدمة، مع حاسبة عوائد الشراكة، خرائط الأقمار الصناعية، وحفظ الدراسات
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { ArrowRight, Search, FileSpreadsheet, BarChart3, TrendingUp, ShieldCheck, Bookmark, Globe, Cpu } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function FinancialFeasibilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000);
  const [partnershipShare, setPartnershipShare] = useState<number>(15); // نسبة الشراكة المئوية
  const [activeSatelliteRegion, setActiveSatelliteRegion] = useState("najd");

  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: feasibilityRows, isLoading } = trpc.agri.getFinancialFeasibility.useQuery();
  const { data: regionsData } = trpc.agri.getRegions.useQuery();
  const { data: bookmarks } = trpc.agri.getBookmarks.useQuery(undefined, { enabled: !!user });

  const saveBookmarkMutation = trpc.agri.saveBookmark.useMutation({
    onSuccess: (res) => {
      alert(res.message);
      utils.agri.getBookmarks.invalidate();
    },
    onError: (err) => {
      alert(err.message);
    }
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

  const chartData = feasibilityRows?.map(r => ({
    name: r.regionName,
    capex: parseFloat(r.capexMillionOMR),
    irr: parseFloat(r.irrPercent.replace("%", "")),
  })) || [];

  const selectedRegionDetails = regionsData?.find(r => r.code === activeSatelliteRegion);

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
            <span className="text-copper text-xs font-bold tracking-widest uppercase mb-2 block">التقارير الاستثمارية والخرائط الفضائية</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi">دراسة الجدوى المالية وحاسبة الشراكة</h1>
            <p className="text-muted mt-2">بيانات مالية، خرائط الأقمار الصناعية، وعوائد الشراكة الاستثمارية المستدامة لعام 2040.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportExcel}
              className="primary-button inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md text-xs"
            >
              <FileSpreadsheet size={16} /> تصدير التقرير (Excel)
            </button>
          </div>
        </div>

        {/* لوحة حاسبة عوائد الشراكة الاستثمارية التفاعلية */}
        <div className="bg-falaj-deep text-white rounded-3xl p-8 md:p-10 mb-12 shadow-xl border border-falaj/30">
          <div className="flex items-center gap-3 text-copper mb-4">
            <TrendingUp size={26} />
            <h2 className="text-2xl font-bold font-kufi">حاسبة العوائد المتوقعة حسب نسب الشراكة</h2>
          </div>
          <p className="text-white/80 text-sm mb-8 leading-relaxed">
            أدخل مبلغ الاستثمار المقترح ونسبة الشراكة في مشاريع الاستزراع الحكومي لحساب التدفقات النقدية والعائد السنوي المتوقع بناءً على دراسات الجدوى الرسمية.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <label className="block text-xs text-copper mb-2 font-bold">نسبة الشراكة المئوية (%):</label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={partnershipShare} 
                onChange={(e) => setPartnershipShare(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none font-bold"
              />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-xs text-white/70">العائد السنوي المتوقع لشراكتك:</span>
              <strong className="text-2xl font-kufi text-copper mt-1">
                {((investmentAmount * (partnershipShare / 100)) * 0.155).toLocaleString('en-US', { maximumFractionDigits: 0 })} ر.ع. / سنوياً
              </strong>
            </div>
          </div>
        </div>

        {/* دمج خرائط الأقمار الصناعية وربط المساحات الفعلية */}
        <div className="bg-white border border-line rounded-3xl p-8 md:p-10 mb-12 shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-falaj">
              <Globe size={26} />
              <h3 className="text-xl font-bold font-kufi">خريطة الأقمار الصناعية والمساحات الجغرافية الفعلية</h3>
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
          {selectedRegionDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-falaj-soft p-6 rounded-2xl border border-falaj/20">
              <div className="md:col-span-2">
                <span className="text-xs font-bold text-copper block mb-1">المنطقة الجغرافية النشطة</span>
                <h4 className="text-2xl font-bold text-falaj-deep font-kufi mb-2">{selectedRegionDetails.name}</h4>
                <p className="text-ink text-sm leading-relaxed mb-4">{selectedRegionDetails.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-line">
                    <span className="block text-xs text-muted">المساحة الإجمالية للمشروع</span>
                    <strong className="text-falaj font-kufi">{selectedRegionDetails.area}</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-line">
                    <span className="block text-xs text-muted">نظام الري المعتمد فضائياً</span>
                    <strong className="text-falaj font-kufi">{selectedRegionDetails.irrigationSystem}</strong>
                  </div>
                </div>
              </div>
              <div className="bg-falaj-deep text-white p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs text-copper block mb-1">إحداثيات الأقمار الصناعية</span>
                  <p className="text-xs font-mono text-white/95 mb-4">Lat: 18.2471° N<br />Long: 54.0921° E (النجد الاستراتيجي)</p>
                  <span className="text-xs text-copper block mb-1">المشرف الميداني المعتمد</span>
                  <p className="text-xs font-bold">{selectedRegionDetails.supervisor}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <span className="text-xs text-green-300 font-bold">● تغطية حية بالأقمار الصناعية نشطة</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* أدوات البحث والتصفية */}
        <div className="bg-white border border-line rounded-2xl p-6 mb-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3.5 top-3.5 text-muted" size={18} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث باسم المنطقة الاستراتيجية..."
              className="w-full pr-11 pl-4 py-3 bg-paper border border-line rounded-xl text-ink text-sm outline-none focus:border-falaj"
            />
          </div>
          <div>
            <select 
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-4 py-3 bg-paper border border-line rounded-xl text-ink text-sm outline-none focus:border-falaj"
            >
              <option value="all">جميع مستويات المخاطر</option>
              <option value="منخفض">مخاطر منخفضة</option>
              <option value="متوسط">مخاطر متوسطة</option>
            </select>
          </div>
        </div>

        {/* الرسوم البيانية التفاعلية */}
        <div className="bg-white border border-line rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 text-falaj mb-6">
            <BarChart3 size={24} />
            <h3 className="text-xl font-bold font-kufi">مقارنة التكاليف الاستثمارية والعائد الإقليمي (IRR vs CAPEX)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: '#1F5A45', fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#1F5A45" />
                <YAxis yAxisId="right" orientation="right" stroke="#b97a4c" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="capex" name="التكلفة (مليون ر.ع.)" fill="#1F5A45" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="irr" name="عائد الاستثمار IRR (%)" fill="#b97a4c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* جدول الجدوى المالية مع خيار حفظ المفضلة */}
        <div className="bg-white border border-line rounded-3xl p-8 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-falaj-deep font-kufi">تفاصيل الجدوى الاستثمارية للمناطق ومفضلة المستثمر</h3>
            {user && bookmarks && bookmarks.length > 0 && (
              <span className="bg-falaj-soft text-falaj px-3 py-1 rounded-full text-xs font-bold">
                ⭐ لديك {bookmarks.length} دراسة جدوى محفوظة في المفضلة
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="text-center py-8 text-muted">جاري تحميل البيانات المالية...</div>
          ) : (
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line text-xs text-muted uppercase tracking-wider">
                  <th className="py-4 px-4">المنطقة الاستراتيجية</th>
                  <th className="py-4 px-4">التكلفة (مليون ر.ع.)</th>
                  <th className="py-4 px-4">معدل العائد (IRR)</th>
                  <th className="py-4 px-4">فترة الاسترداد</th>
                  <th className="py-4 px-4">الإيراد السنوي</th>
                  <th className="py-4 px-4">المخاطر</th>
                  <th className="py-4 px-4 text-center">حفظ التفضيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {filteredRows?.map((row) => {
                  const isBookmarked = bookmarks?.some(b => b.regionCode === row.regionCode);
                  return (
                    <tr key={row.regionCode} className="hover:bg-paper/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-falaj-deep">{row.regionName}</td>
                      <td className="py-4 px-4">{row.capexMillionOMR} مليون</td>
                      <td className="py-4 px-4 font-bold text-copper">{row.irrPercent}</td>
                      <td className="py-4 px-4">{row.paybackYears} سنوات</td>
                      <td className="py-4 px-4">{row.annualRevenueOMR}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.riskLevel.includes('منخفض') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user ? (
                          <button 
                            onClick={() => saveBookmarkMutation.mutate({ regionCode: row.regionCode, notes: `دراسة جدوى ${row.regionName}` })}
                            className={`p-2 rounded-xl transition-all ${isBookmarked ? 'bg-falaj text-white' : 'bg-paper text-falaj hover:bg-falaj/10'}`}
                            title="حفظ في مفضلة دراسات الجدوى"
                          >
                            <Bookmark size={18} />
                          </button>
                        ) : (
                          <button onClick={() => startLogin()} className="text-xs text-copper underline">تسجيل الدخول للحفظ</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
