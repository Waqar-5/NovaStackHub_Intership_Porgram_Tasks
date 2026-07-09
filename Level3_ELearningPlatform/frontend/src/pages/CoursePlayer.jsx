import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LessonItem from '../components/course/LessonItem';
import Button from '../components/common/Button';
import { fetchCourseById, markLessonComplete } from '../services/courseService';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourseById(courseId).then((data) => {
      setCourse(data);
      if (data?.modules?.length) {
        const firstIncomplete = data.modules
          .flatMap((m) => m.lessons)
          .find((l) => !l.completed);
        setActiveLesson(firstIncomplete || data.modules[0].lessons[0]);
      }
      setIsLoading(false);
    });
  }, [courseId]);

  async function handleMarkComplete() {
    if (!activeLesson || activeLesson.completed) return;

    await markLessonComplete(courseId, activeLesson.id);

    setCourse((prev) => {
      const updatedModules = prev.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === activeLesson.id ? { ...l, completed: true } : l
        ),
      }));
      return { ...prev, modules: updatedModules };
    });
    setActiveLesson((prev) => ({ ...prev, completed: true }));
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading lesson..." />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate">
        Course not found.
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-line bg-chalk px-5 py-3 flex items-center justify-between">
        <Link to={`/courses/${courseId}`} className="text-sm text-slate hover:text-ink flex items-center gap-2">
          ← <span className="font-display text-base text-ink truncate max-w-[200px] sm:max-w-md">{course.title}</span>
        </Link>
        <button onClick={() => navigate('/my-courses')} className="text-xs text-slate hover:text-ink">
          Exit
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Module sidebar */}
        <aside className="hidden md:flex flex-col w-72 border-r border-line bg-chalk overflow-y-auto">
          {course.modules.map((module, idx) => (
            <div key={module.id}>
              <p className="px-4 pt-4 pb-2 text-xs font-semibold text-slate uppercase tracking-wide">
                Module {idx + 1} · {module.title}
              </p>
              {module.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isActive={lesson.id === activeLesson?.id}
                  onSelect={setActiveLesson}
                />
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-10">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-amber-dark font-medium uppercase tracking-wide mb-2">
              {activeLesson?.type}
            </p>
            <h1 className="font-display text-2xl text-ink mb-6">{activeLesson?.title}</h1>

            <div className="aspect-video bg-ink rounded-chip flex items-center justify-center text-paper/40 text-sm mb-8">
              {activeLesson?.type === 'video'
                ? '▶ Video player placeholder'
                : activeLesson?.type === 'quiz'
                ? '? Quiz interface placeholder'
                : '✎ Assignment brief placeholder'}
            </div>

            <p className="text-slate leading-relaxed mb-10">
              This is where the actual lesson content, video embed, quiz questions, or
              assignment instructions would render — pulled from the course content stored
              in MongoDB and served through the <code className="font-mono text-xs bg-ink/5 px-1.5 py-0.5 rounded">{`/api/courses/${courseId}/lessons/${activeLesson?.id}`}</code> endpoint.
            </p>

            <div className="flex items-center justify-between border-t border-line pt-6">
              <Button
                variant="ghost"
                disabled={!prevLesson}
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
              >
                ← Previous
              </Button>

              <Button
                variant={activeLesson?.completed ? 'outline' : 'accent'}
                onClick={handleMarkComplete}
              >
                {activeLesson?.completed ? '✓ Completed' : 'Mark as Complete'}
              </Button>

              <Button
                variant="ghost"
                disabled={!nextLesson}
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
              >
                Next →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
