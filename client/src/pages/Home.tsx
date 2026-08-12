/*
 * Design system: سجلّ الواحة المعاصر — أخضر الفلج #1F5A45، كريمي دافئ، نحاس محدود.
 * Layout: تحريرية غير متماثلة، صور الأرض أولاً، حركة مسؤولة وقابلة لتقليل الحركة.
 */
import { useEffect, useState } from "react";
import {
  ArrowUpLeft,
  ChevronDown,
  Droplets,
  ExternalLink,
  Leaf,
  Menu,
  Mountain,
  Sprout,
  X,
} from "lucide-react";

const assets = {
  hero: "/manus-storage/oman-oasis-hero-reference_def5e252.jpg",
  about: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=86",
  water: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=86",
  fields: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1400&q=86",
};

const navItems = [
  { label: "عن المبادرة", href: "#about" },
  { label: "المناطق", href: "#regions" },
  { label: "المياه", href: "#water" },
  { label: "المنظومة", href: "#system" },
];

const regions = [
  {
    number: "01",
    name: "النجد — ظفار",
    crop: "قمح، نخيل، أعلاف، ولبان",
    water: "خزان جوفي + تحلية شمسية",
    note: "ممرّ زراعي قابل للتوسع في قلب الجنوب",
  },
  {
    number: "02",
    name: "سهل الباطنة",
    crop: "خضروات، حمضيات، ومانجو",
    water: "صرف معالج + تحلية",
    note: "ساحل خصب يربط الإنتاج بالسوق",
  },
  {
    number: "03",
    name: "محافظة الظاهرة",
    crop: "نخيل، محاصيل حقلية، ونباتات طبية",
    water: "زراعة مائية وبيوت محمية",
    note: "حقول ذكية تتكيف مع المناخ الجاف",
  },
];

