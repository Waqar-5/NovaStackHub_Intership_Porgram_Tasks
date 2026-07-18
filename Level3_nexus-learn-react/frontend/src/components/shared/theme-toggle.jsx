import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const CYCLE = ["light", "dark", "system"];
const ICON = { light: Sun, dark: Moon, system: Monitor };

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch without setState-in-effect: subscribe to
  // nothing, report "false" on the server snapshot and "true" on the
  // client snapshot, so React knows it's safe to render the real icon
  // only once mounted in the browser.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="size-10" aria-hidden />;
  }

  const current = theme ?? "system";
  const Icon = ICON[current] ?? Monitor;

  function cycleTheme() {
    const nextTheme = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    setTheme(nextTheme);
  }

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${current}. Click to change.`}
      title={`Theme: ${current}`}
    >
      <Icon className="size-4" />
    </Button>
  );
}
