import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/adminService";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  published: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-glass text-muted-foreground",
};

function CourseRow({ course, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function run(action) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <p className="text-sm font-medium">{course.title}</p>
        <p className="text-xs text-muted-foreground">by {course.instructor?.name}</p>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">{course.category}</td>
      <td className="px-4 py-3">
        <span className={cn("rounded-full px-2 py-0.5 text-xs capitalize", STATUS_STYLE[course.status])}>
          {course.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {course.status !== "published" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => run(() => adminService.setCourseStatus(course._id, "published"))}
            >
              Publish
            </Button>
          )}
          {course.status !== "archived" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => run(() => adminService.setCourseStatus(course._id, "archived"))}
            >
              Archive
            </Button>
          )}
          {confirmingDelete ? (
            <>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => run(() => adminService.deleteCourse(course._id))}
              >
                Confirm
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-danger hover:bg-danger/10"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminCoursesPage() {
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "courses", { status }],
    queryFn: () => adminService.listAllCourses({ status: status || undefined, limit: 50 }),
  });
  const courses = data?.data?.courses || [];

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <select
          className="glass rounded-md px-3 py-2 text-sm capitalize"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : courses.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No courses match that filter.
        </div>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <CourseRow key={c._id} course={c} onChanged={refresh} />
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
