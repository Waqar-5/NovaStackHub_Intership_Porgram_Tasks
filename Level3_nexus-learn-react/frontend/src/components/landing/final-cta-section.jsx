import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { GlassCard } from "@/components/shared/glass-card";

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <Reveal>
        <GlassCard className="relative overflow-hidden text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-25 blur-3xl gradient-signature"
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to start?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Join thousands of students already learning on Nexus Learn — the first
              three courses are free.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/register">
                Create your free account <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
