/*
 * صفحة تفصيلية مستقلة لكل منطقة زراعية ضمن مبادرة واحات ومزارع عُمان 2040
 */
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, MapPin, Sprout, Droplets, ShieldCheck, ExternalLink } from "lucide-react";

export default function RegionPage() {
  const [match, params] = useRoute("/region/:code");
  const code = params?.code || "najd";

  const { data: regionsData, isLoading } = trpc.agri.getRegions.useQuery();
  const region = regionsData?.find((r) => r.code === code) || regionsData?.[0];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink">جاري تحميل بيانات المنطقة...</div>;
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6">
        <h2>عذراً، لم يتم العثور على المنطقة المطلوبة.</h2>
        <a href="/" className="primary-button mt-4">العودة للرئيسية</a>
      </div>
    );
  }

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>ملف المنطقة الجغرافية</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24">
        <div className="max-w-4xl mx-auto bg-white border border-line rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 text-copper mb-4">
            <MapPin size={22} />
            <span className="text-sm font-bold tracking-wider">المنطقة الاستراتيجية {region.number}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi mb-4">{region.name}</h1>
          <p className="text-muted text-lg mb-8">{region.area} | المشرف المعتمد: <b>{region.supervisor}</b></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-falaj-soft border border-falaj/20">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Sprout size={20} />
                <strong>المحاصيل الرئيسية المعتمدة</strong>
              </div>
              <p className="text-ink text-base">{region.crop}</p>
            </div>
            <div className="p-6 rounded-2xl bg-falaj-soft border border-falaj/20">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Droplets size={20} />
                <strong>أنظمة وحلول الري</strong>
              </div>
              <p className="text-ink text-base">{region.water} ({region.irrigationSystem})</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-falaj-deep mb-3 font-kufi">النظرة الاستراتيجية وخطة 2040</h3>
            <p className="text-ink leading-relaxed text-base mb-4">{region.description}</p>
            <p className="text-ink leading-relaxed text-base">{region.details}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-paper border border-line mb-8 text-center">
            <div>
              <span className="block text-xs text-muted mb-1">الاستثمار المقدر</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.investment}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">السعة المكانية</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.capacity}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">نسبة الاستدامة</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.sustainability}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-line">
            <span className="text-xs text-muted">الحالة التشغيلية: {region.status}</span>
            <a href="/" className="primary-button">استعراض الخريطة الكاملة</a>
          </div>
        </div>
      </main>
    </div>
  );
}
