import { cn } from "@/lib/utils";

/**
 * Base glass surface used everywhere: dashboard KPI cards, feature callouts,
 * the pricing card, etc. Resting state stays quiet (no gradient border);
 * pass `interactive` to enable the hover gradient-border per the design
 * system's restraint principle (ARCHITECTURE.md §2.3).
 */
export function GlassCard({ className, interactive = false, children, ...props }) {
  return (
    <div
      className={cn(
        "glass rounded-lg p-6",
        interactive && "gradient-border transition-transform hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
