"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BookOpen, FileText, CreditCard, ClipboardCheck, Flame, Check, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { markOneRead, markAllRead } from "@/lib/actions/notifications";
import type { Notification, NotificationType } from "@/types/database";

const iconMap: Record<NotificationType, typeof Bell> = {
  class_reminder: BookOpen,
  test_ready: ClipboardCheck,
  report_sent: FileText,
  payment_due: CreditCard,
  streak: Flame,
};

const colorMap: Record<NotificationType, string> = {
  class_reminder: "text-blue-500 bg-blue-50",
  test_ready: "text-purple-500 bg-purple-50",
  report_sent: "text-green-500 bg-green-50",
  payment_due: "text-orange-500 bg-orange-50",
  streak: "text-amber-500 bg-amber-50",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const items = (data || []) as Notification[];
    setNotifications(items);
    setUnreadCount(items.filter((n) => !n.is_read).length);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  const handleMarkOne = async (id: string) => {
    await markOneRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#e94560] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-[#1a1a2e] text-sm">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1 text-xs text-[#e94560] hover:text-[#d63451] font-medium cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = iconMap[notif.type] || Bell;
                  const colors = colorMap[notif.type] || "text-gray-500 bg-gray-50";

                  return (
                    <div
                      key={notif.id}
                      className={`flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notif.is_read ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-tight ${
                            !notif.is_read
                              ? "font-semibold text-[#1a1a2e]"
                              : "text-gray-700"
                          }`}
                        >
                          {notif.title}
                        </p>
                        {notif.message && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {notif.message}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {timeAgo(notif.created_at)}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={() => handleMarkOne(notif.id)}
                          className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
