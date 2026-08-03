import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Globe } from 'lucide-react';

export function TikTokIcon({ size = 18, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.93 1.63V7.23a4.85 4.85 0 0 1-1-.54z" />
    </svg>
  );
}

export function getSocialPlatformIcon(platform: string) {
  if (!platform) return Globe;
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return Facebook;
  if (p.includes('instagram')) return Instagram;
  if (p.includes('tiktok')) return TikTokIcon;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('twitter') || p.includes('x')) return Twitter;
  return Globe;
}
