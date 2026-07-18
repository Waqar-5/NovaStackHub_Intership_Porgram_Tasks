import { trustedCompanies } from "@/lib/mock-data";

export function TrustedBySection() {
  // Duplicate the list so the CSS marquee can loop seamlessly at -50%.
  const looped = [...trustedCompanies, ...trustedCompanies];

  return (
    <section className="py-12">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Trusted by teams at
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee flex w-max items-center gap-16">
          {looped.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-lg font-semibold text-muted-foreground/50"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
