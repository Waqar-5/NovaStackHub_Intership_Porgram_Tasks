import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import CourseCard from '../components/course/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEnrolledCourses } from '../services/courseService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses()
      .then(setEnrolledCourses)
      .finally(() => setIsLoading(false));
  }, []);

  const totalHours = user?.totalHoursLearned ?? 0;
  const certificates = user?.certificatesEarned ?? 0;
  const streak = user?.streak ?? 0;

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Hours Learned" value={`${totalHours}h`} accent="amber" />
        <StatCard label="Day Streak" value={streak} accent="moss" />
        <StatCard label="Certificates" value={certificates} accent="ink" />
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl text-ink">Continue Learning</h2>
        <Link to="/my-courses" className="text-sm text-amber-dark font-medium hover:underline">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading your courses..." />
      ) : enrolledCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, accent }) {
  const accentColors = {
    amber: 'text-amber-dark',
    moss: 'text-moss',
    ink: 'text-ink',
  };

  return (
    <div className="bg-chalk border border-line rounded-chip p-5">
      <p className="text-xs text-slate mb-1.5">{label}</p>
      <p className={`font-display text-3xl ${accentColors[accent]}`}>{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-chalk border border-dashed border-line rounded-chip p-10 text-center">
      <p className="text-2xl mb-2">📭</p>
      <p className="text-ink font-medium mb-1">You haven't started any courses yet</p>
      <p className="text-sm text-slate mb-5">Browse the catalog and enroll in your first course.</p>
      <Link
        to="/courses"
        className="inline-block bg-amber text-ink text-sm font-medium px-4 py-2.5 rounded-chip hover:bg-amber-dark transition-colors"
      >
        Browse Courses
      </Link>
    </div>
  );
}
