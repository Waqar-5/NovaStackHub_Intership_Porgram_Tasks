import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courseService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { cn } from "@/lib/utils";

function flattenLessons(course) {
  const flat = [];
  for (const mod of course?.modules || []) {
    for (const lesson of mod.lessons) {
      flat.push({ ...lesson, moduleTitle: mod.title });
    }
  }
  return flat;
}

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [marking, setMarking] = useState(false);

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", "id", courseId],
    queryFn: () => courseService.getById(courseId),
  });
  const course = courseData?.data?.course;

  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: () => enrollmentService.getForCourse(courseId),
    enabled: Boolean(courseId),
    retry: false,
  });
  const enrollment = enrollmentData?.data?.enrollment;

  const lessons = flattenLessons(course);
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const lesson = lessons[currentIndex];
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  const completedSet = new Set((enrollment?.completedLessonIds || []).map(String));
  const isComplete = completedSet.has(lessonId);

  async function handleMarkComplete() {
    if (!enrollment) return;
    setMarking(true);
    try {
      await enrollmentService.markLessonComplete(enrollment._id, lessonId);
      await queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      await queryClient.invalidateQueries({ queryKey: ["enrollments", "me"] });
      if (nextLesson) {
        navigate(`/learn/${courseId}/${nextLesson._id}`);
      }
    } finally {
      setMarking(false);
    }
  }

  if (courseLoading || enrollmentLoading) {
    return <Loader2 className="mx-auto mt-20 size-8 animate-spin text-muted-foreground" />;
  }

  if (!course || !lesson) {
    return (
      <div className="glass mx-auto mt-10 max-w-lg rounded-lg p-10 text-center text-sm text-muted-foreground">
        Lesson not found.
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="glass mx-auto mt-10 max-w-lg rounded-lg p-10 text-center text-sm text-muted-foreground">
        You need to enroll in this course first.{" "}
        <Link to={`/courses/${course.slug}`} className="text-primary hover:underline">
          Go to course page
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {course.title}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold">{lesson.title}</h1>
        </div>

        <div
          aria-hidden
          className="flex h-72 items-center justify-center rounded-lg gradient-signature text-sm text-white/80"
        >
          {lesson.videoUrl ? "Video player" : "Lesson content"}
        </div>

        {lesson.content && (
          <GlassCard>
            <p className="text-sm text-muted-foreground">{lesson.content}</p>
          </GlassCard>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={!prevLesson}
            onClick={() => prevLesson && navigate(`/learn/${courseId}/${prevLesson._id}`)}
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>

          {isComplete ? (
            <Button
              variant="glass"
              onClick={() => nextLesson && navigate(`/learn/${courseId}/${nextLesson._id}`)}
              disabled={!nextLesson}
            >
              <CheckCircle2 className="size-4 text-success" /> Completed
              {nextLesson && (
                <>
                  {" "}
                  — Next <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleMarkComplete} disabled={marking}>
              {marking && <Loader2 className="size-4 animate-spin" />}
              Mark complete{nextLesson ? " & continue" : ""}
            </Button>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <GlassCard>
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Course progress</span>
            <span>{enrollment.progressPercent}%</span>
          </div>
          <Progress value={enrollment.progressPercent} />
        </GlassCard>

        <GlassCard className="max-h-[60vh] overflow-y-auto">
          <p className="mb-2 font-display text-sm font-semibold">Curriculum</p>
          <div className="space-y-3">
            {course.modules.map((mod) => (
              <div key={mod._id || mod.title}>
                <p className="text-xs font-medium text-muted-foreground">{mod.title}</p>
                <ul className="mt-1 space-y-0.5">
                  {mod.lessons.map((l) => {
                    const done = completedSet.has(l._id);
                    const active = l._id === lessonId;
                    return (
                      <li key={l._id}>
                        <Link
                          href={`/learn/${courseId}/${l._id}`}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-glass"
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                          ) : (
                            <Circle className="size-3.5 shrink-0" />
                          )}
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      </aside>
    </div>
  );
}
