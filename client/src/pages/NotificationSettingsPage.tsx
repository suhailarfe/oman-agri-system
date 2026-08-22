import { ArrowRight, BellOff, BellRing, LoaderCircle, Save, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

function asLocalInputValue(value: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const preferencesQuery = trpc.program.notifications.preferences.useQuery(undefined, { enabled: Boolean(user) });
  const savePreferences = trpc.program.notifications.updatePreferences.useMutation({
    onSuccess: () => utils.program.notifications.preferences.invalidate(),
  });
  const preferences = preferencesQuery.data;

  if (!user) {
    return <main className="grid min-h-screen place-items-center bg-paper px-6" dir="rtl"><section className="max-w-md rounded-2xl border border-line bg-white p-8 text-center"><h1 className="mb-3 font-kufi text-xl font-bold text-falaj-deep">إعدادات الإشعارات</h1><p className="mb-5 text-sm leading-relaxed text-muted">سجّل الدخول لتحديد أنواع التنبيهات التي تريد استلامها.</p><button type="button" onClick={startLogin} className="h-10 rounded-lg bg-falaj px-4 text-sm font-bold text-white">تسجيل الدخول</button></section></main>;
  }

  const persist = (values: { draftNotificationsEnabled?: boolean; publishedNotificationsEnabled?: boolean; mutedUntil?: number | null }) => {
    if (!preferences) return;
    savePreferences.mutate({
      draftNotificationsEnabled: values.draftNotificationsEnabled ?? preferences.draftNotificationsEnabled === 1,
      publishedNotificationsEnabled: values.publishedNotificationsEnabled ?? preferences.publishedNotificationsEnabled === 1,
      mutedUntil: values.mutedUntil !== undefined ? values.mutedUntil : preferences.mutedUntil ? new Date(preferences.mutedUntil).getTime() : null,
    });
  };

  const mutedUntil = preferences?.mutedUntil ? new Date(preferences.mutedUntil) : null;
  const isMuted = Boolean(mutedUntil && mutedUntil.getTime() > Date.now());

  return (
    <div className="site-shell min-h-screen bg-paper text-ink" dir="rtl">
      <header className="site-header site-header--scrolled flex items-center justify-between border-b border-line bg-white/90 px-8 py-4 backdrop-blur-md"><div><strong className="font-kufi text-falaj-deep">إعدادات الإشعارات</strong><small className="mr-2 text-[11px] text-muted">{user.name || "الحساب الحالي"}</small></div><a href="/roadmap" className="flex items-center gap-1 text-xs font-bold text-falaj hover:underline">العودة لخارطة الطريق <ArrowRight size={14} /></a></header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="rounded-3xl border border-line bg-white p-6 md:p-8">
          <div className="mb-7 flex items-start gap-3"><SlidersHorizontal className="mt-1 text-falaj" size={22} /><div><h1 className="font-kufi text-2xl font-extrabold text-falaj-deep">تفضيلات التنبيهات</h1><p className="mt-2 text-sm leading-relaxed text-muted">تُطبّق هذه الخيارات على التنبيهات الجديدة الموجهة إلى حسابك فقط.</p></div></div>
          {preferencesQuery.isLoading && <p className="text-sm text-muted"><LoaderCircle className="ml-2 inline animate-spin" size={15} /> يجري تحميل التفضيلات.</p>}
          {preferences && <div className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line p-4 transition-colors hover:bg-paper"><span><strong className="flex items-center gap-2 text-sm text-falaj-deep"><BellRing size={16} /> مسودات بانتظار الاعتماد</strong><small className="mt-1 block text-xs text-muted">تنبيه عند إضافة مسودة مواصفات جديدة للمراجعة الإدارية.</small></span><input aria-label="تنبيهات المسودات" type="checkbox" checked={preferences.draftNotificationsEnabled === 1} onChange={(event) => persist({ draftNotificationsEnabled: event.target.checked })} className="h-4 w-4 accent-[#1f5a45]" /></label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line p-4 transition-colors hover:bg-paper"><span><strong className="flex items-center gap-2 text-sm text-falaj-deep"><BellRing size={16} /> الإصدارات المنشورة</strong><small className="mt-1 block text-xs text-muted">تنبيه عند اعتماد إصدار جديد متاح للمستثمرين.</small></span><input aria-label="تنبيهات الإصدارات المنشورة" type="checkbox" checked={preferences.publishedNotificationsEnabled === 1} onChange={(event) => persist({ publishedNotificationsEnabled: event.target.checked })} className="h-4 w-4 accent-[#1f5a45]" /></label>
            <div className="rounded-xl border border-line bg-paper p-4"><div className="mb-3 flex items-center gap-2 text-falaj-deep"><BellOff size={16} /><strong className="text-sm">كتم مؤقت للإشعارات</strong></div><p className="mb-3 text-xs leading-relaxed text-muted">اختر تاريخاً ووقتاً لإيقاف تنبيهات المسودات والإصدارات مؤقتاً. تعود التفضيلات للعمل تلقائياً بعد الموعد.</p><div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-xs font-bold text-falaj-deep">الكتم حتى<input type="datetime-local" value={asLocalInputValue(preferences.mutedUntil)} min={asLocalInputValue(new Date())} onChange={(event) => persist({ mutedUntil: event.target.value ? new Date(event.target.value).getTime() : null })} className="h-9 rounded-lg border border-line bg-white px-2 text-xs text-ink" /></label>{isMuted && <button type="button" onClick={() => persist({ mutedUntil: null })} className="h-9 rounded-lg border border-falaj px-3 text-xs font-bold text-falaj hover:bg-falaj-soft">إلغاء الكتم</button>}</div>{isMuted && <p className="mt-3 text-xs font-bold text-falaj">الإشعارات مكتومة حتى {mutedUntil?.toLocaleString("ar-OM")}</p>}</div>
          </div>}
          {savePreferences.isSuccess && <p role="status" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-falaj"><Save size={14} /> تم حفظ تفضيلاتك.</p>}
          {savePreferences.isError && <p role="alert" className="mt-4 text-xs font-bold text-red-700">تعذر حفظ تفضيلاتك. أعد المحاولة.</p>}
        </section>
      </main>
    </div>
  );
}
