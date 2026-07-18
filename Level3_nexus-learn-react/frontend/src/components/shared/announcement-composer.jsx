import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Megaphone } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { announcementService } from "@/services/announcementService";

/**
 * courses: optional list of { _id, title } — when provided, the teacher
 * picks which of their courses to announce to. When omitted (admin use),
 * every post is scope: "global".
 */
export function AnnouncementComposer({ courses }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseId, setCourseId] = useState(courses?.[0]?._id || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [posted, setPosted] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = courses
        ? { scope: "course", courseId, title, body }
        : { scope: "global", title, body };
      await announcementService.create(payload);
      setTitle("");
      setBody("");
      setPosted(true);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setTimeout(() => setPosted(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post announcement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
        <Megaphone className="size-4" /> Post an announcement
      </h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {courses && (
          <select
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea
          rows={2}
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={submitting || (courses && !courseId)}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Post
          </Button>
          {posted && <span className="text-xs text-success">Posted.</span>}
        </div>
      </form>
    </GlassCard>
  );
}
