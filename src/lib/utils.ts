import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional classes using clsx and safely merges Tailwind CSS rules.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
