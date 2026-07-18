import { Star } from "lucide-react";
import { featuredTeachers } from "@/lib/mock-data";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";

export function TeacherShowcaseSection() {
  return (
    <section id="teachers" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Learn from people who ship</h2>
        <p className="mt-3 text-muted-foreground">
          Every teacher on Nexus Learn works in the field they teach.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {featuredTeachers.map((teacher, i) => (
          <Reveal key={teacher.id} delay={i * 0.1}>
            <GlassCard interactive className="text-center">
              {/* <div
                aria-hidden
                className="mx-auto mb-4 size-16 rounded-full gradient-signature"
              /> */}
              <div className="flex justify-center">
  <img
    src={teacher.image}
    alt={teacher.name}
    className="h-20 w-20 rounded-full object-cover border-2 border-primary"
  />
</div>
              <h3 className="font-display font-semibold">{teacher.name}</h3>
              <p className="text-xs text-muted-foreground">{teacher.role}</p>
              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-warning text-warning" />
                  {teacher.rating}
                </span>
                <span>{teacher.students.toLocaleString()} students</span>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
