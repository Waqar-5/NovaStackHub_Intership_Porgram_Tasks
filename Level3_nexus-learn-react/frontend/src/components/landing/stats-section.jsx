import { stats } from "@/lib/mock-data";
import { useCountUp } from "@/hooks/useCountUp";
import { Reveal } from "@/components/shared/reveal";

function StatItem({ stat, index }) {
  const { ref, value } = useCountUp(stat.value);
  return (
    <Reveal delay={index * 0.08}>
      <div ref={ref} className="text-center">
        <p className="font-display text-3xl font-bold md:text-4xl">
          {value.toLocaleString()}
          <span className="text-gradient-signature">{stat.suffix}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
      </div>
    </Reveal>
  );
}

export function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="glass grid grid-cols-2 gap-8 rounded-lg p-8 md:grid-cols-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
