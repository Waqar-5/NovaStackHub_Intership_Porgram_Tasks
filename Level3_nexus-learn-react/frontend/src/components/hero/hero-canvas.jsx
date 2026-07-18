import { lazy, Suspense } from "react";

const HeroScene = lazy(() =>
  import("./hero-scene").then((mod) => ({ default: mod.HeroScene }))
);

export function HeroCanvas() {
  return (
    <div className="h-[420px] w-full md:h-[520px]" aria-hidden>
      <Suspense fallback={<div className="size-full" />}>
        <HeroScene />
      </Suspense>
    </div>
  );
}
