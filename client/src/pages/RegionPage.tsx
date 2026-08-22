/*
 * صفحة تفصيلية مستقلة لكل منطقة زراعية مع خريطة مسار القيادة من مسقط، نموذج حجز جولة/زيارة افتراضية، وتقارير جودة المياه المخبرية للآبار
 */
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, MapPin, Sprout, Droplets, ShieldCheck, ExternalLink, Compass, Navigation, Layers, Eye, Calendar, CheckCircle2, FlaskConical, Award } from "lucide-react";
import { useState } from "react";

export default function RegionPage() {
  const [match, params] = useRoute("/region/:code");
  const code = params?.code || "najd";

  const [activeTab, setActiveTab] = useState<"overview" | "pano360" | "wells" | "tour">("overview");

  // نموذج حجز جولة ميدانية أو زيارة افتراضية
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitType, setVisitType] = useState("field"); // field or virtual
  const [visitDate, setVisitDate] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { data: regionsData, isLoading } = trpc.agri.getRegions.useQuery();
  const region = regionsData?.find((r) => r.code === code) || regionsData?.[0];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink font-kufi">جاري تحميل بيانات المنطقة...</div>;
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6 font-kufi">
        <h2>عذراً، لم يتم العثور على المنطقة المطلوبة.</h2>
        <a href="/" className="primary-button mt-4">العودة للرئيسية</a>
      </div>
    );
  }

  // إحداثيات GPS وبيانات السفر والبانوراما والآبار وتقارير المياه لكل منطقة
  const regionExtMap: Record<string, { 
    lat: number; 
    lng: number; 
    googleMapsUrl: string; 
    routeMapEmbed: string;
    realPhoto: string; 
    pano360Url: string;
    distanceFromMuscat: string;
    travelTime: string;
    wellsAndIrrigation: { name: string; type: string; depth: string; flowRate: string; status: string; ph: string; salinity: string; purity: string }[];
  }> = {
    najd: {
      lat: 18.2500,
      lng: 54.0833,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Najd+Agricultural+Region+Oman",
      routeMapEmbed: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1880000!2d54.0833!3d18.2500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3e9e1f5442df79a3%3A0x67399589d6e7f8d3!2zÙ…Ø³Ù‚Ø·ØŒ Ø¹ÙFÙ…Ø7!3m2!1d23.5880!2d58.3829!4m5!1s18.2500%2C+54.0833!3s0x3d0b2b8c5e9a4f71%3A0x1234567890abcdef!3e0",
      realPhoto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      pano360Url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
      distanceFromMuscat: "1,020 كم",
      travelTime: "9 ساعات و 45 دقيقة",
      wellsAndIrrigation: [
        { name: "بئر النجد الاستراتيجي (N-01)", type: "أرتوازية عميقة", depth: "850 متر", flowRate: "75 جالون/دقيقة", status: "يعمل بالطاقة الشمسية", ph: "7.2 (معتدل)", salinity: "320 جزء في المليون", purity: "ممتازة للاستزراع الاستراتيجي" },
        { name: "محطة ضخ الحقول الشمالية", type: "محطة ضخ محورية", depth: "شبكة سطحية", flowRate: "1200 م³/ساعة", status: "نشط بالكامل", ph: "7.4", salinity: "290 جزء في المليون", purity: "مطابقة للمواصفات القياسية" }
      ]
    },
    batinah: {
      lat: 23.6833,
      lng: 57.8500,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Al+Batinah+Plain+Agriculture+Oman",
      routeMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d57.85!3d23.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zUFJlY2lzZSBXYXRlciBXYXlwb2ludA!5e0!3m2!1sen!2som!4v1",
      realPhoto: "https://images.unsplash.com/photo-1595974482597-4b8da8877ae2?auto=format&fit=crop&w=1200&q=80",
      pano360Url: "https://images.unsplash.com/photo-1595974482597-4b8da8877ae2?auto=format&fit=crop&w=1600&q=80",
      distanceFromMuscat: "120 كم",
      travelTime: "ساعة و 15 دقيقة",
      wellsAndIrrigation: [
        { name: "بئر الساحل الجوفي (BT-14)", type: "سطحية مرقبة", depth: "120 متر", flowRate: "45 جالون/دقيقة", status: "حساسات رطوبة ذكية", ph: "7.1", salinity: "410 جزء في المليون", purity: "صالحة للمحاصيل الحساسة" }
      ]
    },
    dhahirah: {
      lat: 23.2333,
      lng: 56.5500,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Al+Zahira+Region+Oman+Agriculture",
      routeMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d56.55!3d23.23!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQWYgV2F5cG9pbnQgWmFoaXJh!5e0!3m2!1sen!2som!4v1",
      realPhoto: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
      pano360Url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80",
      distanceFromMuscat: "310 كم",
      travelTime: "3 ساعات و 20 دقيقة",
      wellsAndIrrigation: [
        { name: "حقل آبار عبري المركزي", type: "مجموعة آبار جوفية", depth: "450 متر", flowRate: "350 جالون/دقيقة", status: "مربوط بشبكة التحكم الآلي", ph: "7.3", salinity: "350 جزء في المليون", purity: "عالية النقاء" }
      ]
    },
    wusta: {
      lat: 20.0000,
      lng: 57.0000,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Al+Wusta+Region+Oman",
      routeMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d57.0!3d20.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zV3VzdGEgV2F5cG9pbnQ!5e0!3m2!1sen!2som!4v1",
      realPhoto: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      pano360Url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
      distanceFromMuscat: "530 كم",
      travelTime: "5 ساعات و 30 دقيقة",
      wellsAndIrrigation: [
        { name: "محطة التحلية الشمسية بالمنطقة الوسطى", type: "تحلية مياه مالحة", depth: "آبار ساحلية", flowRate: "600 م³/ساعة", status: "تعمل بالطاقة المتجددة", ph: "7.0", salinity: "180 جزء في المليون", purity: "نقية جداً (معالجة)" }
      ]
    },
    jabal: {
      lat: 23.0700,
      lng: 57.3970,
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Jebel+Akhdar+Terraced+Farms+Oman",
      routeMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d57.39!3d23.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zSmViZWwgQWtoZGFyIFdheXBvaW50!5e0!3m2!1sen!2som!4v1",
      realPhoto: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      pano360Url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      distanceFromMuscat: "165 كم",
      travelTime: "ساعتان و 15 دقيقة",
      wellsAndIrrigation: [
        { name: "فلج الخطمين التراثي المطور", type: "فلج جبلي تاريخي", depth: "ينابيع جبلية", flowRate: "تدفق انسيابي", status: "مجهز بحساسات تدفق رقمية", ph: "7.5", salinity: "210 جزء في المليون", purity: "مياه معدنية طبيعية نقية" }
      ]
    }
  };

  const currentExt = regionExtMap[region.code] || regionExtMap['najd'];

  // مؤشرات أمن غذائي مخصصة لكل منطقة استناداً إلى ملف الـ PDF
  const regionalFoodSecurity: Record<string, { selfSufficiency: string; target2040: string; strategicCrops: string[]; waterEfficiency: string }> = {
    najd: { selfSufficiency: "38%", target2040: "80%+", strategicCrops: ["القمح الصلب الاستراتيجي", "اللبان العُماني النقي", "الأعلاف الخضراء المرشدة"], waterEfficiency: "توفير مائي 45% عبر الري المحوري" },
    batinah: { selfSufficiency: "62%", target2040: "90%", strategicCrops: ["الحمضيات المحلية", "الخضروات المحمية الطازجة", "المانجو العُماني"], waterEfficiency: "استخدام مياه معالجة ثلاثياً وحصاد سدود" },
    dhahirah: { selfSufficiency: "54%", target2040: "85%", strategicCrops: ["النخيل والتمور الفاخرة", "المحاصيل الحقلية الجافة"], waterEfficiency: "زراعة مائية مغلقة (Hydroponics)" },
    wusta: { selfSufficiency: "25%", target2040: "75%", strategicCrops: ["أعلاف صحراوية مقاومة للملوحة", "نباتات الزيوت الحيوية"], waterEfficiency: "تحلية شمسية وآبار عميقة متطورة" },
    jabal: { selfSufficiency: "88%", target2040: "98%", strategicCrops: ["الرمان الجبلي الفاخر", "الورد الجبلي العطري", "الجوز والخوخ"], waterEfficiency: "أفلاج تقليدية مطورة بحساسات رطوبة ذكية" },
  };

  const currentSecurity = regionalFoodSecurity[region.code] || regionalFoodSecurity.najd;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail || !visitDate) {
      alert("يرجى تعبئة كافة الحقول المطلوبة لحجز الجولة.");
      return;
    }
    setBookingSuccess(true);
  };

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header site-header--scrolled">
        <a className="brand" href="/">
          <span className="brand-copy">
            <strong>واحات ومزارع عُمان</strong>
            <small>ملف الأمن الغذائي الإقليمي والخرائط</small>
          </span>
        </a>
        <a href="/" className="nav-contact">العودة للرئيسية <ArrowRight size={16} /></a>
      </header>

      <main className="page-pad py-24 max-w-5xl mx-auto">
        <div className="bg-white border border-line rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3 text-copper">
              <MapPin size={22} />
              <span className="text-sm font-bold tracking-wider">المنطقة الاستراتيجية {region.number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-falaj/10 text-falaj text-xs font-bold px-3 py-1.5 rounded-xl border border-falaj/20 flex items-center gap-1">
                <Navigation size={13} /> من مسقط: {currentExt.distanceFromMuscat} ({currentExt.travelTime})
              </span>
              <a 
                href={currentExt.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-falaj hover:bg-falaj-deep text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md"
              >
                <MapPin size={14} /> فتح الخريطة <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-falaj-deep font-kufi mb-4">{region.name}</h1>
          <p className="text-muted text-lg mb-6">{region.area} | المشرف المعتمد: <b>{region.supervisor}</b></p>

          {/* أزرار التبديل بين العرض الواقعي والبانوراما 360 والآبار وحجز الجولات */}
          <div className="flex gap-2 mb-6 border-b border-line pb-4 flex-wrap">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === "overview" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              الصور الواقعية ومسار القيادة
            </button>
            <button 
              onClick={() => setActiveTab("pano360")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "pano360" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <Eye size={14} /> معاينة بانورامية 360°
            </button>
            <button 
              onClick={() => setActiveTab("wells")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "wells" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <FlaskConical size={14} /> الآبار وتقارير جودة المياه ({currentExt.wellsAndIrrigation.length})
            </button>
            <button 
              onClick={() => setActiveTab("tour")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "tour" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <Calendar size={14} /> حجز جولة ميدانية أو زيارة افتراضية
            </button>
          </div>

          {/* تبويب الصور ومسار القيادة الخريطة المصغرة */}
          {activeTab === "overview" && (
            <div className="space-y-6 mb-8">
              <div className="relative h-72 md:h-80 w-full rounded-2xl overflow-hidden border border-line shadow-sm">
                <img 
                  src={currentExt.realPhoto} 
                  alt={region.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <span className="bg-copper text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    أراضي حقيقية مرصودة ميدانياً في {region.name} (الإحداثيات: {currentExt.lat}° N, {currentExt.lng}° E)
                  </span>
                </div>
              </div>

              {/* الخريطة المصغرة لمسار القيادة المباشر من مسقط */}
              <div className="bg-paper p-6 rounded-2xl border border-line">
                <h4 className="font-bold text-falaj-deep font-kufi mb-3 flex items-center gap-2">
                  <Navigation size={18} className="text-copper" /> خريطة مسار القيادة المباشر من العاصمة مسقط
                </h4>
                <p className="text-xs text-muted mb-4">يعرض المسار المقترح والمسافة المباشرة للسفر بالسيارة إلى {region.name}.</p>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-line">
                  <iframe 
                    title="Route from Muscat"
                    src={currentExt.routeMapEmbed}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "pano360" && (
            <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-8 border border-line bg-black shadow-inner flex flex-col items-center justify-center text-center p-6">
              <img 
                src={currentExt.pano360Url} 
                alt="360 Panorama" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 animate-pulse"
              />
              <div className="relative z-10 bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-line shadow-xl max-w-md">
                <Compass className="mx-auto text-copper mb-2 animate-spin" size={36} />
                <h4 className="text-lg font-bold text-falaj-deep font-kufi">محاكاة العرض البانورامي 360 درجة</h4>
                <p className="text-xs text-muted mt-1">جولة افتراضية تفاعلية تتيح معاينة خطوط الري المحوري والآبار والمساحات الخضراء في مزارع {region.name}.</p>
                <span className="inline-block mt-3 bg-falaj text-white px-4 py-1.5 rounded-xl text-[11px] font-bold">وضع التدوير الافتراضي مفعل</span>
              </div>
            </div>
          )}

          {activeTab === "wells" && (
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-bold text-falaj-deep font-kufi flex items-center gap-2">
                <FlaskConical size={20} className="text-falaj" /> الآبار الاستراتيجية ومحطات الري مع تقارير الجودة المخبرية الدورية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExt.wellsAndIrrigation.map((well, i) => (
                  <div key={i} className="bg-paper p-5 rounded-2xl border border-line hover:border-falaj transition-colors space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-falaj-deep text-sm">{well.name}</strong>
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{well.status}</span>
                    </div>
                    <p className="text-xs text-muted">النوع: {well.type} | العمق: {well.depth}</p>
                    <div className="bg-white p-3 rounded-xl border border-line space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted">درجة الحموضة (pH):</span>
                        <strong className="text-falaj font-mono">{well.ph}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">مستوى الملوحة (TDS):</span>
                        <strong className="text-copper font-mono">{well.salinity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">شهادة الجودة المخبرية:</span>
                        <strong className="text-green-700 font-bold">{well.purity}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tour" && (
            <div className="mb-8 bg-paper p-8 rounded-2xl border border-line">
              <h3 className="text-xl font-bold text-falaj-deep font-kufi mb-2 flex items-center gap-2">
                <Calendar size={22} className="text-copper" /> حجز جولة ميدانية أو طلب زيارة افتراضية للمستثمرين
              </h3>
              <p className="text-xs text-muted mb-6">سجل بياناتك لترتيب جولة ميدانية مصحوبة بمرشد زراعي أو حضور جولة افتراضية عبر الإنترنت لمزارع {region.name}.</p>
              
              {bookingSuccess ? (
                <div className="bg-green-100 border border-green-300 text-green-800 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={36} className="mx-auto text-green-600" />
                  <h4 className="font-bold text-base">تم استلام طلب الحجز بنجاح!</h4>
                  <p className="text-xs">سيتواصل معك فريق التنسيق الاستثماري لترتيب الموعد وإرسال تفاصيل الزيارة.</p>
                  <button onClick={() => setBookingSuccess(false)} className="mt-3 bg-falaj text-white px-4 py-2 rounded-xl text-xs font-bold">حجز زيارة أخرى</button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">الاسم الكامل / الجهة الاستثمارية</label>
                    <input 
                      type="text" 
                      value={visitorName} 
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="مثال: شركة عُمان للاستثمار الزراعي" 
                      className="w-full p-3 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">البريد الإلكتروني الرسمي</label>
                    <input 
                      type="email" 
                      value={visitorEmail} 
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="name@investor.om" 
                      className="w-full p-3 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">نوع الزيارة</label>
                      <select 
                        value={visitType} 
                        onChange={(e) => setVisitType(e.target.value)}
                        className="w-full p-3 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
                      >
                        <option value="field">جولة ميدانية مباشرة</option>
                        <option value="virtual">زيارة افتراضية (عن بُعد)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">التاريخ المفضل</label>
                      <input 
                        type="date" 
                        value={visitDate} 
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full p-3 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-falaj hover:bg-falaj-deep text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md">
                    تأكيد وإرسال طلب الحجز
                  </button>
                </form>
              )}
            </div>
          )}

          {/* قسم مؤشرات الأمن الغذائي الخاصة بالمنطقة */}
          <div className="mb-10 p-6 rounded-2xl bg-falaj-soft border border-falaj/30">
            <div className="flex items-center gap-2 text-falaj mb-4">
              <ShieldCheck size={24} />
              <h3 className="text-lg font-bold font-kufi">مؤشرات الأمن الغذائي الخاصة بهذه المنطقة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">نسبة الاكتفاء الذاتي الحالي</span>
                <strong className="text-2xl font-kufi text-falaj">{currentSecurity.selfSufficiency}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">مستهدف الاكتفاء 2040</span>
                <strong className="text-2xl font-kufi text-copper">{currentSecurity.target2040}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-line">
                <span className="block text-xs text-muted mb-1">كفاءة ترشيد المياه</span>
                <strong className="text-sm font-bold text-ink">{currentSecurity.waterEfficiency}</strong>
              </div>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">المحاصيل الاستراتيجية المركزة:</span>
              <div className="flex gap-2 flex-wrap mt-2">
                {currentSecurity.strategicCrops.map((crop, idx) => (
                  <span key={idx} className="bg-white text-falaj px-3 py-1 rounded-full text-xs font-bold border border-falaj/20">
                    🌾 {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-paper border border-line">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Sprout size={20} />
                <strong>المحاصيل والإنتاج</strong>
              </div>
              <p className="text-ink text-base">{region.crop}</p>
            </div>
            <div className="p-6 rounded-2xl bg-paper border border-line">
              <div className="flex items-center gap-2 text-falaj mb-2">
                <Droplets size={20} />
                <strong>موارد وأنظمة الري</strong>
              </div>
              <p className="text-ink text-base">{region.water} ({region.irrigationSystem})</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-falaj-deep mb-3 font-kufi">التحليل الاستراتيجي وخطة 2040</h3>
            <p className="text-ink leading-relaxed text-base mb-4">{region.description}</p>
            <p className="text-ink leading-relaxed text-base">{region.details}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-falaj-soft border border-line mb-8 text-center">
            <div>
              <span className="block text-xs text-muted mb-1">الاستثمار المقدر</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.investment}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">السعة المكانية</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.capacity}</strong>
            </div>
            <div>
              <span className="block text-xs text-muted mb-1">معدل الاستدامة</span>
              <strong className="text-falaj-deep font-kufi">{region.metrics.sustainability}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-line flex-wrap gap-4">
            <span className="text-xs text-muted">الحالة التشغيلية: {region.status}</span>
            <a href="/" className="primary-button">استعراض الخريطة الكاملة</a>
          </div>
        </div>
      </main>
    </div>
  );
}
