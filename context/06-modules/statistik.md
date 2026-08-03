Berikut adalah prompt yang dapat langsung digunakan sebagai **Task AI Agent** untuk project `sukabanjar-webprofile`.

---

# TASK AI AGENT — IMPLEMENTASI SINKRONISASI DATA DEMOGRAFI SIPDESKEL KE WEBSITE PROFIL DESA SUKA BANJAR

## Latar Belakang

Website profil Desa Suka Banjar menggunakan:

* Next.js (App Router)
* TypeScript
* Prisma ORM
* PostgreSQL (Supabase)
* Supabase Storage

Website harus memiliki fitur sinkronisasi data demografi penduduk dari sistem SIPDeskel Desa Suka Banjar.

Sumber data SIPDeskel:

* Statistik Usia:

  * [https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-ages.aspx](https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-ages.aspx)
* Statistik Wilayah Administratif (Dusun):

  * [https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-wilayah-administratif.aspx](https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-wilayah-administratif.aspx)
* Statistik Pendidikan:

  * [https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pendidikanditempuh.aspx](https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pendidikanditempuh.aspx)
* Statistik Pekerjaan:

  * [https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pekerjaan.aspx](https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pekerjaan.aspx)

Dari hasil inspeksi HTML diketahui bahwa data statistik tersedia langsung pada tabel HTML (ASP.NET WebForms) sehingga dapat diambil dengan teknik parsing HTML menggunakan Cheerio tanpa perlu API khusus.

---

# TUJUAN

Membangun sistem sinkronisasi otomatis data demografi dari SIPDeskel ke database website profil desa.

Sistem harus mendukung:

1. Sinkronisasi otomatis.
2. Sinkronisasi manual oleh admin.
3. Penyimpanan hasil sinkronisasi ke database.
4. Log sinkronisasi.
5. Fallback edit manual jika sinkronisasi gagal.
6. Riwayat waktu sinkronisasi terakhir.

---

# DATA YANG WAJIB DIAMBIL

## 1. Statistik Usia

Sumber:

```text
https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-ages.aspx
```

Data yang harus diambil:

```text
Kelompok Umur
Jumlah
Laki-Laki
Perempuan
Persentase
```

Contoh:

```text
0-1 Tahun
2-4 Tahun
5-9 Tahun
...
75+ Tahun
```

---

## 2. Statistik Pendidikan

Sumber:

```text
https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pendidikanditempuh.aspx
```

Data yang harus diambil:

```text
Tingkat Pendidikan
Jumlah
Laki-Laki
Perempuan
Persentase
```

Contoh:

```text
Tidak Sekolah
SD
SMP
SMA
D3
S1
S2
S3
```

---

## 3. Statistik Pekerjaan

Sumber:

```text
https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pekerjaan.aspx
```

Data yang harus diambil:

```text
Jenis Pekerjaan
Jumlah
Laki-Laki
Perempuan
Persentase
```

Contoh:

```text
Petani
Wiraswasta
PNS
Pelajar
Ibu Rumah Tangga
Buruh
Nelayan
dll
```

---

## 4. Statistik Per Dusun

Sumber:

```text
https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-wilayah-administratif.aspx
```

Data yang harus diambil:

```text
Nama Dusun
Jumlah Penduduk
Laki-Laki
Perempuan
Jumlah KK
```

Jumlah dusun:

```text
5 Dusun
```

---

# ARSITEKTUR YANG HARUS DIBANGUN

```text
SIPDeskel
     ↓
HTML Scraper
     ↓
Parser (Cheerio)
     ↓
Validation
     ↓
Prisma
     ↓
PostgreSQL Supabase
     ↓
Website Publik
```

---

# DEPENDENSI

Install:

```bash
npm install cheerio
```

Opsional:

```bash
npm install node-cron
```

---

# DATABASE DESIGN

## SyncLog

Buat tabel:

```prisma
model SyncLog {
  id           String   @id @default(cuid())
  source       String
  status       String
  message      String?
  totalRecords Int?
  syncedAt     DateTime @default(now())
}
```

Status:

```text
SUCCESS
FAILED
PARTIAL
```

---

## DemografiUsia

```prisma
model DemografiUsia {
  id          String   @id @default(cuid())
  kategori    String
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime @updatedAt
}
```

---

## DemografiPendidikan

```prisma
model DemografiPendidikan {
  id          String   @id @default(cuid())
  kategori    String
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime @updatedAt
}
```

---

## DemografiPekerjaan

```prisma
model DemografiPekerjaan {
  id          String   @id @default(cuid())
  kategori    String
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  persentase  Float?
  syncedAt    DateTime?
  updatedAt   DateTime @updatedAt
}
```

---

## DemografiDusun

```prisma
model DemografiDusun {
  id          String   @id @default(cuid())
  namaDusun   String
  jumlah      Int
  lakiLaki    Int
  perempuan   Int
  jumlahKK    Int?
  syncedAt    DateTime?
  updatedAt   DateTime @updatedAt
}
```

---

# FITUR ADMIN

Buat menu:

```text
Dashboard
 └─ Sinkronisasi SIPDeskel

Data Demografi
 ├─ Usia
 ├─ Pendidikan
 ├─ Pekerjaan
 └─ Dusun

Log Sinkronisasi
```

---

# FITUR SINKRONISASI MANUAL

Buat tombol:

```text
[ Sinkronkan Sekarang ]
```

Ketika ditekan:

```text
1. Ambil HTML SIPDeskel
2. Parse tabel
3. Validasi data
4. Simpan ke database
5. Simpan log
6. Tampilkan notifikasi hasil
```

---

# FITUR SINKRONISASI OTOMATIS

Jalankan setiap:

```text
02:00 WIB
```

Menggunakan:

```text
Cron Job
```

atau

```text
Vercel Cron
```

---

# FITUR FALLBACK MANUAL

Jika sinkronisasi gagal:

```text
Website SIPDeskel tidak dapat diakses
atau
Struktur HTML berubah
atau
Timeout
```

Maka:

```text
Status = FAILED
```

dan admin tetap dapat:

```text
Tambah Data
Edit Data
Hapus Data
```

secara manual.

---

# DASHBOARD STATUS

Tampilkan:

```text
Status Sinkronisasi:
SUCCESS / FAILED

Sinkronisasi Terakhir:
Tanggal dan Jam

Jumlah Record:
xxx data

Sumber:
SIPDeskel
```

---

# PERSYARATAN KODE

* Gunakan TypeScript.
* Gunakan App Router Next.js.
* Gunakan Prisma ORM.
* Gunakan Supabase PostgreSQL.
* Gunakan service layer terpisah.
* Jangan hardcode data statistik.
* Gunakan reusable parser.
* Tambahkan error handling dan logging.
* Tambahkan validasi sebelum menyimpan ke database.
* Semua operasi database harus menggunakan Prisma.
* Dokumentasikan seluruh flow dan struktur folder yang dibuat.

Referensi sumber data berasal dari halaman statistik SIPDeskel Desa Suka Banjar yang menampilkan data demografi dalam tabel HTML yang dapat diparsing secara langsung. ([sidomulyo-lampungselatan.desa.id][1])

[1]: https://www.sidomulyo-lampungselatan.desa.id/data-statistik/kategori-umur?utm_source=chatgpt.com "Data Kategori Umur - Desa Sidomulyo"
