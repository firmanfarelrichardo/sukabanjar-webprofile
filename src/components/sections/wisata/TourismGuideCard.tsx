import { ShieldCheck, Trash2, Heart, Trees } from 'lucide-react';

export default function TourismGuideCard() {
  const guidelines = [
    {
      icon: Trash2,
      title: 'Jaga Kebersihan Lingkungan',
      desc: 'Buang sampah pada tempatnya dan hindari meninggalkan sampah plastik di area persawahan maupun sungai.',
    },
    {
      icon: Heart,
      title: 'Hormati Warga Lokal',
      desc: 'Bertegur sapa dengan ramah dan menghormati norma kebudayaan serta ketentraman warga desa setempat.',
    },
    {
      icon: Trees,
      title: 'Rawat Kelestarian Alam',
      desc: 'Tidak merusak tanaman warga, pepohonan, serta sarana fasilitas publik di kawasan wisata.',
    },
  ];

  return (
    <section className="pt-4 pb-16 bg-slate-50">
      <div className="container-section max-w-4xl mx-auto">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-lg">
                Himbauan & Etika Pengunjung
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Panduan untuk menjaga keasrian dan keindahan alam Desa Sukabanjar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guidelines.map((g, idx) => {
              const Icon = g.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <Icon size={16} className="text-primary-600" />
                    <span>{g.title}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
