import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";

function formatDuration(seconds = 0) {
  const hours = Math.round(seconds / 3600);
  return hours > 0 ? `${hours}h` : "<1h";
}

export function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`}>
      <GlassCard interactive className="flex h-full flex-col p-5">
        <div aria-hidden className="mb-4 h-28 rounded-md gradient-signature opacity-80" />
        <span className="text-xs font-medium text-accent">{course.category}</span>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          by {course.instructor?.name || "Nexus Learn"}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-warning text-warning" />
            {course.ratingAvg?.toFixed(1) || "New"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(course.durationSec)}
          </span>
          <span className="capitalize">{course.difficulty}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-lg font-bold">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
