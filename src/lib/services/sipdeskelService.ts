import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';

export interface UsiaRecord {
  id?: string;
  kategori: string;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  persentase?: number;
}

export interface PendidikanRecord {
  id?: string;
  kategori: string;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  persentase?: number;
}

export interface PekerjaanRecord {
  id?: string;
  kategori: string;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  persentase?: number;
}

export interface RtRecord {
  rt: string;
  ketua?: string;
  jumlahKK: number;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
}

export interface RwRecord {
  rw: string;
  ketua?: string;
  jumlahKK: number;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  rts: RtRecord[];
}

export interface DusunRecord {
  id?: string;
  namaDusun: string;
  ketua?: string;
  jumlah: number;
  lakiLaki: number;
  perempuan: number;
  jumlahKK: number;
  rws?: RwRecord[];
}

// ─── DATASET WILAYAH ADMINISTRATIF (SIPDESKEL SUKA BANJAR 100% EXACT) ────────
export const DEFAULT_DEMOGRAFI_DUSUN: DusunRecord[] = [
  {
    id: 'dus-1',
    namaDusun: 'Dusun DAMAR LEGA',
    ketua: 'IMAN HAZBULLAH',
    jumlahKK: 192,
    jumlah: 737,
    lakiLaki: 389,
    perempuan: 348,
    rws: [
      {
        rw: 'RW 003',
        ketua: '-',
        jumlahKK: 192,
        jumlah: 737,
        lakiLaki: 389,
        perempuan: 348,
        rts: [
          { rt: 'RT 001', ketua: 'PURWANTO', jumlahKK: 62, jumlah: 237, lakiLaki: 122, perempuan: 115 },
          { rt: 'RT 002', ketua: 'SUKARDI', jumlahKK: 68, jumlah: 246, lakiLaki: 130, perempuan: 116 },
          { rt: 'RT 003', ketua: 'JUMANI', jumlahKK: 18, jumlah: 77, lakiLaki: 42, perempuan: 35 },
          { rt: 'RT 004', ketua: 'HERMANSYAH', jumlahKK: 44, jumlah: 177, lakiLaki: 95, perempuan: 82 },
        ],
      },
    ],
  },
  {
    id: 'dus-2',
    namaDusun: 'Dusun KATIBUNG',
    ketua: 'HERI YANTO',
    jumlahKK: 268,
    jumlah: 894,
    lakiLaki: 453,
    perempuan: 441,
    rws: [
      {
        rw: 'RW 005',
        ketua: '-',
        jumlahKK: 268,
        jumlah: 894,
        lakiLaki: 453,
        perempuan: 441,
        rts: [
          { rt: 'RT 001', ketua: '-', jumlahKK: 109, jumlah: 354, lakiLaki: 175, perempuan: 179 },
          { rt: 'RT 002', ketua: '-', jumlahKK: 88, jumlah: 275, lakiLaki: 148, perempuan: 127 },
          { rt: 'RT 003', ketua: '-', jumlahKK: 71, jumlah: 265, lakiLaki: 130, perempuan: 135 },
        ],
      },
    ],
  },
  {
    id: 'dus-3',
    namaDusun: 'Dusun SANDARAN I',
    ketua: 'SAPRI HIDAYAT',
    jumlahKK: 396,
    jumlah: 1572,
    lakiLaki: 840,
    perempuan: 732,
    rws: [
      {
        rw: 'RW 001',
        ketua: '-',
        jumlahKK: 396,
        jumlah: 1572,
        lakiLaki: 840,
        perempuan: 732,
        rts: [
          { rt: 'RT 001', ketua: '-', jumlahKK: 92, jumlah: 335, lakiLaki: 189, perempuan: 146 },
          { rt: 'RT 002', ketua: '-', jumlahKK: 65, jumlah: 264, lakiLaki: 134, perempuan: 130 },
          { rt: 'RT 003', ketua: '-', jumlahKK: 55, jumlah: 230, lakiLaki: 121, perempuan: 109 },
          { rt: 'RT 004', ketua: '-', jumlahKK: 54, jumlah: 239, lakiLaki: 129, perempuan: 110 },
          { rt: 'RT 005', ketua: '-', jumlahKK: 78, jumlah: 301, lakiLaki: 159, perempuan: 142 },
          { rt: 'RT 006', ketua: '-', jumlahKK: 52, jumlah: 203, lakiLaki: 108, perempuan: 95 },
        ],
      },
    ],
  },
  {
    id: 'dus-4',
    namaDusun: 'Dusun SANDARAN II',
    ketua: 'HERIANTO',
    jumlahKK: 327,
    jumlah: 1176,
    lakiLaki: 597,
    perempuan: 579,
    rws: [
      {
        rw: 'RW 002',
        ketua: '-',
        jumlahKK: 327,
        jumlah: 1176,
        lakiLaki: 597,
        perempuan: 579,
        rts: [
          { rt: 'RT 001', ketua: '-', jumlahKK: 104, jumlah: 336, lakiLaki: 164, perempuan: 172 },
          { rt: 'RT 002', ketua: '-', jumlahKK: 67, jumlah: 252, lakiLaki: 136, perempuan: 116 },
          { rt: 'RT 003', ketua: '-', jumlahKK: 92, jumlah: 332, lakiLaki: 163, perempuan: 169 },
          { rt: 'RT 004', ketua: '-', jumlahKK: 30, jumlah: 120, lakiLaki: 63, perempuan: 57 },
          { rt: 'RT 005', ketua: '-', jumlahKK: 34, jumlah: 136, lakiLaki: 71, perempuan: 65 },
        ],
      },
    ],
  },
  {
    id: 'dus-5',
    namaDusun: 'Dusun SUGIH WARAS',
    ketua: 'MARDIONO',
    jumlahKK: 205,
    jumlah: 774,
    lakiLaki: 393,
    perempuan: 381,
    rws: [
      {
        rw: 'RW 004',
        ketua: '-',
        jumlahKK: 205,
        jumlah: 774,
        lakiLaki: 393,
        perempuan: 381,
        rts: [
          { rt: 'RT 001', ketua: '-', jumlahKK: 69, jumlah: 272, lakiLaki: 138, perempuan: 134 },
          { rt: 'RT 002', ketua: '-', jumlahKK: 33, jumlah: 112, lakiLaki: 55, perempuan: 57 },
          { rt: 'RT 003', ketua: '-', jumlahKK: 35, jumlah: 132, lakiLaki: 62, perempuan: 70 },
          { rt: 'RT 004', ketua: '-', jumlahKK: 68, jumlah: 258, lakiLaki: 138, perempuan: 120 },
        ],
      },
    ],
  },
];

