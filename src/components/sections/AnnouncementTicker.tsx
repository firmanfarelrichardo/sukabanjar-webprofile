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
    <div className="bg-[#0086C9] border-b border-sky-400/30 text-white text-xs sm:text-sm py-2 overflow-hidden shadow-sm">
      <div className="container-section flex items-center">
        {/* Ticker marquee container (Smooth continuous ticker) */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {announcements.concat(announcements).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 mx-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                <span className="text-white font-bold tracking-wide text-xs sm:text-sm">
                  {item.title}
                </span>
                {item.slug && item.slug !== '#' && (
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-0.5 text-amber-300 hover:text-white font-extrabold text-xs ml-1 underline underline-offset-2"
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
