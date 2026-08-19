/*
 * صفحة دراسة الجدوى المالية المتقدمة، مع أدوات بحث وتصفية ورسوم بيانية وتصدير Excel للمستثمرين
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Search, FileSpreadsheet, BarChart3, TrendingUp, ShieldAlert, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function FinancialFeasibilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const { data: feasibilityRows, isLoading } = trpc.agri.getFinancialFeasibility.useQuery();

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

  // بيانات الرسوم البيانية للجدوى المالية
  const chartData = feasibilityRows?.map(r => ({
    name: r.regionName,
    capex: parseFloat(r.capexMillionOMR),
    irr: parseFloat(r.irrPercent.replace("%", "")),
  })) || [];

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>دراسة الجدوى المالية الاستثمارية</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-copper text-xs font-bold tracking-widest uppercase mb-2 block">التقارير الاستثمارية للقطاع الزراعي</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi">دراسة الجدوى المالية 2040</h1>
            <p className="text-muted mt-2">بيانات مالية ومؤشرات استثمارية دقيقة لاستقطاب المستثمرين والشركاء الاستراتيجيين.</p>
          </div>
          <button 
            onClick={handleExportExcel}
            className="primary-button inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
          >
            <FileSpreadsheet size={18} /> تصدير التقرير المالي (Excel/CSV)
          </button>
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

        {/* الرسوم البيانية التفاعلية للجدوى */}
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

        {/* جدول الجدوى المالية المتقدم */}
        <div className="bg-white border border-line rounded-3xl p-8 shadow-sm overflow-x-auto">
          <h3 className="text-xl font-bold text-falaj-deep mb-6 font-kufi">تفاصيل الجدوى الاستثمارية للمناطق</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted">جاري تحميل البيانات المالية...</div>
          ) : (
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line text-xs text-muted uppercase tracking-wider">
                  <th className="py-4 px-4">المنطقة الاستراتيجية</th>
                  <th className="py-4 px-4">التكلفة (مليون ر.ع.)</th>
                  <th className="py-4 px-4">معدل العائد الداخلي (IRR)</th>
                  <th className="py-4 px-4">فترة الاسترداد</th>
                  <th className="py-4 px-4">الإيراد السنوي المتوقع</th>
                  <th className="py-4 px-4">مستوى المخاطر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {filteredRows?.map((row) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
