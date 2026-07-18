import { Star, Users } from "lucide-react";
import { popularCourses } from "@/lib/mock-data";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function PopularCoursesSection() {
  return (
    <section id="courses" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Popular courses</h2>
        <p className="mt-3 text-muted-foreground">
          A sample of what&apos;s in the library — browse the full catalog once you&apos;re
          in.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popularCourses.map((course, i) => (
          <Reveal key={course.id} delay={i * 0.08}>
            <GlassCard interactive className="flex h-full flex-col p-5">
             <img
  src={course.image}
  alt={course.title}
  className="mb-4 h-40 w-full rounded-lg object-cover"
/>
              <span className="text-xs font-medium text-accent">{course.category}</span>
              <h3 className="mt-1 font-display text-base font-semibold leading-snug">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">by {course.instructor}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-warning text-warning" />
                  {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {course.students.toLocaleString()}
                </span>
                <span>{course.difficulty}</span>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="font-display text-lg font-bold">${course.price}</span>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
