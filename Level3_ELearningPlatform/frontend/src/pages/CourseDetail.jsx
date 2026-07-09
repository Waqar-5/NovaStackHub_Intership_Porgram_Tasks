import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import { fetchCourseById, enrollInCourse } from '../services/courseService';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseById(courseId)
      .then(setCourse)
      .finally(() => setIsLoading(false));
  }, [courseId]);

  async function handleEnroll() {
    setIsEnrolling(true);
    try {
      await enrollInCourse(courseId);
      navigate(`/courses/${courseId}/learn`);
    } finally {
      setIsEnrolling(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Course">
        <LoadingSpinner label="Loading course details..." />
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">
        <p className="text-slate">This course doesn't exist or may have been removed.</p>
      </DashboardLayout>
    );
  }

  const isEnrolled = course.progress > 0;
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <DashboardLayout title={course.title}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-48 bg-ink/5 rounded-chip flex items-center justify-center text-7xl mb-6">
            {course.thumbnail}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="category">{course.category}</Badge>
            <Badge variant="level">{course.level}</Badge>
          </div>

          <p className="text-slate leading-relaxed mb-8">{course.description}</p>

          <h2 className="font-display text-lg text-ink mb-4">Course Content</h2>
          <div className="border border-line rounded-chip overflow-hidden divide-y divide-line">
            {course.modules.map((module, idx) => (
              <div key={module.id} className="p-4 bg-chalk">
                <p className="text-sm font-medium text-ink mb-2">
                  Module {idx + 1}: {module.title}
                </p>
                <ul className="space-y-1.5 pl-1">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between text-sm text-slate">
                      <span className="flex items-center gap-2">
                        <span className={lesson.completed ? 'text-moss' : 'text-slate/40'}>
                          {lesson.completed ? '✓' : '○'}
                        </span>
                        {lesson.title}
                      </span>
                      <span className="text-xs font-mono text-slate/60">{lesson.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-chalk border border-line rounded-chip p-6 sticky top-24">
            <p className="text-sm text-slate mb-1">Instructor</p>
            <p className="font-medium text-ink mb-5">{course.instructor}</p>

            <div className="space-y-3 text-sm text-slate mb-6">
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="font-medium text-ink">⭐ {course.rating}</span>
              </div>
              <div className="flex justify-between">
                <span>Students</span>
                <span className="font-medium text-ink">{course.studentsEnrolled.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium text-ink">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Lessons</span>
                <span className="font-medium text-ink">{totalLessons}</span>
              </div>
            </div>

            {isEnrolled ? (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate mb-1.5">
                    <span>Your progress</span>
                    <span className="font-mono">{course.progress}%</span>
                  </div>
                  <ProgressBar value={course.progress} />
                </div>
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => navigate(`/courses/${courseId}/learn`)}
                >
                  Continue Learning
                </Button>
              </>
            ) : (
              <Button
                variant="accent"
                className="w-full"
                onClick={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Free'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
