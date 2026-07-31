import { HelpCircle, ShieldCheck, Mail, EyeOff } from 'lucide-react';

const FAQS = [
  {
    question: 'Apakah laporan saya benar-benar bisa dikirim secara Anonim?',
    answer:
      'Ya. Jika Anda mencentang opsi "Sembunyikan Nama (Anonim)", sistem tidak akan menyimpan nama lengkap Anda. Identitas pelapor akan ditampilkan sebagai "Anonim" di Inbox Admin Desa.',
    icon: EyeOff,
  },
  {
    question: 'Kategori pengaduan apa saja yang bisa disampaikan?',
    answer:
      'Warga dapat menyampaikan perbaikan fasilitas publik (jalan, irigasi, penerangan), kebersihan lingkungan, keamanan wilayah, masukan/saran pembangunan, hingga kendala pelayanan administratif desa.',
    icon: HelpCircle,
  },
  {
    question: 'Siapa yang membaca dan menindaklanjuti pesan aspirasi ini?',
    answer:
      'Pesan yang dikirimkan akan langsung masuk ke Dashboard Moderasi Admin Balai Desa Sukabanjar dan ditinjau langsung oleh Kepala Desa beserta perangkat terkait.',
    icon: ShieldCheck,
  },
  {
    question: 'Apakah saya perlu mendaftar / login akun terlebih dahulu?',
    answer:
      'Tidak perlu. Layanan E-Aspirasi ini dirancang agar mudah dan inklusif digunakan oleh seluruh warga tanpa hambatan pendaftaran akun.',
    icon: Mail,
  },
];

export default function AspirationFAQ() {
  return (
    <section className="section-padding bg-slate-50 border-t border-slate-200/70">
      <div className="container-section max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Pusat Bantuan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Tanya Jawab Layanan Pengaduan
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Informasi penting mengenai kerahasiaan data dan alur penyampaian aspirasi warga.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed pl-12">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
