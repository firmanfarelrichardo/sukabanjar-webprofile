# Testing — Website Profil Desa Suka Banjar

## Strategi Testing

Menggunakan pendekatan bertahap untuk memastikan kualitas kode dan fungsionalitas sistem.

---

## Unit Test

### Tools
- **Jest** — Test runner & assertion
- **React Testing Library** — Testing komponen React

### Area Cakupan

| Area | Test Case |
|---|---|
| Utility Functions | `generateSlug()`, `formatDate()`, `validateInput()` |
| Form Validation | Validasi nama, kategori, isi pesan aspirasi |
| API Input Validation | Validasi request body setiap endpoint |
| Prisma Query | Mock Prisma client untuk test CRUD operations |

### Contoh Test

```typescript
// __tests__/utils/generateSlug.test.ts
describe("generateSlug", () => {
  it("should convert title to URL-safe slug", () => {
    expect(generateSlug("Berita Desa Terbaru")).toBe("berita-desa-terbaru");
  });

  it("should handle special characters", () => {
    expect(generateSlug("Aspirasi & Pengaduan")).toBe("aspirasi-pengaduan");
  });
});
```

---

## Integration Test

### Area Cakupan

| Area | Test Case |
|---|---|
| API Routes | Test GET/POST/PUT/DELETE setiap endpoint dengan database test |
| Auth Flow | Login → mendapatkan token → akses endpoint admin |
| Aspiration Flow | Submit aspirasi → data tersimpan → muncul di inbox admin |
| File Upload | Upload foto → URL tersimpan di database |

### Contoh Test

```typescript
// __tests__/api/aspirations.test.ts
describe("POST /api/aspirations", () => {
  it("should create aspiration with valid data", async () => {
    const response = await fetch("/api/aspirations", {
      method: "POST",
      body: JSON.stringify({
        senderName: "Test User",
        isAnonymous: false,
        category: "Saran/Masukan",
        title: "Test Aspirasi",
        content: "Isi pesan test",
      }),
    });
    expect(response.status).toBe(201);
  });

  it("should save as Anonim when isAnonymous is true", async () => {
    const response = await fetch("/api/aspirations", {
      method: "POST",
      body: JSON.stringify({
        senderName: "Nama Asli",
        isAnonymous: true,
        category: "Keamanan",
        title: "Test Anonim",
        content: "Isi pesan anonim",
      }),
    });
    const data = await response.json();
    expect(data.data.senderName).toBe("Anonim");
  });

  it("should reject empty required fields", async () => {
    const response = await fetch("/api/aspirations", {
      method: "POST",
      body: JSON.stringify({
        senderName: "",
        category: "",
        title: "",
        content: "",
      }),
    });
    expect(response.status).toBe(400);
  });
});
```

---

## UAT (User Acceptance Testing)

### Skenario UAT

#### 1. Warga: Mengirim Aspirasi

| Step | Aksi | Expected Result |
|---|---|---|
| 1 | Buka halaman Aspirasi | Form aspirasi tampil lengkap |
| 2 | Isi nama pelapor | Nama terisi |
| 3 | Centang "Anonim" | Nama pelapor tersembunyi |
| 4 | Pilih kategori | Dropdown kategori berfungsi |
| 5 | Isi judul & pesan | Textarea berfungsi |
| 6 | Upload foto bukti | Preview foto tampil |
| 7 | Klik "Kirim" | Notifikasi konfirmasi muncul |

#### 2. Admin: Membaca Inbox Aspirasi

| Step | Aksi | Expected Result |
|---|---|---|
| 1 | Login ke panel admin | Dashboard tampil |
| 2 | Buka menu Inbox Aspirasi | Daftar pesan tampil |
| 3 | Klik pesan belum dibaca | Detail pesan tampil, status berubah ke "dibaca" |
| 4 | Filter berdasarkan kategori | List terfilter sesuai kategori |
| 5 | Hapus pesan | Pesan terhapus dari daftar |

#### 3. Admin: Kelola Berita

| Step | Aksi | Expected Result |
|---|---|---|
| 1 | Buka menu Berita | Listing berita tampil |
| 2 | Klik "Tambah Berita" | Form editor tampil |
| 3 | Isi judul, konten, foto | Data terisi |
| 4 | Klik "Publish" | Berita tampil di halaman publik |
| 5 | Edit berita | Data berubah di publik |
| 6 | Hapus berita | Berita hilang dari listing |

---

## Performance Testing

### Target (Google Lighthouse)

| Metrik | Target Skor |
|---|---|
| Performance | > 90 |
| Accessibility | > 90 |
| SEO | > 90 |
| Best Practices | > 90 |

### Checklist

- [ ] Semua gambar menggunakan format WebP/AVIF + lazy loading
- [ ] CSS dan JS ter-minify
- [ ] Font di-preload
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
