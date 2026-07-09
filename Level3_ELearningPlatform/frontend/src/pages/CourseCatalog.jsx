import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CourseCard from '../components/course/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { searchCourses } from '../services/courseService';
import { categories } from '../data/courses';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    searchCourses(query, activeCategory)
      .then(setCourses)
      .finally(() => setIsLoading(false));
  }, [query, activeCategory]);

  return (
    <DashboardLayout title="Browse Courses">
      <div className="mb-6 space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses or instructors..."
          className="w-full sm:max-w-md px-4 py-2.5 border border-line rounded-chip text-sm outline-none focus:border-amber transition-colors bg-chalk"
        />

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-chip text-xs font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-chalk text-slate border-line hover:border-ink/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Finding courses..." />
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-slate">
          <p className="text-2xl mb-2">🔍</p>
          <p>No courses match your search.</p>
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
