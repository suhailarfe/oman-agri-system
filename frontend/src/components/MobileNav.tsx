import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, MapPin, Sprout, Users, Droplets, Leaf, BarChart3, LogOut, Wheat, TrendingUp, Menu, X } from 'lucide-react';

const tabs = [
  { id: '/', label: 'لوحة القيادة', icon: LayoutDashboard },
  { id: '/regions', label: 'المناطق الزراعية', icon: MapPin },
  { id: '/farms', label: 'المزارع', icon: Sprout },
  { id: '/plantings', label: 'دورات الزراعة', icon: Droplets },
  { id: '/harvests', label: 'سجلات الحصاد', icon: TrendingUp },
  { id: '/seeds', label: 'بنك البذور', icon: Leaf },
  { id: '/finance', label: 'الجدوى المالية', icon: BarChart3 },
  { id: '/users', label: 'المستخدمين', icon: Users, adminOnly: true },
];

export default function MobileNav() {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-ink fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal"><Wheat size={16} className="text-white" /></div>
          <span className="text-white font-bold text-sm font-kufi">النظام الزراعي</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white">{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-ink pt-16 overflow-y-auto">
          <nav className="flex flex-col gap-1 p-4">
            {tabs.map(t => {
              if (t.adminOnly && !isAdmin) return null;
              return (
                <NavLink key={t.id} to={t.id} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold ${location.pathname === t.id ? 'bg-white/8 text-white' : 'text-white/55'}`}>
                  <t.icon size={18} />{t.label}
                </NavLink>
              );
            })}
            <button onClick={() => { setOpen(false); logout(); }} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white mt-4 border-t border-white/10 pt-4">
              <LogOut size={18} />تسجيل الخروج
            </button>
          </nav>
        </div>
      )}
      <div className="lg:hidden h-14" />
    </>
  );
}
