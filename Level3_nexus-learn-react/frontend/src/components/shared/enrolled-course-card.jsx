import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/glass-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function firstIncompleteLessonId(course, completedIds) {
  const completedSet = new Set(completedIds.map(String));
  for (const mod of course.modules || []) {
    for (const lesson of mod.lessons) {
      if (!completedSet.has(lesson._id)) return lesson._id;
    }
  }
  return course.modules?.[0]?.lessons?.[0]?._id;
}

export function EnrolledCourseCard({ enrollment }) {
  const course = enrollment.course;
  if (!course) return null;

  const nextLessonId = firstIncompleteLessonId(course, enrollment.completedLessonIds);
  const continueHref = nextLessonId
    ? `/learn/${course._id}/${nextLessonId}`
    : `/courses/${course.slug}`;

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-accent">{course.category}</span>
          <h3 className="font-display text-base font-semibold leading-snug">{course.title}</h3>
          <p className="text-xs text-muted-foreground">by {course.instructor?.name}</p>
        </div>
        {enrollment.status === "completed" && (
          <span className="glass shrink-0 rounded-full px-2.5 py-1 text-xs text-success">
            Completed
          </span>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{enrollment.progressPercent}% complete</span>
        </div>
        <Progress value={enrollment.progressPercent} />
      </div>

      <Button asChild size="sm" className="mt-1 w-full">
        <Link to={continueHref}>
          {enrollment.progressPercent === 0 ? "Start course" : "Continue learning"}
        </Link>
      </Button>
    </GlassCard>
  );
}
