import { Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Success stories</h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.1}>
            <GlassCard className="flex h-full flex-col">
              <Quote className="size-6 text-primary/50" />
              <p className="mt-3 flex-1 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
