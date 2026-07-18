
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts up from 0 to `target` once the element scrolls into view.
 * Plain rAF loop — no extra dependency needed for something this small.
 */
export function useCountUp(target, { duration = 1400 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, value };
}
