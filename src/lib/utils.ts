import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility untuk menggabungkan class names secara aman.
 * Menggabungkan clsx (conditional classes) dengan tailwind-merge (resolusi konflik Tailwind).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
