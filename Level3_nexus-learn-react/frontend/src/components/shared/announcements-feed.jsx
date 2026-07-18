import { useQuery } from "@tanstack/react-query";
import { Megaphone, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { announcementService } from "@/services/announcementService";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

export function AnnouncementsFeed({ limit = 5 }) {
  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: announcementService.mine,
  });
  const announcements = (data?.data?.announcements || []).slice(0, limit);

  if (isLoading) {
    return <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />;
  }

  if (announcements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No announcements right now.</p>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <GlassCard key={a._id} className="flex gap-3">
          <Megaphone className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{a.title}</p>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {timeAgo(a.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {a.scope === "global" ? "Platform-wide" : a.course?.title} · {a.author?.name}
            </p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
