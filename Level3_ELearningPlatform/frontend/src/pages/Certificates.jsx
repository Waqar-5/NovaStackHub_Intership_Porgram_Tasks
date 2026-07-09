import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEnrolledCourses } from '../services/courseService';

export default function Certificates() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses().then((courses) => {
      setCompletedCourses(courses.filter((c) => c.progress === 100));
      setIsLoading(false);
    });
  }, []);

  return (
    <DashboardLayout title="Certificates">
      {isLoading ? (
        <LoadingSpinner label="Loading certificates..." />
      ) : completedCourses.length === 0 ? (
        <div className="bg-chalk border border-dashed border-line rounded-chip p-10 text-center">
          <p className="text-2xl mb-2">🎓</p>
          <p className="text-ink font-medium mb-1">No certificates yet</p>
          <p className="text-sm text-slate">Complete a course to earn your first certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {completedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-chalk border border-amber/30 rounded-chip p-6 relative overflow-hidden"
            >
              <p className="text-xs text-amber-dark font-medium uppercase tracking-wide mb-3">
                Certificate of Completion
              </p>
              <h3 className="font-display text-lg text-ink mb-1">{course.title}</h3>
              <p className="text-sm text-slate">Instructor: {course.instructor}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
