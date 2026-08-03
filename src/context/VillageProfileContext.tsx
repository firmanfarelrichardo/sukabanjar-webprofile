'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatSocialUrl, parseJsonArray } from '@/lib/utils';

export interface SocialMediaItem {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter' | string;
  label: string;
  url: string;
}

export interface VillageProfileData {
  name: string;
  subdistrict: string;
  district: string;
  province: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  socialMedia: SocialMediaItem[];
}

interface VillageProfileContextType {
  profile: VillageProfileData;
  isLoading: boolean;
  updateProfile: (updatedData: Partial<VillageProfileData>) => void;
  refreshProfile: () => Promise<void>;
}

export { formatSocialUrl, parseJsonArray };

export const DEFAULT_5_SOCIAL_MEDIA: SocialMediaItem[] = [
  { id: 'sm-facebook', platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/desasukabanjar' },
  { id: 'sm-instagram', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/desa.sukabanjar' },
  { id: 'sm-tiktok', platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@desasukabanjar' },
  { id: 'sm-youtube', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@desasukabanjar' },
  { id: 'sm-twitter', platform: 'twitter', label: 'X / Twitter', url: 'https://x.com/desasukabanjar' },
];

const DEFAULT_PROFILE_DATA: VillageProfileData = {
  name: 'Desa Suka Banjar',
  subdistrict: 'Sidomulyo',
  district: 'Lampung Selatan',
  province: 'Lampung',
  logoUrl: '/images/logo-desa.png',
  phone: '081234567890',
  email: 'desa.sukabanjar@gmail.com',
  address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
  socialMedia: DEFAULT_5_SOCIAL_MEDIA,
};

const LOCAL_STORAGE_KEY = 'sukabanjar_village_profile_v5';

const VillageProfileContext = createContext<VillageProfileContextType>({
  profile: DEFAULT_PROFILE_DATA,
  isLoading: true,
  updateProfile: () => {},
  refreshProfile: async () => {},
});

export function VillageProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VillageProfileData>(DEFAULT_PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Ensures the 5 default platforms always exist, with custom formatted URLs preserved
  const mergeWithDefault5 = (inputItems: any): SocialMediaItem[] => {
    const itemsArray = parseJsonArray(inputItems);

    return DEFAULT_5_SOCIAL_MEDIA.map((def) => {
      const match = itemsArray.find(
        (item) =>
          item &&
          (item.platform?.toLowerCase() === def.platform.toLowerCase() || item.id === def.id)
      );
      const rawUrl = match && match.url !== undefined && match.url !== null ? match.url : def.url;
      return {
        ...def,
        url: formatSocialUrl(rawUrl),
        label: match?.label || def.label,
      };
    });
  };

  const loadLocalProfile = (): VillageProfileData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          parsed.socialMedia = mergeWithDefault5(parsed.socialMedia);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading local profile:', err);
    }
    return null;
  };

  const saveLocalProfile = (data: VillageProfileData) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Error saving local profile:', err);
    }
  };

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      const localData = loadLocalProfile();

      const res = await fetch('/api/profile');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          const serverSocialMedia = mergeWithDefault5(data.socialMedia);

          const mergedProfile: VillageProfileData = {
            name: data.name || localData?.name || DEFAULT_PROFILE_DATA.name,
            subdistrict: data.subdistrict || localData?.subdistrict || DEFAULT_PROFILE_DATA.subdistrict,
            district: data.district || localData?.district || DEFAULT_PROFILE_DATA.district,
            province: data.province || localData?.province || DEFAULT_PROFILE_DATA.province,
            logoUrl: data.logoUrl || localData?.logoUrl || DEFAULT_PROFILE_DATA.logoUrl,
            phone: data.phone || localData?.phone || DEFAULT_PROFILE_DATA.phone,
            email: data.email || localData?.email || DEFAULT_PROFILE_DATA.email,
            address: data.address || localData?.address || DEFAULT_PROFILE_DATA.address,
            socialMedia: serverSocialMedia,
          };

          setProfile(mergedProfile);
          saveLocalProfile(mergedProfile);
          return;
        }
      }

      if (localData) {
        setProfile(localData);
      }
    } catch (err) {
      console.error('Error loading village profile context:', err);
      const localData = loadLocalProfile();
      if (localData) setProfile(localData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const updateProfile = (updatedData: Partial<VillageProfileData>) => {
    setProfile((prev) => {
      const newSocialMedia = updatedData.socialMedia
        ? mergeWithDefault5(updatedData.socialMedia)
        : prev.socialMedia;

      const newProfile = {
        ...prev,
        ...updatedData,
        socialMedia: newSocialMedia,
      };
      saveLocalProfile(newProfile);
      return newProfile;
    });
  };

  return (
    <VillageProfileContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </VillageProfileContext.Provider>
  );
}

export function useVillageProfile() {
  return useContext(VillageProfileContext);
}