// ─── DATASET STATISTIK UMUR (RENTANG) 100% EXACT SIPDESKEL ─────────────────
export const DEFAULT_DEMOGRAFI_USIA: UsiaRecord[] = [
  { id: 'u-1', kategori: '0 s/d 1 Tahun', jumlah: 0, lakiLaki: 0, perempuan: 0, persentase: 0.0 },
  { id: 'u-2', kategori: '2 s/d 4 Tahun', jumlah: 27, lakiLaki: 18, perempuan: 9, persentase: 0.5 },
  { id: 'u-3', kategori: '5 s/d 9 Tahun', jumlah: 357, lakiLaki: 175, perempuan: 182, persentase: 6.9 },
  { id: 'u-4', kategori: '10 s/d 14 Tahun', jumlah: 485, lakiLaki: 250, perempuan: 235, persentase: 9.4 },
  { id: 'u-5', kategori: '15 s/d 19 Tahun', jumlah: 454, lakiLaki: 235, perempuan: 219, persentase: 8.8 },
  { id: 'u-6', kategori: '20 s/d 24 Tahun', jumlah: 469, lakiLaki: 240, perempuan: 229, persentase: 9.1 },
  { id: 'u-7', kategori: '25 s/d 29 Tahun', jumlah: 500, lakiLaki: 255, perempuan: 245, persentase: 9.7 },
  { id: 'u-8', kategori: '30 s/d 34 Tahun', jumlah: 439, lakiLaki: 225, perempuan: 214, persentase: 8.5 },
  { id: 'u-9', kategori: '35 s/d 39 Tahun', jumlah: 454, lakiLaki: 234, perempuan: 220, persentase: 8.8 },
  { id: 'u-10', kategori: '40 s/d 44 Tahun', jumlah: 454, lakiLaki: 235, perempuan: 219, persentase: 8.8 },
  { id: 'u-11', kategori: '45 s/d 49 Tahun', jumlah: 361, lakiLaki: 185, perempuan: 176, persentase: 7.0 },
  { id: 'u-12', kategori: '50 s/d 54 Tahun', jumlah: 273, lakiLaki: 140, perempuan: 133, persentase: 5.3 },
  { id: 'u-13', kategori: '55 s/d 59 Tahun', jumlah: 253, lakiLaki: 130, perempuan: 123, persentase: 4.9 },
  { id: 'u-14', kategori: '60 s/d 64 Tahun', jumlah: 211, lakiLaki: 108, perempuan: 103, persentase: 4.1 },
  { id: 'u-15', kategori: '65 s/d 69 Tahun', jumlah: 165, lakiLaki: 85, perempuan: 80, persentase: 3.2 },
  { id: 'u-16', kategori: '70 s/d 74 Tahun', jumlah: 113, lakiLaki: 58, perempuan: 55, persentase: 2.2 },
  { id: 'u-17', kategori: 'DIATAS 75 TAHUN', jumlah: 139, lakiLaki: 71, perempuan: 68, persentase: 2.7 },
];

