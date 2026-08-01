'use client';

import { Store, MessageSquareText } from 'lucide-react';

interface UmkmCTAProps {
  onOpenRegisterModal?: () => void;
}

export default function UmkmCTA({ onOpenRegisterModal }: UmkmCTAProps) {
  return (
    <section className="pt-8 pb-16 bg-slate-50">
      <div className="container-section max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-primary-950 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Background Decorative Orb */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-400 text-xs font-semibold">
              <Store size={14} />
              <span>Untuk Pelaku Usaha Warga</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Punya Usaha di Desa Suka Banjar?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Daftarkan produk UMKM, makanan olahan, atau kerajinan Anda agar dapat dipromosikan secara gratis di katalog portal resmi desa ini.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-accent-500/20 cursor-pointer"
            >
              <MessageSquareText size={16} />
              Daftarkan Produk UMKM
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
