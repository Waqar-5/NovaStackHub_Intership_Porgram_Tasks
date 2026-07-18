import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { pricingPlans } from "@/lib/mock-data";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Simple pricing</h2>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you&apos;re ready.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {pricingPlans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.1}>
            <GlassCard
              className={cn(
                "flex h-full flex-col",
                plan.highlighted && "border-primary/50 ring-1 ring-primary/30"
              )}
            >
              {plan.highlighted && (
                <span className="mb-2 inline-block w-fit rounded-full gradient-signature px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-4 font-display text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground"> / {plan.period}</span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
