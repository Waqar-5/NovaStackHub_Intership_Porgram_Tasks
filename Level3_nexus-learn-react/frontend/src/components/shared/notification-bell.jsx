import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notificationService";
import { cn } from "@/lib/utils";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.mine,
    refetchInterval: 60_000, // fallback poll — sockets handle the real-time path
  });
  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function handleClick(notification) {
    if (!notification.isRead) {
      await notificationService.markRead(notification._id);
      refresh();
    }
    setOpen(false);
    if (notification.link) navigate(notification.link);
  }

  async function handleMarkAllRead() {
    await notificationService.markAllRead();
    refresh();
  }

  return (
    <div className="relative">
      <Button
        variant="glass"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="glass absolute right-0 z-20 mt-2 w-80 rounded-lg p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Check className="size-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleClick(n)}
                    className={cn(
                      "block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-glass",
                      !n.isRead && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("leading-snug", !n.isRead && "font-medium")}>{n.title}</p>
                      {!n.isRead && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                    {n.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