const services = [
  { number: "01", title: "المناطق الزراعية", text: "خمس مناطق واعدة تبدأ من النجد والباطنة والظاهرة، وتمتد إلى الوسطى والجبل الأخضر.", icon: Mountain },
  { number: "02", title: "حلول المياه", text: "من التحلية الشمسية إلى حصاد الضباب والري الحديث، كل قطرة لها مسار محسوب.", icon: Droplets },
  { number: "03", title: "البذور الطبيعية", text: "مصادر Non-GMO تحفظ التنوع وتمنح المحصول قدرة أكبر على الاستمرار.", icon: Sprout },
  { number: "04", title: "النظام البرمجي", text: "قاعدة بيانات مترابطة للتخطيط، الصلاحيات، المتابعة والتقارير الزراعية.", icon: Leaf },
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell" dir="rtl">
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
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image" style={{ backgroundImage: `url(${assets.hero})` }} />
          <div className="hero-wash" />
          <div className="hero-content page-pad">
            <div className="hero-kicker"><span className="kicker-line" /> مشروع وطني للأمن الغذائي والزراعي</div>
            <h1 id="hero-title">من أرضٍ<br /><em>غير مستغلة</em><br />إلى أثرٍ يُرى.</h1>
            <p className="hero-intro">نحوّل الأراضي الحكومية غير المستغلة إلى منظومة من المزارع والواحات، تعمل مع الماء والمناخ لبناء غذاءٍ مستدام لعُمان.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#about">اكتشف المبادرة <ArrowUpLeft size={17} /></a>
              <a className="text-button" href="#regions">استكشف المناطق <ChevronDown size={16} /></a>
            </div>
          </div>
          <div className="hero-meta page-pad">
            <span>سلطنة عُمان</span>
            <span>الأرض · الماء · المستقبل</span>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>Oman</span><b>2040</b><small>Food security<br />&amp; sustainable agriculture</small></div>
        </section>

        <section className="manifesto page-pad" id="about">
          <div className="manifesto-aside"><SectionLabel number="01">عن المبادرة</SectionLabel><span className="vertical-note">ملف الأرض / ٢٠٤٠</span></div>
          <div className="manifesto-main">
            <p className="eyebrow">رؤية تتجاوز الموسم</p>
            <h2>الأرض التي<br /><span>تنتظر دورها.</span></h2>
            <div className="manifesto-grid">
              <div className="manifesto-copy"><p>انطلاقاً من رؤية عُمان 2040، تقترح المبادرة استثمار الأراضي الزراعية الحكومية غير المستغلة في النجد والباطنة والظاهرة والمنطقة الوسطى والجبل الأخضر.</p><p>ليست الفكرة مزرعة واحدة. إنها منظومة تربط مصادر المياه، البذور، المعرفة، والبيانات في دورة واحدة قابلة للنمو.</p><ArrowLink href="#system">اقرأ عن المنظومة</ArrowLink></div>
              <figure className="editorial-photo"><img src={assets.about} alt="واحة عُمانية وقناة فلج بين أشجار النخيل" /><figcaption><span>02</span> الماء يجد طريقه دائماً</figcaption></figure>
            </div>
          </div>
        </section>

        <section className="field-note page-pad" aria-label="بيانات المشروع">
          <div className="field-note-title"><span className="field-mark">⌁</span><span>ملف الأرض</span></div>
          <div><b>٥</b><span>مناطق زراعية<br />واعدة</span></div>
          <div><b>٦</b><span>حلول<br />مائية</span></div>
          <div><b>١٠٠</b><span>هكتار<br />للنموذج الأول</span></div>
          <div><b>٣١٥K</b><span>ريال عُماني<br />تكلفة تقديرية</span></div>
        </section>

        <section className="regions page-pad" id="regions">
          <div className="section-heading"><div><SectionLabel number="02">المناطق</SectionLabel><h2>خريطة تبدأ<br /><span>من المكان.</span></h2></div><p>لكل منطقة قصتها، ومحاصيلها، وماؤها. نبدأ من اختلاف الأرض لا من قالب جاهز.</p></div>
          <div className="atlas-evidence" aria-label="أثر الخريطة الزراعية"><span className="atlas-evidence__path" /><span>امتداد الحقول</span><b>٥ مناطق · ٣ مسارات ماء</b><small>قراءة أولية من سجلّ الأراضي الحكومية</small></div>
          <div className="regions-list">
            {regions.map((region) => <article className="region-row" key={region.number}><span className="region-number">{region.number}</span><div className="region-name"><h3>{region.name}</h3><p>{region.note}</p></div><div className="region-detail"><span>المحاصيل</span><strong>{region.crop}</strong></div><div className="region-detail"><span>الماء</span><strong>{region.water}</strong></div><ArrowUpLeft className="region-arrow" size={21} strokeWidth={1.4} /></article>)}
          </div>
        </section>

        <section className="water-section" id="water">
          <div className="water-visual" style={{ backgroundImage: `url(${assets.water})` }} />
          <div className="water-content page-pad"><SectionLabel number="03" dark>الماء</SectionLabel><h2>لا نبحث عن<br /><em>ماءٍ أكثر.</em><br />بل عن هدرٍ أقل.</h2><p>من التحلية بالطاقة الشمسية إلى إعادة استخدام المياه المعالجة وحصاد الضباب والأمطار، نبني علاقة عملية بين كل قطرة وكل محصول.</p><ArrowLink href="#system" light>شاهد حلول المياه</ArrowLink></div>
          <div className="water-aside"><span>06</span><small>حلول مائية<br />مبتكرة</small></div>
        </section>

        <section className="system-section page-pad" id="system">
          <div className="section-heading"><div><SectionLabel number="04">المنظومة</SectionLabel><h2>خمسة مسارات،<br /><span>دورة واحدة.</span></h2></div><p>النظام البرمجي لا يراقب المزرعة من بعيد؛ يربط قراراتها اليومية بقصة الماء والمحصول والسوق.</p></div>
          <div className="services-grid">{services.map(({ number, title, text, icon: Icon }) => <article className="service-card" key={number}><div className="service-top"><span>{number}</span><Icon size={23} strokeWidth={1.4} /></div><h3>{title}</h3><p>{text}</p><div className="service-trace" aria-hidden="true" /><ArrowUpLeft className="service-arrow" size={18} /></article>)}</div>
          <div className="system-bottom"><div className="system-quote">«حين تتصل البيانات بالأرض،<br /><em>تصبح القرارات أقدر على النمو.</em>»</div><div className="system-image"><img src={assets.fields} alt="شتلات خضراء في مشتل زراعي عُماني" /></div></div>
        </section>

        <section className="cta-band page-pad" id="contact"><div><SectionLabel number="05" dark>الخطوة التالية</SectionLabel><h2>الأرض جاهزة<br /><span>للقصة القادمة.</span></h2></div><div className="cta-copy"><p>نفتح مساحة للحوار مع الشركاء والباحثين والمزارعين الذين يرون في عُمان أرضاً قابلة لمستقبلٍ أكثر اخضراراً.</p><a className="primary-button primary-button--light" href="mailto:suhailarfe@gmail.com">تواصل مع صاحب المبادرة <ExternalLink size={16} /></a></div></section>
      </main>

      <footer className="site-footer page-pad"><div className="footer-brand"><LogoMark /><div><strong>واحات ومزارع عُمان</strong><span>رؤية 2040 للأمن الغذائي والزراعي</span></div></div><div className="footer-links"><a href="mailto:suhailarfe@gmail.com">suhailarfe@gmail.com</a><a href="tel:00967736986271">00967 736 986 271</a><a href="https://github.com/suhailarfe/oman-agri-system" target="_blank" rel="noreferrer">المستودع البرمجي <ExternalLink size={14} /></a></div><div className="footer-bottom"><span>صنع في عُمان · ٢٠٢٦</span><a href="#top">العودة إلى الأعلى <ArrowUpLeft size={14} /></a></div></footer>
    </div>
  );
}
