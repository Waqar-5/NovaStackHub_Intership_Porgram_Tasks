import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Clock, PlayCircle, Lock, Loader2, Heart } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { courseService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { profileService } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";

function formatDuration(seconds = 0) {
  const m = Math.round(seconds / 60);
  return m >= 60 ? `${Math.round(m / 60)}h ${m % 60}m` : `${m}m`;
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => courseService.getBySlug(slug),
  });
  const course = courseData?.data?.course;

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollment", course?._id],
    queryFn: () => enrollmentService.getForCourse(course._id),
    enabled: Boolean(course?._id),
    retry: false,
  });
  const enrollment = enrollmentData?.data?.enrollment;

  const isWishlisted = user?.studentProfile?.wishlist?.includes(course?._id);

  async function handleEnroll() {
    setError("");
    setEnrolling(true);
    try {
      await enrollmentService.enroll(course._id);
      const firstLessonId = course.modules?.[0]?.lessons?.[0]?._id;
      queryClient.invalidateQueries({ queryKey: ["enrollments", "me"] });
      if (firstLessonId) {
        navigate(`/learn/${course._id}/${firstLessonId}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["enrollment", course._id] });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't enroll. Try again.");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleWishlist() {
    await profileService.toggleWishlist(course._id).catch(() => {});
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }

  if (courseLoading) {
    return <Loader2 className="mx-auto mt-20 size-8 animate-spin text-muted-foreground" />;
  }

  if (!course) {
    return (
      <div className="glass mx-auto mt-10 max-w-lg rounded-lg p-10 text-center text-sm text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <span className="text-xs font-medium text-accent">{course.category}</span>
          <h1 className="mt-1 font-display text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-muted-foreground">{course.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {course.ratingAvg?.toFixed(1) || "New"} ({course.ratingCount} ratings)
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {formatDuration(course.durationSec)}
            </span>
            <span className="capitalize">{course.difficulty}</span>
            <span>by {course.instructor?.name}</span>
          </div>
        </div>

        {course.objectives?.length > 0 && (
          <GlassCard>
            <h2 className="font-display font-semibold">What you&apos;ll learn</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {course.objectives.map((obj) => (
                <li key={obj} className="text-sm text-muted-foreground">
                  • {obj}
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        <GlassCard>
          <h2 className="font-display font-semibold">Curriculum</h2>
          <div className="mt-3 space-y-4">
            {course.modules?.map((mod) => (
              <div key={mod._id || mod.title}>
                <p className="text-sm font-semibold">{mod.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {mod.lessons.map((lesson) => {
                    const unlocked = enrollment || lesson.isPreview;
                    const content = (
                      <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-glass">
                        <span className="flex items-center gap-2">
                          {unlocked ? (
                            <PlayCircle className="size-4 text-accent" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                          {lesson.title}
                        </span>
                        <span className="text-xs">{formatDuration(lesson.durationSec)}</span>
                      </div>
                    );
                    return (
                      <li key={lesson._id}>
                        {unlocked ? (
                          <Link to={`/learn/${course._id}/${lesson._id}`}>{content}</Link>
                        ) : (
                          content
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div>
        <GlassCard className="sticky top-24">
          <div aria-hidden className="mb-4 h-36 rounded-md gradient-signature opacity-80" />
          <p className="font-display text-3xl font-bold">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </p>

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}

          {enrollment ? (
            <Button asChild className="mt-4 w-full">
              <Link
                href={`/learn/${course._id}/${
                  course.modules?.[0]?.lessons?.[0]?._id || ""
                }`}
              >
                {enrollment.progressPercent > 0 ? "Continue learning" : "Start course"}
              </Link>
            </Button>
          ) : (
            <Button className="mt-4 w-full" onClick={handleEnroll} disabled={enrolling}>
              {enrolling && <Loader2 className="size-4 animate-spin" />}
              Enroll now
            </Button>
          )}

          <Button variant="outline" className="mt-2 w-full" onClick={handleWishlist}>
            <Heart className={isWishlisted ? "size-4 fill-danger text-danger" : "size-4"} />
            {isWishlisted ? "Wishlisted" : "Add to wishlist"}
          </Button>

          {course.requirements?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold">Requirements</p>
              <ul className="mt-2 space-y-1">
                {course.requirements.map((req) => (
                  <li key={req} className="text-xs text-muted-foreground">
                    • {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
