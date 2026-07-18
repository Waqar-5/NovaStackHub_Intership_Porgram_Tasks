import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { teacherService } from "@/services/teacherService";
import { cn } from "@/lib/utils";

const STATUSES = ["present", "absent", "late", "leave"];
const STATUS_STYLE = {
  present: "bg-success/10 text-success border-success/30",
  absent: "bg-danger/10 text-danger border-danger/30",
  late: "bg-warning/10 text-warning border-warning/30",
  leave: "bg-glass text-muted-foreground border-border",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherAttendancePage() {
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: coursesData } = useQuery({
    queryKey: ["teacher", "courses"],
    queryFn: teacherService.myCourses,
  });
  const courses = (coursesData?.data?.courses || []).filter((c) => c.status === "published");

  const { data: rosterData, isLoading: rosterLoading } = useQuery({
    queryKey: ["teacher", "course", courseId, "roster"],
    queryFn: () => teacherService.roster(courseId),
    enabled: Boolean(courseId),
  });
  const roster = rosterData?.data?.enrollments || [];

  function setMark(studentId, status) {
    setMarks((m) => ({ ...m, [studentId]: status }));
    setSaved(false);
  }

  async function handleSave() {
    const records = roster
      .map((e) => ({ studentId: e.student._id, status: marks[e.student._id] }))
      .filter((r) => r.status);

    if (records.length === 0) return;

    setSaving(true);
    try {
      await teacherService.markAttendance({ courseId, date, records });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Mark attendance</h1>

      <GlassCard className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Course</label>
          <select
            className="block rounded-md border border-border bg-surface px-3 py-2 text-sm"
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              setMarks({});
              setSaved(false);
            }}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Date</label>
          <input
            type="date"
            className="block rounded-md border border-border bg-surface px-3 py-2 text-sm"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSaved(false);
            }}
          />
        </div>
      </GlassCard>

      {!courseId ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          Pick a course to see its roster.
        </div>
      ) : rosterLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : roster.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No students enrolled in this course yet.
        </div>
      ) : (
        <GlassCard className="space-y-1 p-0">
          {roster.map((e) => (
            <div
              key={e._id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 last:border-0"
            >
              <span className="text-sm">{e.student?.name}</span>
              <div className="flex gap-1.5">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setMark(e.student._id, status)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs capitalize transition-colors",
                      marks[e.student._id] === status
                        ? STATUS_STYLE[status]
                        : "border-transparent text-muted-foreground hover:bg-glass"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </GlassCard>
      )}

      {courseId && roster.length > 0 && (
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save attendance
          </Button>
          {saved && <span className="text-sm text-success">Saved.</span>}
        </div>
      )}
    </div>
  );
}
