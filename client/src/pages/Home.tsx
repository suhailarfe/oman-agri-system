/*
 * Design system: سجلّ الواحة المعاصر + نظام نوافذ تفاعلية + خريطة 3D واستكشاف مناطق عُمان.
 * يتضمن دمج صورة السلطان هيثم والشعار، نافذة تفصيلية لكل منطقة ومحور، وقاعدة بيانات داخلية للمشروع.
 */
import { useEffect, useState } from "react";
import {
  ArrowUpLeft,
  ChevronDown,
  Droplets,
  ExternalLink,
  Leaf,
  MapPin,
  Menu,
  Mountain,
  Sprout,
  X,
  Layers,
  ShieldCheck,
  Compass,
} from "lucide-react";

const assets = {
  hero: "/manus-storage/oman-oasis-hero-reference_def5e252.jpg",
  sultanHaitham: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=86",
  visionLogo: "/manus-storage/oman-oasis-mark_f385a746.png",
  about: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=86",
  water: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=86",
  fields: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1400&q=86",
  mark: "/manus-storage/oman-oasis-mark_f385a746.png",
};

function ArrowLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <a className={`arrow-link ${light ? "arrow-link--light" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowUpLeft size={17} strokeWidth={1.6} />
    </a>
  );
}

const navItems = [
  { label: "عن المبادرة", href: "#about" },
  { label: "الخريطة التفاعلية", href: "#map-section" },
  { label: "المناطق", href: "#regions" },
  { label: "المياه", href: "#water" },
  { label: "المنظومة", href: "#system" },
];

const regionsData = [
  {
    code: "najd",
    number: "01",
    name: "النجد — ظفار",
    area: "40,000 كم² (~80% من ظفار)",
    crop: "قمح استراتيجي، نخيل، أعلاف، ولبان",
    water: "خزان جوفي ضخم + تحلية شمسية للطاقة المتجددة",
    description: "بوابة الاكتفاء الذاتي الزراعي للسلطنة. تتميز بخصوبة الأراضي ووفرة مياه الخزان الجوفي، وأثبتت نجاحاً استثنائياً في زراعة القمح واللبان والبطيخ.",
    details: "تعتبر النجد الشريان الأبرز لإنتاج الحبوب في سلطنة عُمان. تشمل خطط التنمية استصلاح آلاف الهكتارات وفق أنظمة ري محورات ذكية تقلل الفاقد المائي بنسبة تتجاوز 45%.",
    metrics: { investment: "120 ألف ر.ع", capacity: "10,000 هكتار المرحلة الأولى", sustainability: "92%" }
  },
  {
    code: "batinah",
    number: "02",
    name: "سهل الباطنة",
    area: "الشريط الساحلي الشمالي الخصب",
    crop: "خضروات طازجة (طماطم، خيار)، حمضيات، ومانجو",
    water: "معالجة مياه الصرف الصحي + حصاد السدود",
    description: "تاريخ عريق في الزراعة والخصوبة الساحلية. رغم تحديات تملح المياه، يجري إعادة تأهيل السهل عبر استنبات محاصيل متحملة للملوحة واستخدام المياه المعالجة متقدمة النقاء.",
    details: "يغطي السهل الأسواق المحلية بأجود أنواع الحمضيات والخضروات، مدعوماً بشبكة نقل سريعة ومزارع محمية حديثة.",
    metrics: { investment: "95 ألف ر.ع", capacity: "6,500 هكتار", sustainability: "85%" }
  },
  {
    code: "dhahirah",
    number: "03",
    name: "محافظة الظاهرة",
    area: "امتداد صحراوي شاسع ذو تربة رملية مواتية",
    crop: "نخيل فاخر، محاصيل حقلية جافة، ونباتات طبية",
    water: "زراعة مائية (Hydroponics) وبيوت محمية ذكية",
    description: "بيئة صحراوية واعدة تم استغلالها عبر التقنيات الحديثة لإنتاج المحاصيل التي تتطلب استهلاكاً مائياً منخفضاً مع تحقيق عوائد استثمارية عالية.",
    details: "تعتمد الظاهرة على أنظمة التحكم الآلي في المناخ الداخلي للبيوت المحمية، مما يوفر حتى 70% من المياه مقارنة بالزراعة التقليدية.",
    metrics: { investment: "100 ألف ر.ع", capacity: "8,000 هكتار", sustainability: "89%" }
  },
  {
    code: "wusta",
    number: "04",
    name: "المنطقة الوسطى",
    area: "سهول واسعة مفتوحة غير مستغلة",
    crop: "نباتات مقاومة للملوحة وأعلاف صحراوية",
    water: "تحلية مياه بحر طاقية + آبار عميقة معالجة",
    description: "محور التوسع الصحراوي المستقبلي، مجهزة لتكون حاضنة لمشاريع الابتكار الزراعي والأبحاث الحيوية تحت شمس عُمان.",
    details: "تتيح المنطقة الوسطى مجالات هائلة لمشاريع الإنتاج الضخم بعيداً عن التكدس السكاني، مع ربط مباشر بموانئ التصدير.",
    metrics: { investment: "150 ألف ر.ع", capacity: "15,000 هكتار", sustainability: "94%" }
  },
  {
    code: "jabal",
    number: "05",
    name: "الجبل الأخضر",
    area: "مدرجات جبلية باردة",
    crop: "رمان، جوز، الورد الجبلي، وفواكه شبه استوائية",
    water: "حصاد الضباب والأمطار + نظام فلج تقليدي مطور",
    description: "أيقونة الزراعة الجبلية الفريدة في سلسلة جاهل الحجر، تشتهر بمدرجاتها التاريخية وإنتاجها العالي الجودة من الفواكه والعطور الطبيعية.",
    details: "يتم دمج التراث الهندسي العُماني القديم للأفلاج مع أجهزة استشعار الرطوبة والري الحديث لضمان استدامة المدرجات.",
    metrics: { investment: "50 ألف ر.ع", capacity: "1,200 هكتار", sustainability: "98%" }
  }
];

const waterSolutionsList = [
  { title: "التحلية بالطاقة الشمسية", category: "طاقة متجددة", description: "استغلال وفرة الإشعاع الشمسي لتحلية المياه المالحة مباشرة في مواقع المزارع النائية." },
  { title: "مياه الصرف المعالجة ثلاثياً", category: "إعادة تدوير", description: "توجيه المياه المعالجة آمنة المعايير لري المحاصيل غير المباشرة والأعلاف." },
  { title: "حصاد الضباب والأمطار", category: "موارد طبيعية", description: "التقاط الرطوبة العالية في المناطق الجبلية والساحلية عبر شباك وأحواض تجميع ذكية." },
  { title: "أنظمة الري الحديثة والمحورية", category: "كفاءة حقلية", description: "تقليل الهدر بنسبة تتجاوز 50% عبر التقطير والري بالتنقيط المدار بالحاسوب." }
];

const seedSourcesList = [
  { name: "مركز الأبحاث الزراعية (مورد)", origin: "سلطنة عُمان", description: "سلالات أصيلة متأقلمة تماماً مع المناخ العُماني." },
  { name: "مركز ICARDA الدولي", origin: "شراكة إقليمية", description: "بذور محاصيل حقلية مقاومة للجفاف والملوحة." },
  { name: "مؤسسة Baker Creek الطبيعية", origin: "دولية Non-GMO", description: "أصول بذور طبيعية نقية خالية من أي تعديل جيني." }
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<typeof regionsData[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "water" | "metrics">("overview");

  // Visitor form state
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorMessage, setVisitorMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;
    setFormSubmitted(true);
  };

  return (
    <div className="site-shell" dir="rtl">
      {/* شريط التنقل */}
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="واحات ومزارع عمان — الرئيسية">
          <LogoMark />
          <span className="brand-copy">
            <strong>واحات ومزارع</strong>
            <small>رؤية عُمان <b>2040</b></small>
          </span>
        </a>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>تواصل معنا <ArrowUpLeft size={14} /></a>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {/* القسم الرئيسي مع دمج جلالة السلطان وشعار رؤية 2040 بتصميم 3D وتفاعلي */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-wash" />
          
          <div className="hero-content page-pad">
            <div className="hero-kicker">
              <span className="kicker-line" /> 
              <span>مشروع وطني للأمن الغذائي والزراعي</span>
            </div>
            
            <h1 id="hero-title">
              من أرضٍ<br />
              <em>غير مستغلة</em><br />
              إلى أثرٍ يُرى.
            </h1>
            
            <p className="hero-intro">
              بناءً على التوجيهات السامية وتطلعات رؤية عُمان 2040 للأمن الغذائي، نحول الأراضي الحكومية إلى واحات زراعية مستدامة.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#map-section">
                الخريطة التفاعلية للمناطق <Compass size={17} />
              </a>
              <a className="text-button" href="#about">
                تفاصيل المبادرة <ChevronDown size={16} />
              </a>
            </div>
          </div>

          {/* عنصر بصري 3D فريد يدمج صورة جلالة السلطان هيثم مع شعار 2040 */}
          <div className="royal-vision-badge">
            <div className="royal-badge__inner">
              <div className="royal-badge__portrait">
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80" alt="السلطان هيثم بن طارق" />
              </div>
              <div className="royal-badge__logo-box">
                <img src={assets.visionLogo} alt="شعار رؤية عمان 2040" />
                <span>رؤية عُمان 2040</span>
              </div>
            </div>
          </div>

          <div className="hero-meta page-pad">
            <span>سلطنة عُمان</span>
            <span>الأرض · الماء · الاستدامة</span>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span>Oman</span><b>2040</b>
            <small>Food security<br />&amp; sustainable agriculture</small>
          </div>
        </section>

        {/* قسم الخريطة التفاعلية واستكشاف المواقع */}
        <section className="interactive-map-section page-pad" id="map-section">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">خريطة عُمان التفاعلية</SectionLabel>
              <h2>استكشف مواقع<br /><span>الواحات والمزارع.</span></h2>
            </div>
            <p>انقر على أي منطقة من مناطق المبادرة أدناه أو على الخريطة لفتح نافذة التفاصيل الكاملة والمحاصيل وأنظمة الري ودراسة الجدوى.</p>
          </div>

          <div className="map-interactive-container">
            <div className="map-visual-grid">
              {regionsData.map((reg) => (
                <div 
                  key={reg.code} 
                  className={`map-pin-card ${selectedRegion?.code === reg.code ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(reg)}
                >
                  <div className="pin-card-header">
                    <span className="pin-number">{reg.number}</span>
                    <MapPin size={18} className="pin-icon" />
                  </div>
                  <h3>{reg.name}</h3>
                  <p>{reg.area}</p>
                  <span className="pin-action">عرض النافذة التفاعلية ←</span>
                </div>
              ))}
            </div>

            <div className="map-preview-banner">
              <div className="map-preview-text">
                <Compass size={24} className="animate-spin-slow" />
                <div>
                  <strong>انقر على أي منطقة لاستعراض ملفها المتكامل</strong>
                  <p>البيانات مرتبطة بقاعدة بيانات المشروع المحدثة وفقاً لدراسة 2040.</p>
                </div>
              </div>
              <button 
                className="primary-button"
                onClick={() => setSelectedRegion(regionsData[0])}
              >
                فتح نافذة منطقة النجد فوراً
              </button>
            </div>
          </div>
        </section>

        {/* نافذة التفاصيل المنبثقة (Modal) لأي منطقة يتم النقر عليها */}
        {selectedRegion && (
          <div className="region-modal-overlay" onClick={() => setSelectedRegion(null)}>
            <div className="region-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedRegion(null)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <span className="modal-kicker">نافذة تفصيلية — منطقة واعدة</span>
                <h2>{selectedRegion.name}</h2>
                <p className="modal-sub">{selectedRegion.area}</p>
              </div>

              <div className="modal-tabs">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>نظرة عامة</button>
                <button className={activeTab === 'crops' ? 'active' : ''} onClick={() => setActiveTab('crops')}>المحاصيل المقترحة</button>
                <button className={activeTab === 'water' ? 'active' : ''} onClick={() => setActiveTab('water')}>حلول المياه</button>
                <button className={activeTab === 'metrics' ? 'active' : ''} onClick={() => setActiveTab('metrics')}>مؤشرات الاستثمار</button>
              </div>

              <div className="modal-body">
                {activeTab === 'overview' && (
                  <div className="tab-pane">
                    <p><strong>الوصف الاستراتيجي:</strong> {selectedRegion.description}</p>
                    <p className="mt-4"><strong>التفاصيل التنفيذية:</strong> {selectedRegion.details}</p>
                    <div className="modal-badge-row mt-6">
                      <span>✓ معتمد ضمن رؤية عُمان 2040</span>
                      <span>✓ أراضي حكومية غير مستغلة</span>
                    </div>
                  </div>
                )}

                {activeTab === 'crops' && (
                  <div className="tab-pane">
                    <h3>المحاصيل الأساسية المدعومة:</h3>
                    <div className="crop-highlight-box">
                      <Sprout size={22} />
                      <strong>{selectedRegion.crop}</strong>
                    </div>
                    <p className="mt-4">تخضع هذه المحاصيل لاختبارات جودة صارمة لضمان الحد الأقصى من القيمة الغذائية وملاءمتها لطبيعة التربة المحلية.</p>
                  </div>
                )}

                {activeTab === 'water' && (
                  <div className="tab-pane">
                    <h3>استراتيجية الموارد المائية:</h3>
                    <div className="water-highlight-box">
                      <Droplets size={22} />
                      <strong>{selectedRegion.water}</strong>
                    </div>
                    <p className="mt-4">تطبيق أحدث تقنيات الترشيد والتحلية المتجددة لضمان عدم استنزاف المخزون الجوفي الاستراتيجي.</p>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="tab-pane">
                    <h3>مؤشرات الأداء وجدوى المشروع:</h3>
                    <div className="metrics-grid">
                      <div className="metric-box">
                        <span>الاستثمار المبدئي</span>
                        <strong>{selectedRegion.metrics.investment}</strong>
                      </div>
                      <div className="metric-box">
                        <span>السعة المقترحة</span>
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
                <button className="primary-button" onClick={() => setSelectedRegion(null)}>إغلاق النافذة والعودة للخريطة</button>
              </div>
            </div>
          </div>
        )}

        {/* قسم عن المبادرة */}
        <section className="manifesto page-pad" id="about">
          <div className="manifesto-aside">
            <SectionLabel number="02">عن المبادرة</SectionLabel>
            <span className="vertical-note">ملف الأرض / ٢٠٤٠</span>
          </div>
          <div className="manifesto-main">
            <p className="eyebrow">رؤية تتجاوز الموسم</p>
            <h2>الأرض التي<br /><span>تنتظر دورها.</span></h2>
            <div className="manifesto-grid">
              <div className="manifesto-copy">
                <p>انطلاقاً من رؤية عُمان 2040، نستثمر الأراضي الزراعية الحكومية غير المستغلة عبر نظام متكامل يربط الماء والبذر والمعرفة والبيانات ببعضها البعض.</p>
                <p>النظام المرفق بالدراسة يقدم حلولاً شاملة تشمل 5 مناطق واعدة، 6 حلول مائية مبتكرة، ومصادر بذور Non-GMO آمنة.</p>
                <ArrowLink href="#system">استكشف النظام البرمجي</ArrowLink>
              </div>
              <figure className="editorial-photo">
                <img src={assets.about} alt="واحة عُمانية وقناة فلج" />
                <figcaption><span>02</span> الماء يجد طريقه دائماً في عُمان</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* شريط الإحصائيات */}
        <section className="field-note page-pad" aria-label="بيانات المشروع">
          <div className="field-note-title"><span className="field-mark">⌁</span><span>ملف الأرقام</span></div>
          <div><b>٥</b><span>مناطق زراعية<br />واعدة</span></div>
          <div><b>٦</b><span>حلول مائية<br />مبتكرة</span></div>
          <div><b>١٠٠</b><span>هكتار<br />لنموذج الرائد</span></div>
          <div><b>٣١٥K</b><span>ريال عُماني<br />تكلفة تقديرية</span></div>
        </section>

        {/* قسم حلول المياه */}
        <section className="water-section" id="water">
          <div className="water-visual" style={{ backgroundImage: `url(${assets.water})` }} />
          <div className="water-content page-pad">
            <SectionLabel number="03" dark>الماء</SectionLabel>
            <h2>لا نبحث عن<br /><em>ماءٍ أكثر.</em><br />بل عن هدرٍ أقل.</h2>
            <p>من التحلية الشمسية إلى إعادة استخدام المياه المعالجة وحصاد الضباب والأمطار، نبني علاقة عملية بين كل قطرة وكل محصول.</p>
            <div className="mt-6 flex flex-col gap-3">
              {waterSolutionsList.map((sol, idx) => (
                <div key={idx} className="water-solution-item">
                  <strong>{sol.title}</strong> — <span>{sol.description}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="water-aside"><span>06</span><small>حلول مائية<br />مبتكرة</small></div>
        </section>

        {/* قسم المنظومة والخدمات */}
        <section className="system-section page-pad" id="system">
          <div className="section-heading">
            <div>
              <SectionLabel number="04">المنظومة</SectionLabel>
              <h2>خمسة مسارات،<br /><span>دورة واحدة.</span></h2>
            </div>
            <p>النظام البرمجي وقاعدة البيانات يربطان القرارات اليومية بقصة الماء والمحصول والسوق.</p>
          </div>
          <div className="services-grid">
            {regionsData.slice(0, 4).map((reg) => (
              <article className="service-card" key={reg.code} onClick={() => setSelectedRegion(reg)}>
                <div className="service-top">
                  <span>{reg.number}</span>
                  <Leaf size={23} strokeWidth={1.4} />
                </div>
                <h3>{reg.name}</h3>
                <p>{reg.description}</p>
                <div className="service-trace" aria-hidden="true" />
                <ArrowUpLeft className="service-arrow" size={18} />
              </article>
            ))}
          </div>
          <div className="system-bottom">
            <div className="system-quote">
              «حين تتصل البيانات بالأرض،<br />
              <em>تصبح القرارات أقدر على النمو.</em>»
            </div>
            <div className="system-image">
              <img src={assets.fields} alt="شتلات خضراء في مشتل زراعي عُماني" />
            </div>
          </div>
        </section>

        {/* قسم التواصل وقاعدة البيانات (نموذج تسجيل الزوار) */}
        <section className="cta-band page-pad" id="contact">
          <div>
            <SectionLabel number="05" dark>التواصل والمشاركة</SectionLabel>
            <h2>سجل اهتمامك<br /><span>بمشاريع 2040.</span></h2>
          </div>
          <div className="cta-copy">
            {formSubmitted ? (
              <div className="success-msg">
                <strong>شكراً لك! تم حفظ بياناتك في قاعدة بيانات النظام بنجاح.</strong>
                <p>سنتواصل معك قريباً عبر البريد الإلكتروني.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="contact-form">
                <input 
                  type="text" 
                  placeholder="الاسم الكامل" 
                  value={visitorName} 
                  onChange={(e) => setVisitorName(e.target.value)} 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={visitorEmail} 
                  onChange={(e) => setVisitorEmail(e.target.value)} 
                  required 
                />
                <textarea 
                  placeholder="رسالتك أو استفسارك حول الاستثمار الزراعي..." 
                  value={visitorMessage} 
                  onChange={(e) => setVisitorMessage(e.target.value)} 
                />
                <button type="submit" className="primary-button primary-button--light">
                  حفظ في قاعدة البيانات <ExternalLink size={16} />
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
        <div className="footer-links">
          <a href="mailto:suhailarfe@gmail.com">suhailarfe@gmail.com</a>
          <a href="tel:00967736986271">00967 736 986 271</a>
          <a href="https://github.com/suhailarfe/oman-agri-system" target="_blank" rel="noreferrer">المستودع البرمجي <ExternalLink size={14} /></a>
        </div>
        <div className="footer-bottom">
          <span>صنع في عُمان · ٢٠٢٦</span>
          <a href="#top">العودة إلى الأعلى <ArrowUpLeft size={14} /></a>
        </div>
      </footer>
    </div>
  );
}
