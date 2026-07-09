import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import CourseCard from '../components/course/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEnrolledCourses } from '../services/courseService';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses()
      .then(setCourses)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Courses">
      {isLoading ? (
        <LoadingSpinner label="Loading your courses..." />
      ) : courses.length === 0 ? (
        <div className="bg-chalk border border-dashed border-line rounded-chip p-10 text-center">
          <p className="text-2xl mb-2">📭</p>
          <p className="text-ink font-medium mb-1">No enrolled courses yet</p>
          <p className="text-sm text-slate mb-5">Find something worth learning in the catalog.</p>
          <Link
            to="/courses"
            className="inline-block bg-amber text-ink text-sm font-medium px-4 py-2.5 rounded-chip hover:bg-amber-dark transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