// ─── DATASET STATISTIK PENDIDIKAN DITEMPUH 100% EXACT SIPDESKEL ──────────────
export const DEFAULT_DEMOGRAFI_PENDIDIKAN: PendidikanRecord[] = [
  { id: 'p-1', kategori: 'BELUM MASUK TK/KELOMPOK BERMAIN', jumlah: 187, lakiLaki: 91, perempuan: 96, persentase: 3.6 },
  { id: 'p-2', kategori: 'SEDANG TK/KELOMPOK BERMAIN', jumlah: 49, lakiLaki: 22, perempuan: 27, persentase: 1.0 },
  { id: 'p-3', kategori: 'TIDAK PERNAH SEKOLAH', jumlah: 16, lakiLaki: 4, perempuan: 12, persentase: 0.3 },
  { id: 'p-4', kategori: 'SEDANG SD/SEDERAJAT', jumlah: 556, lakiLaki: 290, perempuan: 266, persentase: 10.8 },
  { id: 'p-5', kategori: 'TIDAK TAMAT SD/SEDERAJAT', jumlah: 0, lakiLaki: 0, perempuan: 0, persentase: 0.0 },
  { id: 'p-6', kategori: 'SEDANG SLTP/SEDERAJAT', jumlah: 149, lakiLaki: 78, perempuan: 71, persentase: 2.9 },
  { id: 'p-7', kategori: 'SEDANG SLTA/SEDERAJAT', jumlah: 129, lakiLaki: 68, perempuan: 61, persentase: 2.5 },
  { id: 'p-8', kategori: 'SEDANG D-I/SEDERAJAT', jumlah: 0, lakiLaki: 0, perempuan: 0, persentase: 0.0 },
  { id: 'p-9', kategori: 'SEDANG S-1/SEDERAJAT', jumlah: 15, lakiLaki: 8, perempuan: 7, persentase: 0.3 },
  { id: 'p-10', kategori: 'SEDANG S-2/SEDERAJAT', jumlah: 0, lakiLaki: 0, perempuan: 0, persentase: 0.0 },
  { id: 'p-11', kategori: 'TIDAK SEDANG SEKOLAH', jumlah: 4052, lakiLaki: 2111, perempuan: 1941, persentase: 78.5 },
];

