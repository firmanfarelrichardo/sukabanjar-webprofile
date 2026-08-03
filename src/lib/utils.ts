import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility untuk menggabungkan class names secara aman.
 * Menggabungkan clsx (conditional classes) dengan tailwind-merge (resolusi konflik Tailwind).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a social media URL string to guarantee a valid https:// protocol.
 */
export const formatSocialUrl = (url: string | null | undefined): string => {
  if (!url || !url.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

/**
 * Robustly parses single or multi-stringified JSON data into an Array.
 */
export const parseJsonArray = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  let current = raw;
  let attempts = 0;
  while (typeof current === 'string' && attempts < 3) {
    try {
      current = JSON.parse(current);
    } catch (e) {
      break;
    }
    attempts++;
  }
  return Array.isArray(current) ? current : [];
};
