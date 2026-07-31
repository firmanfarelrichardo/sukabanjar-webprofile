'use client';

import { useState } from 'react';
import { Share2, MessageCircle, Facebook, Twitter, Link2, Check } from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
}

export default function SocialShareButtons({ title }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(`Baca Berita Desa Sukabanjar: "${title}"`);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}%20${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`,
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mr-1">
        <Share2 size={15} className="text-primary-600" />
        Bagikan:
      </span>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
      >
        <MessageCircle size={14} />
        <span>WhatsApp</span>
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
      >
        <Facebook size={14} />
        <span>Facebook</span>
      </a>

      {/* Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors shadow-sm"
      >
        <Twitter size={14} />
        <span>Twitter</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
      >
        {copied ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
        <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
      </button>
    </div>
  );
}
