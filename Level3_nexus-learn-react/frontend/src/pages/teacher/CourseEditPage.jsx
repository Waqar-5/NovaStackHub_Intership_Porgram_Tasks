import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, CheckCircle2, Users } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teacherService } from "@/services/teacherService";

function AddModuleForm({ courseId, onAdded }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await teacherService.addModule(courseId, title);
      setTitle("");
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="New module title (e.g. 'Getting Started')"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button type="submit" variant="outline" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Add module
      </Button>
    </form>
  );
}

function AddLessonForm({ courseId, moduleId, onAdded }) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await teacherService.addLesson(courseId, moduleId, { title, videoUrl });
      setTitle("");
      setVideoUrl("");
      setOpen(false);
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-primary hover:underline"
      >
        <Plus className="size-3.5" /> Add lesson
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2 rounded-md bg-glass p-3">
      <Input
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <Input
        placeholder="Video URL (optional)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Save
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function CreateAssignmentForm({ courseId, onCreated }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await teacherService.createAssignment({ courseId, title, deadline });
      setTitle("");
      setDeadline("");
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <Input
        placeholder="Assignment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 min-w-[180px]"
        required
      />
      <Input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <Button type="submit" size="sm" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Add assignment
      </Button>
    </form>
  );
}

export default function TeacherCourseEditPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["teacher", "course", id],
    queryFn: () => teacherService.getCourse(id),
  });
  const course = data?.data?.course;

  const { data: rosterData } = useQuery({
    queryKey: ["teacher", "course", id, "roster"],
    queryFn: () => teacherService.roster(id),
    enabled: Boolean(id),
  });
  const roster = rosterData?.data?.enrollments || [];

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["teacher", "course", id] });
  }

  async function handleTogglePublish() {
    setPublishError("");
    setPublishing(true);
    try {
      const nextStatus = course.status === "published" ? "draft" : "published";
      await teacherService.setCourseStatus(id, nextStatus);
      refresh();
    } catch (err) {
      setPublishError(err.response?.data?.message || "Couldn't update status.");
    } finally {
      setPublishing(false);
    }
  }

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 size-8 animate-spin text-muted-foreground" />;
  }

  if (!course) {
    return (
      <div className="glass mx-auto mt-10 max-w-lg rounded-lg p-10 text-center text-sm text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">{course.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${
              course.status === "published"
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            {course.status}
          </span>
        </div>

        <GlassCard>
          <h2 className="mb-3 font-display font-semibold">Curriculum</h2>
          <div className="space-y-4">
            {course.modules.map((mod) => (
              <div key={mod._id} className="border-b border-border pb-3 last:border-0">
                <p className="text-sm font-semibold">{mod.title}</p>
                <ul className="mt-1.5 space-y-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson._id} className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-accent" />
                      {lesson.title}
                    </li>
                  ))}
                </ul>
                <div className="mt-1 px-2">
                  <AddLessonForm courseId={id} moduleId={mod._id} onAdded={refresh} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <AddModuleForm courseId={id} onAdded={refresh} />
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-display font-semibold">Add an assignment</h2>
          <CreateAssignmentForm courseId={id} onCreated={refresh} />
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard>
          {publishError && <p className="mb-2 text-sm text-danger">{publishError}</p>}
          <Button className="w-full" onClick={handleTogglePublish} disabled={publishing}>
            {publishing && <Loader2 className="size-4 animate-spin" />}
            {course.status === "published" ? "Unpublish" : "Publish course"}
          </Button>
          {course.status !== "published" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Needs at least one lesson before it can go live.
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 flex items-center gap-2 font-display font-semibold">
            <Users className="size-4" /> Roster ({roster.length})
          </h2>
          {roster.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
          ) : (
            <ul className="space-y-2">
              {roster.slice(0, 8).map((e) => (
                <li key={e._id} className="flex items-center justify-between text-sm">
                  <span>{e.student?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {e.progressPercent}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
