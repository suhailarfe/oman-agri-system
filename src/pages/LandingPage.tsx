import { Link } from 'react-router-dom'
import { Map, Droplets, Cpu, Leaf, ArrowLeft, ChevronRight } from 'lucide-react'

const features = [
  { icon:Map, title:'المناطق الزراعية', desc:'5 مناطق حكومية واعدة بمساحة 16.97 مليون هكتار غير مستغلة', color:'#0d7c3d' },
  { icon:Droplets, title:'حلول المياه', desc:'6 تقنيات مبتكرة: تحلية شمسية، صرف معالج، حصاد ضباب، ري ذكي', color:'#3b82f6' },
  { icon:Cpu, title:'أنظمة ذكية', desc:'إدارة رقمية متكاملة: SQL، صلاحيات، تقارير تفاعلية', color:'#8b5cf6' },
  { icon:Leaf, title:'استدامة', desc:'بذور Non-GMO، زراعة عضوية، طاقة شمسية، اكتفاء ذاتي', color:'#b8860b' },
]

export default function LandingPage() {
  return <div>
    <section className="relative bg-gradient-to-br from-green-50 via-white to-amber-50 overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 20% 50%, #0d7c3d 1px, transparent 1px)',backgroundSize:'40px 40px'}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-6 text-green-700 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> رؤية عُمان 2040</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">الأمن الغذائي <br /><span className="text-green-600">للسلطنة</span></h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">نظام متكامل لإدارة المشروع الزراعي الوطني — توثيق المناطق والمزارع والموارد المائية، مع دراسة جدوى شاملة لنموذج 100 هكتار</p>
            <Link to="/dashboard" className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 hover:shadow-xl text-lg">الدخول للوحة التحكم <ChevronRight size={20} /></Link>
          </div>
          <div className="flex justify-center order-1 lg:order-2"><div className="relative"><div className="absolute -inset-4 bg-gradient-to-br from-green-400/20 to-amber-400/20 rounded-3xl blur-xl" /><img src="/sultan.jpg" alt="السلطان هيثم بن طارق" className="relative w-64 sm:w-72 lg:w-80 rounded-3xl shadow-2xl border-4 border-white object-cover aspect-[3/4]" /><div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2"><img src="/logo2040.png" className="w-8 h-8 rounded object-contain" alt="" /><span className="text-xs font-bold text-gray-700">رؤية 2040</span></div></div></div>
        </div>
      </div>
    </section>
    <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center"><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">🌿 عن المبادرة</h2><p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">مشروع وطني طموح ضمن <strong className="text-green-600">رؤية عُمان 2040</strong> يهدف إلى استغلال <strong>16.97 مليون هكتار</strong> من الأراضي الزراعية غير المستغلة في 5 مناطق حكومية واعدة، باستخدام تقنيات الري الحديثة والبذور الطبيعية، لتحقيق الأمن الغذائي والاكتفاء الذاتي للسلطنة.</p></section>
    <section className="py-16 sm:py-20 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6"><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">📦 مميزات المنظومة</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{features.map((f,i)=><div key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"><div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{background:`${f.color}10`}}><f.icon size={24} color={f.color} /></div><h3 className="font-bold text-gray-900 mb-2">{f.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p></div>)}</div><div className="text-center mt-12"><Link to="/dashboard" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors text-lg">استكشف المنظومة كاملة <ArrowLeft size={18} /></Link></div></div></section>
  </div>
}