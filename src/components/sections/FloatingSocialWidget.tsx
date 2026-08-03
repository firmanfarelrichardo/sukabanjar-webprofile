'use client';

import { useVillageProfile, SocialMediaItem } from '@/context/VillageProfileContext';
import { formatSocialUrl } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { getSocialPlatformIcon } from '@/components/ui/SocialIcons';

export default function FloatingSocialWidget() {
  const pathname = usePathname();
  const { profile } = useVillageProfile();

  // Hide in admin dashboard
  if (pathname?.startsWith('/admin')) return null;

  const socialItems = (profile.socialMedia || []).filter(
    (item: SocialMediaItem) => item.url && item.url.trim() !== ''
  );

  if (socialItems.length === 0) return null;

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3.5 pointer-events-auto">
      {socialItems.map((item: SocialMediaItem) => {
        const IconComponent = getSocialPlatformIcon(item.platform);
        const finalUrl = formatSocialUrl(item.url);
        return (
          <a
            key={item.id || item.platform}
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label || item.platform}
            className="group relative w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white/80 hover:text-white flex items-center justify-center border border-white/15 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-115 hover:border-amber-400/50 hover:shadow-amber-500/20"
          >
            <IconComponent size={18} className="group-hover:text-amber-400 transition-colors" />

            {/* Tooltip Label */}
            <span className="absolute right-12 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg border border-white/10 font-heading">
              {item.label || item.platform}
            </span>
          </a>
        );
      })}
    </div>
  );
}
