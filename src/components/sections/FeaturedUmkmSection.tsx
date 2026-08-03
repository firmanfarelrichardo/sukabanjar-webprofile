import Link from 'next/link';
import { ShoppingBag, ArrowRight, MessageCircle, User } from 'lucide-react';

interface UmkmItem {
  id: string;
  title: string;
  ownerName: string;
  description: string;
  price: string;
  whatsapp: string;
  imageUrl?: string | null;
}

interface FeaturedUmkmProps {
  products: UmkmItem[];
}

export default function FeaturedUmkmSection({ products }: FeaturedUmkmProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#f8fafc] border-b border-slate-200/80">
      <div className="container-section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#0086C9]/10 text-[#0086C9] border border-[#0086C9]/20 inline-block">
              Potensi Ekonomi Lokal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Produk UMKM Unggulan
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Dukung perekonomian warga Desa Suka Banjar dengan membeli produk olahan pertanian dan kerajinan lokal secara langsung.
            </p>
          </div>

          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0086C9] hover:text-[#006ca3] transition-colors shrink-0 group cursor-pointer"
          >
            Lihat Semua Produk
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => {
            const waNumber = item.whatsapp.replace(/[^0-9]/g, '');
            const waFormatted = waNumber.startsWith('0')
              ? '62' + waNumber.slice(1)
              : waNumber;
            const waMessage = encodeURIComponent(
              `Halo kak, saya tertarik dengan produk UMKM "${item.title}" di Portal Desa Suka Banjar.`
            );
            const waUrl = `https://wa.me/${waFormatted}?text=${waMessage}`;

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-[#0086C9]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div>
                  {/* Product Image / Placeholder */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#001929] to-[#0086C9] flex items-center justify-center text-white/30">
                        <ShoppingBag size={44} />
                      </div>
                    )}

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-black bg-amber-400 text-slate-950 shadow-md">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <User size={13} className="text-[#0086C9]" />
                      <span>Pemilik: {item.ownerName}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0086C9] transition-colors line-clamp-1 font-heading">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="p-5 sm:p-6 pt-0">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-700 text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    Hubungi Penjual (WhatsApp)
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