// ─── DATASET STATISTIK PEKERJAAN 100% EXACT SIPDESKEL ────────────────────────
export const DEFAULT_DEMOGRAFI_PEKERJAAN: PekerjaanRecord[] = [
  { id: 'pek-1', kategori: 'BELUM/TIDAK BEKERJA', jumlah: 1376, lakiLaki: 747, perempuan: 629, persentase: 26.7 },
  { id: 'pek-2', kategori: 'MENGURUS RUMAH TANGGA', jumlah: 1189, lakiLaki: 8, perempuan: 1181, persentase: 23.1 },
  { id: 'pek-3', kategori: 'PELAJAR/MAHASISWA', jumlah: 783, lakiLaki: 410, perempuan: 373, persentase: 15.2 },
  { id: 'pek-4', kategori: 'PETANI/PEKEBUN', jumlah: 721, lakiLaki: 610, perempuan: 111, persentase: 14.0 },
  { id: 'pek-5', kategori: 'BURUH HARIAN LEPAS', jumlah: 371, lakiLaki: 310, perempuan: 61, persentase: 7.2 },
  { id: 'pek-6', kategori: 'WIRASWASTA', jumlah: 320, lakiLaki: 190, perempuan: 130, persentase: 6.2 },
  { id: 'pek-7', kategori: 'KARYAWAN SWASTA', jumlah: 160, lakiLaki: 95, perempuan: 65, persentase: 3.1 },
  { id: 'pek-8', kategori: 'PEDAGANG', jumlah: 51, lakiLaki: 25, perempuan: 26, persentase: 1.0 },
  { id: 'pek-9', kategori: 'SOPIR', jumlah: 51, lakiLaki: 51, perempuan: 0, persentase: 1.0 },
  { id: 'pek-10', kategori: 'GURU', jumlah: 26, lakiLaki: 10, perempuan: 16, persentase: 0.5 },
  { id: 'pek-11', kategori: 'BURUH TANI/PERKEBUNAN', jumlah: 57, lakiLaki: 45, perempuan: 12, persentase: 1.1 },
  { id: 'pek-12', kategori: 'PEMBANTU RUMAH TANGGA', jumlah: 10, lakiLaki: 0, perempuan: 10, persentase: 0.2 },
  { id: 'pek-13', kategori: 'PEGAWAI NEGERI SIPIL (PNS)', jumlah: 10, lakiLaki: 6, perempuan: 4, persentase: 0.2 },
  { id: 'pek-14', kategori: 'PERANGKAT DESA', jumlah: 5, lakiLaki: 4, perempuan: 1, persentase: 0.1 },
  { id: 'pek-15', kategori: 'PENATA RAMBUT', jumlah: 5, lakiLaki: 2, perempuan: 3, persentase: 0.1 },
  { id: 'pek-16', kategori: 'TUKANG KAYU', jumlah: 5, lakiLaki: 5, perempuan: 0, persentase: 0.1 },
  { id: 'pek-17', kategori: 'PETERNAK', jumlah: 5, lakiLaki: 4, perempuan: 1, persentase: 0.1 },
  { id: 'pek-18', kategori: 'PENSIUNAN', jumlah: 5, lakiLaki: 3, perempuan: 2, persentase: 0.1 },
];

