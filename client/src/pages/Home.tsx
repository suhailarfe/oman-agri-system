/*
 * Design system: سجلّ الواحة المعاصر + الهوية الرسمية لرؤية عُمان 2040 + مؤشرات الأمن الغذائي + نوافذ تفاعلية وقاعدة بيانات حية.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
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
  Compass,
  ShieldCheck,
  BarChart3,
  UserCheck,
  Lock,
} from "lucide-react";

const assets = {
  hero: "/manus-storage/oman-oasis-hero-reference_def5e252.jpg",
  sultanHaitham: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=86",
  visionMark: "/manus-storage/oman-oasis-mark_f385a746.png",
  about: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=86",
  water: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=86",
  fields: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1400&q=86",
};

const navItems = [
  { label: "عن المبادرة", href: "#about" },
  { label: "الخريطة التفاعلية", href: "#map-section" },
  { label: "مؤشرات الأمن الغذائي", href: "#food-security" },
  { label: "المناطق", href: "#regions" },
  { label: "المياه", href: "#water" },
  { label: "إدارة النظام", href: "#admin-portal" },
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

function ArrowLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <a className={`arrow-link ${light ? "arrow-link--light" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowUpLeft size={17} strokeWidth={1.6} />
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "water" | "metrics">("overview");

  // جلب البيانات الحية من قاعدة البيانات عبر tRPC
  const { data: regionsData, isLoading: regionsLoading } = trpc.agri.getRegions.useQuery();
  const { data: foodSecurityMetrics } = trpc.agri.getFoodSecurityMetrics.useQuery();
  const { data: currentUser } = trpc.auth.me.useQuery();

  // نموذج تسجيل الزوار / المزارعين
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorMessage, setVisitorMessage] = useState("");
  const [selectedRegionCode, setSelectedRegionCode] = useState("najd");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const inquiryMutation = trpc.agri.registerInquiry.useMutation({
    onSuccess: () => {
      setFormSubmitted(true);
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;
    inquiryMutation.mutate({
      name: visitorName,
      email: visitorEmail,
      regionCode: selectedRegionCode,
      message: visitorMessage || "استفسار بخصوص إدارة الاستصلاح الزراعي ودعم الأمن الغذائي."
    });
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
            <span className="user-badge-pill">👤 {currentUser.name || currentUser.email} ({currentUser.role})</span>
          ) : (
            <button className="nav-contact" onClick={() => startLogin()}>تسجيل الدخول <UserCheck size={14} /></button>
          )}
        </nav>
        <button className="menu-toggle" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {/* القسم الرئيسي المستوحى من الموقع الرسمي لرؤية 2040 Motionsites 3D */}
        <section className="hero-vision-official" aria-labelledby="hero-title">
          <div className="hero-vision-bg" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-vision-overlay" />

          <div className="hero-vision-container page-pad">
            <div className="hero-vision-content">
              <div className="vision-badge-header">
                <img src={assets.visionMark} alt="شعار رؤية عمان 2040" className="vision-official-mark" />
                <span>برنامج الأمن الغذائي والاستزراع الحكومي</span>
              </div>
              <h1 id="hero-title">
                نحو مستقبل زراعي مستدام<br />
                <em>برؤية عُمان 2040</em>
              </h1>
              <p className="hero-official-desc">
                استغلال الأراضي الحكومية الواعدة، توظيف التقنيات الحديثة، وتحقيق الأمن الغذائي المستدام تحت التوجيهات السامية لحضرة صاحب الجلالة السلطان هيثم بن طارق المعظم.
              </p>
              <div className="hero-buttons">
                <a className="primary-button" href="#map-section">
                  الخريطة التفاعلية الحية <Compass size={17} />
                </a>
                <a className="text-button text-white" href="#food-security">
                  تحليلات الأمن الغذائي (PDF) <BarChart3 size={16} />
                </a>
              </div>
            </div>

            {/* بطاقة 3D Cinematic دمج صورة السلطان والشعار الرسمي مستوحاة من MotionSites */}
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

        {/* قسم الخريطة التفاعلية الحية المرتبطة بقاعدة البيانات */}
        <section className="interactive-map-section page-pad" id="map-section">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">الخريطة الحية للتوسع الزراعي</SectionLabel>
              <h2>استكشاف الواحات<br /><span>عبر قاعدة البيانات.</span></h2>
            </div>
            <p>يتم جلب البيانات الحية أدناه مباشرة من قاعدة البيانات الوثائقية للمشروع. انقر على أي منطقة لعرض نافذة التفاصيل والمحاصيل والحلول المائية.</p>
          </div>

          {regionsLoading ? (
            <div className="text-center py-12 text-muted">جاري تحميل بيانات الواحات والمزارع من قاعدة البيانات...</div>
          ) : (
            <div className="map-interactive-container">
              <div className="map-visual-grid">
                {regionsData?.map((reg) => (
                  <div 
                    key={reg.code} 
                    className="map-pin-card"
                    onClick={() => setSelectedRegion(reg)}
                  >
                    <div className="pin-card-header">
                      <span className="pin-number">{reg.number}</span>
                      <MapPin size={18} className="pin-icon" />
                    </div>
                    <h3>{reg.name}</h3>
                    <p>{reg.area}</p>
                    <div className="region-status-pill">{reg.status}</div>
                    <span className="pin-action mt-3 inline-block">فتح النافذة التفصيلية ←</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* نافذة التفاصيل التفاعلية لكل منطقة */}
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
                <button className={activeTab === 'water' ? 'active' : ''} onClick={() => setActiveTab('water')}>الأنظمة المائية</button>
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
                    <h3>موارد وحلول المياه المخصصة:</h3>
                    <div className="water-highlight-box">
                      <Droplets size={22} />
                      <strong>{selectedRegion.water}</strong>
                    </div>
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

        {/* قسم جديد: تحليل مؤشرات الأمن الغذائي استناداً إلى ملف الـ PDF */}
        <section className="food-security-section page-pad" id="food-security">
          <div className="section-heading">
            <div>
              <SectionLabel number="02">تحليل وثيقة الـ PDF</SectionLabel>
              <h2>مؤشرات الأمن الغذائي<br /><span>لسلطنة عُمان 2040.</span></h2>
            </div>
            <p>مستخرج مباشرة من دراسة المناطق الزراعية الحكومية غير المستغلة ومستهدفات الاكتفاء الذاتي.</p>
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

        {/* قسم عن المبادرة */}
        <section className="manifesto page-pad" id="about">
          <div className="manifesto-aside">
            <SectionLabel number="03">عن المبادرة</SectionLabel>
            <span className="vertical-note">ملف الأرض / ٢٠٤٠</span>
          </div>
          <div className="manifesto-main">
            <p className="eyebrow">رؤية تتجاوز الموسم</p>
            <h2>الأرض التي<br /><span>تنتظر دورها.</span></h2>
            <div className="manifesto-grid">
              <div className="manifesto-copy">
                <p>انطلاقاً من رؤية عُمان 2040، نستثمر الأراضي الزراعية الحكومية غير المستغلة عبر نظام متكامل يربط الماء والبذر والمعرفة والبيانات ببعضها البعض.</p>
                <p>النظام المرفق بالدراسة يقدم حلولاً شاملة تشمل 5 مناطق واعدة، 6 حلول مائية مبتكرة، ومصادر بذور Non-GMO آمنة.</p>
              </div>
              <figure className="editorial-photo">
                <img src={assets.about} alt="واحة عُمانية وقناة فلج" />
                <figcaption><span>03</span> الماء يجد طريقه دائماً في عُمان</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* قسم إدارة النظام والصلاحيات (المزارعين والمشرفين) */}
        <section className="admin-portal-section page-pad" id="admin-portal">
          <div className="section-heading">
            <div>
              <SectionLabel number="04">بوابة المزارعين والمشرفين</SectionLabel>
              <h2>إدارة الصلاحيات<br /><span>وقاعدة البيانات.</span></h2>
            </div>
            <p>سجل اهتمامك أو تواصل مع إدارة المشروع. يتم حفظ البيانات في جدول الزوار والمزارعين بقاعدة البيانات.</p>
          </div>

          <div className="portal-grid">
            <div className="portal-info-box">
              <h3>صلاحيات النظام المتاحة:</h3>
              <ul className="portal-rules">
                <li>🌾 <b>المزارعون:</b> استعراض المحاصيل، طلب الدعم الفني، ومتابعة إحصاءات الري.</li>
                <li>🛡️ <b>المشرفون:</b> إدارة بيانات المناطق الزراعية، تحديث المؤشرات، ومراجعة طلبات الاستثمار.</li>
                <li>📊 <b>الإدارة العليا:</b> متابعة تقارير الأمن الغذائي والربط مع مستهدفات رؤية 2040.</li>
              </ul>
              {currentUser ? (
                <div className="mt-6 p-4 bg-falaj-soft rounded-xl">
                  <p>أنت مسجل الدخول حالياً باسم: <b>{currentUser.name}</b></p>
                  <p className="text-xs text-muted mt-1">الدور: <code>{currentUser.role}</code></p>
                </div>
              ) : (
                <button className="primary-button mt-6" onClick={() => startLogin()}>
                  تسجيل الدخول الآمن عبر منصة عُمان <UserCheck size={16} />
                </button>
              )}
            </div>

            <div className="portal-form-container">
              {formSubmitted ? (
                <div className="success-msg">
                  <strong>تم الحفظ في قاعدة البيانات بنجاح!</strong>
                  <p>{inquiryMutation.data?.message}</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="contact-form">
                  <h3>طلب انضمام أو استفسار زراعي</h3>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل أو اسم المزرعة" 
                    value={visitorName} 
                    onChange={(e) => setVisitorName(e.target.value)} 
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني الرسمي" 
                    value={visitorEmail} 
                    onChange={(e) => setVisitorEmail(e.target.value)} 
                    required 
                  />
                  <select 
                    value={selectedRegionCode} 
                    onChange={(e) => setSelectedRegionCode(e.target.value)}
                    className="portal-select"
                  >
                    <option value="najd">منطقة النجد — ظفار</option>
                    <option value="batinah">سهل الباطنة</option>
                    <option value="dhahirah">محافظة الظاهرة</option>
                    <option value="wusta">المنطقة الوسطى</option>
                    <option value="jabal">الجبل الأخضر</option>
                  </select>
                  <textarea 
                    placeholder="تفاصيل المشروع الزراعي أو الاستفسار..." 
                    value={visitorMessage} 
                    onChange={(e) => setVisitorMessage(e.target.value)} 
                  />
                  <button type="submit" className="primary-button">
                    إرسال وحفظ في قاعدة البيانات <ExternalLink size={16} />
                  </button>
                </form>
              )}
            </div>
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
