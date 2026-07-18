import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings safely, resolving conflicting utility
 * classes (e.g. "p-2 p-4" -> "p-4") the way shadcn/ui components expect.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
