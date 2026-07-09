import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function CourseCard({ course }) {
  const isEnrolled = course.progress > 0;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block bg-chalk border border-line rounded-chip overflow-hidden hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="h-32 bg-ink/5 flex items-center justify-center text-5xl">
        {course.thumbnail}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="category">{course.category}</Badge>
          <Badge variant="level">{course.level}</Badge>
        </div>

        <h3 className="font-display text-lg text-ink leading-snug mb-1.5 group-hover:text-amber-dark transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate mb-4">by {course.instructor}</p>

        {isEnrolled ? (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate">
              <span>Progress</span>
              <span className="font-mono">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} size="sm" />
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate">
            <span>⭐ {course.rating}</span>
            <span>{course.studentsEnrolled.toLocaleString()} students</span>
            <span>{course.duration}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
