import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, MapPin, Sprout, Wallet, Users, Droplets, Leaf, LogOut, Wheat, TrendingUp, BarChart3 } from 'lucide-react';

const tabs = [
  { id: '/', label: 'لوحة القيادة', icon: LayoutDashboard },
  { id: '/regions', label: 'المناطق الزراعية', icon: MapPin },
  { id: '/farms', label: 'المزارع والزراعة', icon: Sprout },
  { id: '/plantings', label: 'دورات الزراعة', icon: Droplets },
  { id: '/harvests', label: 'سجلات الحصاد', icon: TrendingUp },
  { id: '/seeds', label: 'بنك البذور', icon: Leaf },
  { id: '/finance', label: 'الجدوى المالية', icon: BarChart3 },
  { id: '/users', label: 'المستخدمين', icon: Users, adminOnly: true },
];

const roleLabels: Record<string, string> = { admin: 'مدير النظام', farmer: 'المشغّل الميداني', supplier: 'مورد البذور' };

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col p-6 bg-ink">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-teal">
          <Wheat size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm leading-tight font-kufi">نظام إدارة المشروع الزراعي</p>
          <p className="text-white/50 text-xs">رؤية عُمان 2040</p>
        </div>
      </div>
      <p className="text-white/40 text-xs font-bold mb-2 px-2">تعمل الآن بصفة</p>
      <div className="bg-white/5 rounded-lg px-3 py-2 mb-6">
        <p className="text-white font-bold text-sm">{roleLabels[user?.role || 'admin'] || user?.role}</p>
        <p className="text-white/50 text-xs">{user?.display_name}</p>
      </div>
      <div className="h-px bg-white/10 mb-6" />
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map(t => {
          if (t.adminOnly && !isAdmin) return null;
          const active = location.pathname === t.id;
          return (
            <NavLink key={t.id} to={t.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-white/8 text-white' : 'text-white/55 hover:text-white/80'}`}>
              <t.icon size={18} />{t.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-white/10">
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full">
          <LogOut size={16} />تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
