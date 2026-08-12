import { Outlet, Link, useLocation } from 'react-router-dom'
import { Map, Sprout, Droplets, DollarSign, Settings, BarChart3, Mail, Phone } from 'lucide-react'

const navItems = [
  { path:'/dashboard', label:'لوحة التحكم', icon:BarChart3 },
  { path:'/regions', label:'المناطق', icon:Map },
  { path:'/farms', label:'المزارع', icon:Sprout },
  { path:'/water', label:'المياه', icon:Droplets },
  { path:'/reports', label:'التقارير', icon:DollarSign },
  { path:'/settings', label:'الإعدادات', icon:Settings },
]

export default function Layout() {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
            <img src="/logo2040.png" alt="رؤية عُمان 2040" className="h-10 w-10 rounded-lg object-contain bg-white" />
            <div className="hidden sm:block"><div className="font-bold text-base text-gray-900 leading-tight">رؤية عُمان 2040</div><div className="text-xs text-gray-400">الأمن الغذائي والزراعي</div></div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = loc.pathname.startsWith(item.path)
              return <Link key={item.path} to={item.path} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active?'bg-green-50 text-green-700':'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}><item.icon size={16} /> {item.label}</Link>
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-white border-t border-gray-100 mt-auto"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"><div className="flex items-center gap-3"><img src="/logo2040.png" alt="رؤية 2040" className="h-8 w-8 rounded object-contain" /><span className="text-sm text-gray-500">🇴🇲 سهيل عارف قائد أحمد الحكيمي</span></div><div className="flex items-center gap-6 text-sm text-gray-400"><span className="flex items-center gap-1.5"><Mail size={14} className="text-green-600" /> suhailarfe@gmail.com</span><span className="flex items-center gap-1.5"><Phone size={14} className="text-green-600" /> 00967736986271</span></div></div></footer>
    </div>
  )
}