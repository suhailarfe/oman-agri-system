import { Bell, CheckCheck, FileCheck2, FileClock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export function NotificationCenter() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const notificationsQuery = trpc.program.notifications.list.useQuery(undefined, { enabled: Boolean(user) });
  const markRead = trpc.program.notifications.markRead.useMutation({
    onSuccess: async () => utils.program.notifications.list.invalidate(),
  });
  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => notification.isRead === 0).length;

  if (!user) return null;

  return (
    <details className="relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-line bg-white px-3 text-xs font-bold text-falaj outline-none focus-visible:border-falaj">
        <Bell size={15} /> الإشعارات {unreadCount > 0 && <span className="font-mono text-[11px]">{unreadCount}</span>}
      </summary>
      <div className="absolute left-0 z-20 mt-2 w-80 rounded-xl border border-line bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,.06)]">
        <div className="mb-2 flex items-center justify-between"><strong className="text-xs text-falaj-deep">تنبيهات الحساب</strong><span className="text-[11px] text-muted">{user.role === "admin" ? "مشرف" : "مستثمر"}</span></div>
        {notificationsQuery.isLoading && <p className="p-3 text-xs text-muted">يجري تحميل الإشعارات.</p>}
        {!notificationsQuery.isLoading && notifications.length === 0 && <p className="rounded-lg border border-line bg-paper p-3 text-xs text-muted">لا توجد إشعارات جديدة.</p>}
        <div className="max-h-80 space-y-2 overflow-y-auto">{notifications.map((notification) => <button key={notification.id} type="button" onClick={() => notification.isRead === 0 && markRead.mutate({ id: notification.id })} className={`w-full rounded-lg border p-3 text-right transition-colors ${notification.isRead === 0 ? "border-falaj/30 bg-falaj-soft hover:bg-paper" : "border-line bg-white hover:bg-paper"}`}><div className="mb-1 flex items-center gap-2 text-xs font-bold text-falaj-deep">{notification.type === "draft" ? <FileClock size={14} /> : <FileCheck2 size={14} />}{notification.title}{notification.isRead === 1 && <CheckCheck size={13} className="mr-auto text-muted" />}</div><p className="text-[11px] leading-relaxed text-muted">{notification.content}</p><p className="mt-1 text-[10px] text-muted">{new Date(notification.createdAt).toLocaleString("ar-OM")}</p></button>)}</div>
      </div>
    </details>
  );
}
