import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Wheat } from 'lucide-react';

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(username, password); navigate('/'); }
    catch (err: any) { setError(err.response?.data?.detail || 'فشل تسجيل الدخول'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal flex items-center justify-center mx-auto mb-4"><Wheat size={32} className="text-white" /></div>
          <h1 className="text-2xl font-black text-ink font-kufi">نظام إدارة المشروع الزراعي</h1>
          <p className="text-textSecondary mt-1">رؤية عُمان 2040 — الأمن الغذائي والزراعي</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <div><label className="text-xs font-bold text-textSecondary block mb-1.5">اسم المستخدم</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin / farmer1 / supplier1" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30" /></div>
          <div><label className="text-xs font-bold text-textSecondary block mb-1.5">كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30" /></div>
          {error && <div className="bg-rust-light text-rust text-sm rounded-xl px-4 py-2.5 font-bold">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-ink text-white py-3 rounded-xl font-bold hover:bg-inkLight transition-colors disabled:opacity-50">{loading ? 'جاري الدخول...' : 'تسجيل الدخول'}</button>
          <div className="text-xs text-center text-textSecondary space-y-1 pt-2 border-t border-border">
            <p className="font-bold">بيانات تجريبية:</p>
            <p>admin / admin123 — مدير النظام</p>
            <p>farmer1 / farmer123 — المشغّل الميداني</p>
            <p>supplier1 / supplier123 — مورد البذور</p>
          </div>
        </form>
      </div>
    </div>
  );
}
