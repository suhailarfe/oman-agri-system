/*
 * Design system: سجلّ الواحة المعاصر + صورة السلطان في بطاقة 3D + شعار 2040 بجوار النص + الفلاتر ولوحة المشرفين والتصدير.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "crops" | "water" | "metrics">("overview");

  // تصفية (فلاتر) الخريطة
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterCropType, setFilterCropType] = useState("all");

  // جلب البيانات
  const utils = trpc.useUtils();
  const { data: regionsData, isLoading: regionsLoading } = trpc.agri.getRegions.useQuery();
  const { data: foodSecurityMetrics } = trpc.agri.getFoodSecurityMetrics.useQuery();
  const { data: currentUser } = trpc.auth.me.useQuery();

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

  const filteredRegions = regionsData?.filter((reg) => {
    if (filterRegion !== "all" && reg.code !== filterRegion) return false;
    if (filterCropType !== "all" && !reg.crop.includes(filterCropType)) return false;
    return true;
  });

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

        {/* قسم الخريطة التفاعلية مع الفلاتر */}
        <section className="interactive-map-section page-pad" id="map-section">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">الخريطة الحية والفلاتر</SectionLabel>
              <h2>تصفية الواحات والمزارع<br /><span>حسب المنطقة والمحصول.</span></h2>
            </div>
            <p>استخدم أدوات التصفية أدناه لاستعراض المناطق الواعدة وفقاً لمتطلبات الاستثمار أو نوع المحاصيل المستهدفة.</p>
          </div>

          <div className="filter-toolbar">
            <div className="filter-group">
              <label><Filter size={15} /> تصفية حسب المنطقة:</label>
              <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                <option value="all">جميع المناطق (٥)</option>
                <option value="najd">منطقة النجد — ظفار</option>
                <option value="batinah">سهل الباطنة</option>
                <option value="dhahirah">محافظة الظاهرة</option>
                <option value="wusta">المنطقة الوسطى</option>
                <option value="jabal">الجبل الأخضر</option>
              </select>
            </div>
            <div className="filter-group">
              <label><Sprout size={15} /> تصفية حسب المحصول:</label>
              <select value={filterCropType} onChange={(e) => setFilterCropType(e.target.value)}>
                <option value="all">جميع المحاصيل</option>
                <option value="قمح">القمح الاستراتيجي</option>
                <option value="نخيل">النخيل والتمور</option>
                <option value="خضروات">الخضروات الطازجة</option>
                <option value="رمان">الفواكه الجبلية</option>
              </select>
            </div>
          </div>

          {regionsLoading ? (
            <div className="text-center py-12 text-muted">جاري تحميل الواحات...</div>
          ) : (
            <div className="map-interactive-container">
              <div className="map-visual-grid">
                {filteredRegions?.map((reg) => (
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
                    <div className="mt-2 text-xs text-muted">💧 نظام الري: <b>{reg.irrigationSystem}</b></div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
                      <button className="text-button text-falaj text-xs" onClick={(e) => { e.stopPropagation(); setSelectedRegion(reg); }}>نافذة سريعة</button>
                      <a href={`/region/${reg.code}`} className="pin-action text-xs font-bold text-copper hover:underline">الصفحة المستقلة ←</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
