'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

interface AnnouncementTickerProps {
  announcements: Announcement[];
}

export default function AnnouncementTicker({ announcements }: AnnouncementTickerProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-slate-950/90 border-b border-white/10 text-white text-xs sm:text-sm py-2 overflow-hidden backdrop-blur-md">
      <div className="container-section flex items-center">
        {/* Ticker marquee container (Smooth continuous ticker) */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {announcements.concat(announcements).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 mx-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-slate-200 font-semibold tracking-wide text-xs sm:text-sm">
                  {item.title}
                </span>
                {item.slug && item.slug !== '#' && (
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-0.5 text-amber-400 hover:underline font-bold text-xs ml-1"
                  >
                    Baca <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
