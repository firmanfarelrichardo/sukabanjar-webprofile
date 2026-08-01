# Decisions — Website Profil Desa Suka Banjar

Catatan keputusan penting yang mempengaruhi arsitektur, desain, atau implementasi project.

---

## D001

**Tanggal:** 2026-07-30

**Keputusan:** Menggunakan Zero-Cost Infrastructure (Vercel + Supabase + OpenStreetMap)

**Alasan:** Target biaya operasional Rp 0/bulan sesuai konteks KKN. Seluruh layanan memiliki Free Tier dengan kapasitas memadai untuk skala data desa.

**Dampak:** Terbatas pada kuota Free Tier (500MB database, 1GB storage). Jika desa berkembang pesat, mungkin perlu upgrade di masa depan.

---

## D002

**Tanggal:** 2026-07-30

**Keputusan:** Menggunakan Leaflet.js + OpenStreetMap sebagai pengganti Google Maps

**Alasan:** Menghindari risiko tagihan API Key Google Maps. OpenStreetMap sepenuhnya open-source dan gratis tanpa batas penggunaan.

**Dampak:** Kualitas tile peta mungkin sedikit berbeda dari Google Maps, namun fungsionalitas memadai untuk kebutuhan desa.

---

## D003

**Tanggal:** 2026-07-30

**Keputusan:** Menyederhanakan modul E-Aspirasi menjadi model pengiriman pesan langsung (tanpa tiket/status/nomor telepon)

**Alasan:** Menyesuaikan kebutuhan riil desa yang lebih membutuhkan saluran pesan sederhana dibanding sistem ticketing kompleks. Mengurangi kompleksitas development dan kemudahan penggunaan warga.

**Dampak:**
- Warga tidak bisa melacak status aspirasi yang dikirim.
- Admin tidak perlu membalas/mengubah status tiket — cukup membaca dan mengelola Inbox.
- Skema database lebih ringkas (menghapus field `ticketCode`, `phoneNumber`, `status`, `response`; menambah `isRead`).

---

## D004

**Tanggal:** 2026-07-30

**Keputusan:** Menggunakan React Bits untuk komponen UI modern

**Alasan:** Memperkaya visual website dengan mikro-interaksi modern (Text Pressure, Tilted Card, Spotlight Card, Count Up, Aurora BG) agar tampilan profesional dan menarik.

**Dampak:** Menambah dependency tambahan, namun meningkatkan kualitas UX secara signifikan.

---

## D005

**Tanggal:** 2026-07-30

**Keputusan:** Seluruh konten website dikelola secara Full Dynamic CMS

**Alasan:** Memastikan Perangkat Desa dapat mengelola konten secara mandiri pasca-penarikan KKN tanpa perlu bantuan developer.

**Dampak:** Semua teks, gambar, dan data disimpan di database dan diambil secara dinamis. Tidak ada hardcode konten di kode sumber.
