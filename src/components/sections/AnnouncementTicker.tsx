'use client';

import Link from 'next/link';
import { Megaphone, ArrowRight } from 'lucide-react';

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
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs sm:text-sm py-2.5 overflow-hidden">
      <div className="container-section flex items-center gap-3">
        {/* Label Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-500/20 text-accent-400 border border-accent-500/30 font-semibold text-xs">
          <Megaphone size={14} className="animate-pulse" />
          <span>PENGUMUMAN</span>
        </div>

        {/* Ticker marquee container */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {announcements.concat(announcements).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 mx-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                <span className="text-slate-300 font-medium">{item.title}</span>
                {item.slug && item.slug !== '#' && (
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-0.5 text-primary-400 hover:underline font-medium text-xs ml-1"
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