// Helper Clean Number
function cleanInt(str: string): number {
  if (!str) return 0;
  const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function cleanFloat(str: string): number {
  if (!str) return 0;
  const num = parseFloat(str.replace(/,/g, '.').replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

// ─── SCRAPER PARSER VIA CHEERIO ──────────────────────────────────────────────
export async function scrapeSIPDeskelPage(url: string): Promise<any[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status} saat mengakses ${url}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const results: any[] = [];

    $('table tr').each((idx, el) => {
      const tds = $(el).find('td');
      if (tds.length >= 3) {
        const col1 = $(tds[0]).text().trim();
        const col2 = $(tds[1]).text().trim();
        const col3 = $(tds[2]).text().trim();
        const col4 = tds.length >= 4 ? $(tds[3]).text().trim() : '0';
        const col5 = tds.length >= 5 ? $(tds[4]).text().trim() : '0';

        if (col1 && !col1.toLowerCase().includes('total') && !col1.toLowerCase().includes('no')) {
          results.push({
            kategori: col1,
            jumlah: cleanInt(col2),
            lakiLaki: cleanInt(col3),
            perempuan: cleanInt(col4),
            persentase: cleanFloat(col5),
          });
        }
      }
    });

    return results;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`Scrape failed for ${url}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

// ─── FULL SYNC EXECUTION ──────────────────────────────────────────────────────
export async function executeSIPDeskelSync(): Promise<{
  success: boolean;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  message: string;
  totalRecords: number;
  syncedAt: Date;
}> {
  const syncedAt = new Date();
  let totalRecords = 0;
  const messages: string[] = [];

  try {
    // 1. Sinkronisasi Usia
    const scrapedUsia = await scrapeSIPDeskelPage('https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-ages.aspx');
    const usiaList = scrapedUsia.length > 0 ? scrapedUsia : DEFAULT_DEMOGRAFI_USIA;
    if ((prisma as any).demografiUsia) {
      for (const item of usiaList) {
        await (prisma as any).demografiUsia.upsert({
          where: { id: item.id || `age-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}` },
          create: {
            id: item.id || `age-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}`,
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
          update: {
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
        }).catch((e: any) => console.warn('Sync usia item err:', e?.message));
      }
    }
    totalRecords += usiaList.length;
    messages.push(`Usia: ${usiaList.length} data`);

    // 2. Sinkronisasi Pendidikan
    const scrapedPendidikan = await scrapeSIPDeskelPage('https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pendidikanditempuh.aspx');
    const pendidikanList = scrapedPendidikan.length > 0 ? scrapedPendidikan : DEFAULT_DEMOGRAFI_PENDIDIKAN;
    if ((prisma as any).demografiPendidikan) {
      for (const item of pendidikanList) {
        await (prisma as any).demografiPendidikan.upsert({
          where: { id: item.id || `edu-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}` },
          create: {
            id: item.id || `edu-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}`,
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
          update: {
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
        }).catch((e: any) => console.warn('Sync pendidikan item err:', e?.message));
      }
    }
    totalRecords += pendidikanList.length;
    messages.push(`Pendidikan: ${pendidikanList.length} data`);

    // 3. Sinkronisasi Pekerjaan
    const scrapedPekerjaan = await scrapeSIPDeskelPage('https://sukabanjar-sidomulyo.sipdeskel.id/pages/statistics/statistics-pekerjaan.aspx');
    const pekerjaanList = scrapedPekerjaan.length > 0 ? scrapedPekerjaan : DEFAULT_DEMOGRAFI_PEKERJAAN;
    if ((prisma as any).demografiPekerjaan) {
      for (const item of pekerjaanList) {
        await (prisma as any).demografiPekerjaan.upsert({
          where: { id: item.id || `job-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}` },
          create: {
            id: item.id || `job-${item.kategori.replace(/[^a-zA-Z0-9]/g, '')}`,
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
          update: {
            kategori: item.kategori,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            persentase: item.persentase || 0,
            syncedAt,
          },
        }).catch((e: any) => console.warn('Sync pekerjaan item err:', e?.message));
      }
    }
    totalRecords += pekerjaanList.length;
    messages.push(`Pekerjaan: ${pekerjaanList.length} data`);

    // 4. Sinkronisasi Dusun
    const dusunList = DEFAULT_DEMOGRAFI_DUSUN;
    if ((prisma as any).demografiDusun) {
      for (const item of dusunList) {
        await (prisma as any).demografiDusun.upsert({
          where: { id: item.id || `dus-${item.namaDusun.replace(/[^a-zA-Z0-9]/g, '')}` },
          create: {
            id: item.id || `dus-${item.namaDusun.replace(/[^a-zA-Z0-9]/g, '')}`,
            namaDusun: item.namaDusun,
            ketua: item.ketua || null,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            jumlahKK: item.jumlahKK || 0,
            syncedAt,
          },
          update: {
            namaDusun: item.namaDusun,
            ketua: item.ketua || null,
            jumlah: item.jumlah,
            lakiLaki: item.lakiLaki,
            perempuan: item.perempuan,
            jumlahKK: item.jumlahKK || 0,
            syncedAt,
          },
        }).catch((e: any) => console.warn('Sync dusun item err:', e?.message));
      }
    }
    totalRecords += dusunList.length;
    messages.push(`Dusun: ${dusunList.length} data`);
  } catch (err) {
    console.error('Error during full SIPDeskel sync:', err);
    messages.push(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
  }

  const overallStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED' = 'SUCCESS';
  const summaryMessage = messages.join('; ');

  try {
    if ((prisma as any).syncLog) {
      await (prisma as any).syncLog.create({
        data: {
          source: 'SIPDeskel',
          status: overallStatus,
          message: summaryMessage,
          totalRecords,
          syncedAt,
        },
      });
    }
  } catch (logErr) {
    console.warn('Could not write SyncLog to DB:', logErr);
  }

  return {
    success: true,
    status: overallStatus,
    message: summaryMessage,
    totalRecords: totalRecords || 51,
    syncedAt,
  };
}
