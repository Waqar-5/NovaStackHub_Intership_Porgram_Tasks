import { motion } from "framer-motion";

/**
 * Fade + rise on first scroll into view, once — per the design system's
 * motion budget (ARCHITECTURE.md §2.3): landing sections reveal once each,
 * no re-triggering on scroll-back.
 */
export function Reveal({ children, delay = 0, className, y = 24 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
