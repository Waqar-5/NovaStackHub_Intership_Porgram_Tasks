import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "@/components/hero/hero-canvas";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl gradient-signature"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 pt-16 pb-8 md:grid-cols-2 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Now enrolling — 850+ courses across 40 categories
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Learn like it&apos;s{" "}
            <span className="text-gradient-signature">your career</span> depends on it —
            because it does.
          </h1>
          <p className="max-w-md text-muted-foreground">
            Real courses, real teachers, real feedback. Track your progress, get graded
            work back, and walk away with a certificate that means something.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Start learning free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href="#courses">Browse courses</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroCanvas />
        </motion.div>
      </div>
    </section>
  );
}
