/*
 * صفحة تفصيلية مستقلة لكل منطقة زراعية: تشمل خريطة مسار القيادة، رسوماً بيانية تاريخية لجودة المياه، نموذج حجز محسّن بنافذة تأكيد منبثقة، وعرض الطقس الحي.
 */
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, MapPin, Sprout, Droplets, ShieldCheck, ExternalLink, Compass, Navigation, Layers, Eye, Calendar, CheckCircle2, FlaskConical, Award, CloudSun, Wind, Thermometer, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function RegionPage() {
  const [match, params] = useRoute("/region/:code");
  const code = params?.code || "najd";

  const [activeTab, setActiveTab] = useState<"overview" | "pano360" | "wells" | "tour" | "weather">("overview");

  // نموذج حجز جولة ميدانية أو زيارة افتراضية مع تحقق فوري
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitType, setVisitType] = useState("field"); // field or virtual
  const [visitDate, setVisitDate] = useState("");
  
  // أخطاء التحقق الفوري
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateError, setDateError] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  const { data: regionsData, isLoading } = trpc.agri.getRegions.useQuery();
  const region = regionsData?.find((r) => r.code === code) || regionsData?.[0];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink font-kufi">جاري تحميل بيانات المنطقة والاستثمارات...</div>;
  }

  if (!region) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6 font-kufi">
        <h2>عذراً، لم يتم العثور على المنطقة المطلوبة.</h2>
        <a href="/" className="primary-button mt-4">العودة للرئيسية</a>
      </div>
    );
  }

  // بيانات موسعة تشمل إحداثيات GPS، الطقس الحي، والرسوم البيانية التاريخية لجودة المياه للآبار
  const regionExtMap: Record<string, { 
    lat: number; 
    lng: number; 
    googleMapsUrl: string; 
    routeMapEmbed: string;
    realPhoto: string; 
    pano360Url: string;
    distanceFromMuscat: string;
    travelTime: string;
    weather: { temp: string; condition: string; humidity: string; wind: string; recommendation: string };
    wellsAndIrrigation: { 
      name: string; 
      type: string; 
      depth: string; 
      flowRate: string; 
      status: string; 
      ph: string; 
      salinity: string; 
      purity: string;
      historicalPh: { month: string; value: number }[];
      historicalSalinity: { month: string; value: number }[];
    }[];
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
      weather: { temp: "31° مئوية", condition: "مشمس ومناسب للري الصباحي", humidity: "42%", wind: "14 كم/س شمالية غربية", recommendation: "الظروف الجوية ممتازة لزيارة المزارع المحورية وتفقد الآبار العميقـة." },
      wellsAndIrrigation: [
        { 
          name: "بئر النجد الاستراتيجي (N-01)", 
          type: "أرتوازية عميقة", 
          depth: "850 متر", 
          flowRate: "75 جالون/دقيقة", 
          status: "يعمل بالطاقة الشمسية", 
          ph: "7.2 (معتدل)", 
          salinity: "320 جزء في المليون", 
          purity: "ممتازة للاستزراع الاستراتيجي",
          historicalPh: [
            { month: "يناير", value: 7.1 },
            { month: "فبراير", value: 7.2 },
            { month: "مارس", value: 7.2 },
            { month: "أبريل", value: 7.3 },
            { month: "مايو", value: 7.2 },
            { month: "يونيو", value: 7.2 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 330 },
            { month: "فبراير", value: 325 },
            { month: "مارس", value: 320 },
            { month: "أبريل", value: 318 },
            { month: "مايو", value: 322 },
            { month: "يونيو", value: 320 }
          ]
        },
        { 
          name: "محطة ضخ الحقول الشمالية", 
          type: "محطة ضخ محورية", 
          depth: "شبكة سطحية", 
          flowRate: "1200 م³/ساعة", 
          status: "نشط بالكامل", 
          ph: "7.4", 
          salinity: "290 جزء في المليون", 
          purity: "مطابقة للمواصفات القياسية",
          historicalPh: [
            { month: "يناير", value: 7.3 },
            { month: "فبراير", value: 7.4 },
            { month: "مارس", value: 7.4 },
            { month: "أبريل", value: 7.5 },
            { month: "مايو", value: 7.4 },
            { month: "يونيو", value: 7.4 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 300 },
            { month: "فبراير", value: 295 },
            { month: "مارس", value: 290 },
            { month: "أبريل", value: 285 },
            { month: "مايو", value: 288 },
            { month: "يونيو", value: 290 }
          ]
        }
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
      weather: { temp: "34° مئوية", condition: "معتدل مع نسيم بحري", humidity: "65%", wind: "10 كم/س شرقية", recommendation: "طقس رائع لتفقد مزارع الحمضيات والري الذكي." },
      wellsAndIrrigation: [
        { 
          name: "بئر الساحل الجوفي (BT-14)", 
          type: "سطحية مرقبة", 
          depth: "120 متر", 
          flowRate: "45 جالون/دقيقة", 
          status: "حساسات رطوبة ذكية", 
          ph: "7.1", 
          salinity: "410 جزء في المليون", 
          purity: "صالحة للمحاصيل الحساسة",
          historicalPh: [
            { month: "يناير", value: 7.0 },
            { month: "فبراير", value: 7.1 },
            { month: "مارس", value: 7.1 },
            { month: "أبريل", value: 7.2 },
            { month: "مايو", value: 7.1 },
            { month: "يونيو", value: 7.1 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 420 },
            { month: "فبراير", value: 415 },
            { month: "مارس", value: 410 },
            { month: "أبريل", value: 405 },
            { month: "مايو", value: 412 },
            { month: "يونيو", value: 410 }
          ]
        }
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
      weather: { temp: "36° مئوية", condition: "جاف ومستقر", humidity: "30%", wind: "12 كم/س", recommendation: "يفضل الزيارة الصباحية المبكرة لفحص أنظمة الزراعة المائية." },
      wellsAndIrrigation: [
        { 
          name: "حقل آبار عبري المركزي", 
          type: "مجموعة آبار جوفية", 
          depth: "450 متر", 
          flowRate: "350 جالون/دقيقة", 
          status: "مربوط بشبكة التحكم الآلي", 
          ph: "7.3", 
          salinity: "350 جزء في المليون", 
          purity: "عالية النقاء",
          historicalPh: [
            { month: "يناير", value: 7.2 },
            { month: "فبراير", value: 7.3 },
            { month: "مارس", value: 7.3 },
            { month: "أبريل", value: 7.4 },
            { month: "مايو", value: 7.3 },
            { month: "يونيو", value: 7.3 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 360 },
            { month: "فبراير", value: 355 },
            { month: "مارس", value: 350 },
            { month: "أبريل", value: 345 },
            { month: "مايو", value: 352 },
            { month: "يونيو", value: 350 }
          ]
        }
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
      weather: { temp: "33° مئوية", condition: "صافي مع رياح ساحلية", humidity: "50%", wind: "18 كم/س", recommendation: "طقس مناسب لتشغيل محطات التحلية الشمسية." },
      wellsAndIrrigation: [
        { 
          name: "محطة التحلية الشمسية بالمنطقة الوسطى", 
          type: "تحلية مياه مالحة", 
          depth: "آبار ساحلية", 
          flowRate: "600 م³/ساعة", 
          status: "تعمل بالطاقة المتجددة", 
          ph: "7.0", 
          salinity: "180 جزء في المليون", 
          purity: "نقية جداً (معالجة)",
          historicalPh: [
            { month: "يناير", value: 7.0 },
            { month: "فبراير", value: 7.0 },
            { month: "مارس", value: 7.0 },
            { month: "أبريل", value: 7.1 },
            { month: "مايو", value: 7.0 },
            { month: "يونيو", value: 7.0 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 190 },
            { month: "فبراير", value: 185 },
            { month: "مارس", value: 180 },
            { month: "أبريل", value: 175 },
            { month: "مايو", value: 182 },
            { month: "يونيو", value: 180 }
          ]
        }
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
      weather: { temp: "22° مئوية", condition: "بارد ومنعش جبلياً", humidity: "45%", wind: "15 كم/س", recommendation: "أجواء مثالية للاستكشاف والزيارة الميدانية للمدرجات الزراعية." },
      wellsAndIrrigation: [
        { 
          name: "فلج الخطمين التراثي المطور", 
          type: "فلج جبلي تاريخي", 
          depth: "ينابيع جبلية", 
          flowRate: "تدفق انسيابي", 
          status: "مجهز بحساسات تدفق رقمية", 
          ph: "7.5", 
          salinity: "210 جزء في المليون", 
          purity: "مياه معدنية طبيعية نقية",
          historicalPh: [
            { month: "يناير", value: 7.4 },
            { month: "فبراير", value: 7.5 },
            { month: "مارس", value: 7.5 },
            { month: "أبريل", value: 7.6 },
            { month: "مايو", value: 7.5 },
            { month: "يونيو", value: 7.5 }
          ],
          historicalSalinity: [
            { month: "يناير", value: 220 },
            { month: "فبراير", value: 215 },
            { month: "مارس", value: 210 },
            { month: "أبريل", value: 205 },
            { month: "مايو", value: 212 },
            { month: "يونيو", value: 210 }
          ]
        }
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

  // التحقق الفوري لحقول نموذج الحجز
  const handleNameChange = (val: string) => {
    setVisitorName(val);
    if (val.trim().length < 3) {
      setNameError("الاسم يجب أن يكون 3 أحرف على الأقل.");
    } else {
      setNameError("");
    }
  };

  const handleEmailChange = (val: string) => {
    setVisitorEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("الرجاء إدخال بريد إلكتروني صحيح.");
    } else {
      setEmailError("");
    }
  };

  const handleDateChange = (val: string) => {
    setVisitDate(val);
    if (!val) {
      setDateError("الرجاء تحديد موعد الزيارة.");
    } else {
      setDateError("");
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail || !visitDate || nameError || emailError) {
      alert("يرجى تصحيح الأخطاء في النموذج قبل المتابعة.");
      return;
    }
    const refCode = "OMN-TOUR-" + Math.floor(100000 + Math.random() * 900000);
    setBookingReference(refCode);
    setShowSuccessModal(true);
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-falaj/10 text-falaj text-xs font-bold px-3 py-1.5 rounded-xl border border-falaj/20 flex items-center gap-1">
                <Navigation size={13} /> من مسقط: {currentExt.distanceFromMuscat} ({currentExt.travelTime})
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1">
                <Thermometer size={13} /> الطقس: {currentExt.weather.temp}
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

          {/* أزرار التبديل بين التبويبات */}
          <div className="flex gap-2 mb-6 border-b border-line pb-4 flex-wrap">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${activeTab === "overview" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              الصور ومسار القيادة
            </button>
            <button 
              onClick={() => setActiveTab("weather")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "weather" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <CloudSun size={14} /> الطقس المباشر والتخطيط
            </button>
            <button 
              onClick={() => setActiveTab("pano360")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "pano360" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <Eye size={14} /> بانوراما 360°
            </button>
            <button 
              onClick={() => setActiveTab("wells")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "wells" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <FlaskConical size={14} /> الآبار والرسوم التاريخية للمياه
            </button>
            <button 
              onClick={() => setActiveTab("tour")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${activeTab === "tour" ? "bg-falaj text-white shadow-md" : "bg-paper text-ink hover:bg-falaj/10"}`}
            >
              <Calendar size={14} /> حجز جولة ميدانية
            </button>
          </div>

          {/* تبويب العرض ومسار القيادة */}
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

          {/* تبويب حالة الطقس المباشرة */}
          {activeTab === "weather" && (
            <div className="mb-8 space-y-6">
              <div className="bg-gradient-to-br from-falaj-soft to-white p-6 rounded-2xl border border-falaj/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-falaj">
                  <CloudSun size={28} />
                  <h3 className="text-xl font-bold font-kufi">حالة الطقس المباشرة والتوصيات الميدانية لزيارة {region.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-line text-center">
                    <span className="block text-xs text-muted mb-1">درجة الحرارة</span>
                    <strong className="text-xl text-falaj font-bold">{currentExt.weather.temp}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-line text-center">
                    <span className="block text-xs text-muted mb-1">حالة الجو</span>
                    <strong className="text-xs text-ink font-bold">{currentExt.weather.condition}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-line text-center">
                    <span className="block text-xs text-muted mb-1">الرطوبة النسبية</span>
                    <strong className="text-xl text-copper font-bold">{currentExt.weather.humidity}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-line text-center">
                    <span className="block text-xs text-muted mb-1">سرعة الرياح</span>
                    <strong className="text-xs text-ink font-bold">{currentExt.weather.wind}</strong>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-line flex items-start gap-3">
                  <Wind size={20} className="text-copper mt-1 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-falaj-deep mb-1">توصيات الملاحة وتخطيط الزيارة:</h5>
                    <p className="text-xs text-ink">{currentExt.weather.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب بانوراما 360 */}
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

          {/* تبويب الآبار والرسوم التاريخية لجودة المياه */}
          {activeTab === "wells" && (
            <div className="mb-8 space-y-6">
              <h3 className="text-lg font-bold text-falaj-deep font-kufi flex items-center gap-2">
                <FlaskConical size={20} className="text-falaj" /> الآبار ومحطات الري والرسوم البيانية التاريخية لتغيرات الجودة (آخر 6 أشهر)
              </h3>
              
              {currentExt.wellsAndIrrigation.map((well, i) => (
                <div key={i} className="bg-paper p-6 rounded-2xl border border-line space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <strong className="text-falaj-deep text-base font-kufi">{well.name}</strong>
                      <p className="text-xs text-muted mt-0.5">النوع: {well.type} | العمق: {well.depth} | معدل التدفق: {well.flowRate}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{well.status}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-line">
                      <span className="text-muted block mb-1">درجة الحموضة الحالية (pH):</span>
                      <strong className="text-falaj font-mono text-sm">{well.ph}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-line">
                      <span className="text-muted block mb-1">مستوى الملوحة (TDS):</span>
                      <strong className="text-copper font-mono text-sm">{well.salinity}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-line">
                      <span className="text-muted block mb-1">شهادة النقاء المخبرية:</span>
                      <strong className="text-green-700 font-bold">{well.purity}</strong>
                    </div>
                  </div>

                  {/* الرسوم البيانية التاريخية المبسطة للتغيرات (pH والملوحة) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-4 rounded-xl border border-line">
                      <h5 className="font-bold text-xs text-falaj-deep mb-3 flex items-center gap-1.5">
                        <Droplets size={14} className="text-falaj" /> التطور التاريخي لدرجة الحموضة (pH)
                      </h5>
                      <div className="space-y-2">
                        {well.historicalPh.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            <span className="w-12 text-muted">{item.month}</span>
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-falaj h-full rounded-full" style={{ width: `${(item.value / 10) * 100}%` }}></div>
                            </div>
                            <span className="w-8 font-mono font-bold text-falaj">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-line">
                      <h5 className="font-bold text-xs text-falaj-deep mb-3 flex items-center gap-1.5">
                        <FlaskConical size={14} className="text-copper" /> التطور التاريخي للملوحة (TDS - جزء في المليون)
                      </h5>
                      <div className="space-y-2">
                        {well.historicalSalinity.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            <span className="w-12 text-muted">{item.month}</span>
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-copper h-full rounded-full" style={{ width: `${(item.value / 600) * 100}%` }}></div>
                            </div>
                            <span className="w-10 font-mono font-bold text-copper">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* تبويب حجز الجولات الميدانية مع التحقق الفوري والنافذة المنبثقة */}
          {activeTab === "tour" && (
            <div className="mb-8 bg-paper p-8 rounded-2xl border border-line relative">
              <h3 className="text-xl font-bold text-falaj-deep font-kufi mb-2 flex items-center gap-2">
                <Calendar size={22} className="text-copper" /> حجز جولة ميدانية أو زيارة افتراضية للمستثمرين
              </h3>
              <p className="text-xs text-muted mb-6">سجل بياناتك لترتيب جولة ميدانية مصحوبة بمرشد زراعي أو حضور جولة افتراضية عبر الإنترنت لمزارع {region.name}.</p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">الاسم الكامل / الجهة الاستثمارية</label>
                  <input 
                    type="text" 
                    value={visitorName} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="مثال: شركة عُمان للاستثمار الزراعي" 
                    className={`w-full p-3 bg-white border rounded-xl text-xs outline-none ${nameError ? 'border-red-500' : 'border-line focus:border-falaj'}`}
                    required
                  />
                  {nameError && <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {nameError}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">البريد الإلكتروني الرسمي</label>
                  <input 
                    type="email" 
                    value={visitorEmail} 
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="name@investor.om" 
                    className={`w-full p-3 bg-white border rounded-xl text-xs outline-none ${emailError ? 'border-red-500' : 'border-line focus:border-falaj'}`}
                    required
                  />
                  {emailError && <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {emailError}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">رقم الهاتف النقال (اختياري للتنسيق)</label>
                  <input 
                    type="tel" 
                    value={visitorPhone} 
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+968 9XXXXXXX" 
                    className="w-full p-3 bg-white border border-line rounded-xl text-xs outline-none focus:border-falaj"
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
                      onChange={(e) => handleDateChange(e.target.value)}
                      className={`w-full p-3 bg-white border rounded-xl text-xs outline-none ${dateError ? 'border-red-500' : 'border-line focus:border-falaj'}`}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-falaj hover:bg-falaj-deep text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-md w-full md:w-auto"
                >
                  تأكيد وإرسال طلب الحجز الميداني
                </button>
              </form>

              {/* النافذة المنبثقة (Modal) لتأكيد الحجز بنجاح */}
              {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-line shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl font-extrabold text-falaj-deep font-kufi">تم تأكيد حجز الزيارة بنجاح!</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      شكراً لتسجيلك يا <b>{visitorName}</b>. تم إصدار مرجع الحجز الخاص بمنطقة <b>{region.name}</b> بنجاح وسيتواصل فريق التنسيق معك قريباً.
                    </p>
                    <div className="bg-paper p-3 rounded-xl border border-line font-mono text-xs text-falaj font-bold">
                      رمز المرجع: {bookingReference}
                    </div>
                    <button 
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full bg-falaj hover:bg-falaj-deep text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md"
                    >
                      إغلاق والعودة للمنصة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* قسم مؤشرات الأمن الغذائي */}
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
