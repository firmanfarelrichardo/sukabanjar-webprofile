'use client';

import { useEffect } from 'react';
import { useVillageProfile } from '@/context/VillageProfileContext';

export default function DynamicFavicon() {
  const { profile } = useVillageProfile();

  useEffect(() => {
    if (!profile.logoUrl) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = profile.logoUrl;
  }, [profile.logoUrl]);

  return null;
}
