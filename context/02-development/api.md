# API Documentation — Website Profil Desa Sukabanjar

## Base URL

```
Production : https://<domain-desa>.vercel.app/api
Development: http://localhost:3000/api
```

## Response Format (Standar)

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

```json
{
  "success": false,
  "data": null,
  "error": "Pesan error"
}
```

---

## Endpoints

### 1. Village Profile

#### `GET /api/village-profile`
Mengambil data identitas & profil desa.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Sukabanjar",
    "subdistrict": "Sidomulyo",
    "district": "Lampung Selatan",
    "province": "Lampung",
    "logoUrl": "https://...",
    "heroImageUrl": "https://...",
    "history": "Teks sejarah desa...",
    "vision": "Teks visi desa...",
    "missions": ["Misi 1", "Misi 2"],
    "phone": "08xxxx",
    "email": "desa@email.com",
    "address": "Alamat kantor desa",
    "updatedAt": "2026-07-30T00:00:00Z"
  }
}
```

#### `PUT /api/village-profile`
Memperbarui data profil desa. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "name": "Sukabanjar",
  "vision": "Visi baru...",
  "missions": ["Misi 1", "Misi 2", "Misi 3"],
  "history": "Sejarah diperbarui...",
  "phone": "08xxxx",
  "email": "desa@email.com"
}
```

---

### 2. Aspirations (E-Aspirasi & Pengaduan)

#### `POST /api/aspirations`
Mengirim pesan aspirasi/pengaduan baru. **[Public]**

**Request Body:**
```json
{
  "senderName": "Ahmad Maulana",
  "isAnonymous": false,
  "category": "Fasilitas Publik",
  "title": "Jalan Dusun 3 Rusak",
  "content": "Jalan di Dusun 3 RT 02 sudah berlubang dan membahayakan...",
  "attachment": "https://storage.supabase.co/..."
}
```

**Catatan:** Jika `isAnonymous: true`, maka `senderName` akan disimpan sebagai `"Anonim"` di server.

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Pesan aspirasi berhasil terkirim ke Balai Desa"
  }
}
```

#### `GET /api/aspirations`
Mengambil daftar semua aspirasi. **[Auth Required: Admin]**

**Query Parameters:**
| Parameter | Type | Deskripsi |
|---|---|---|
| `category` | string | Filter berdasarkan kategori |
| `isRead` | boolean | Filter berdasarkan status dibaca |
| `search` | string | Pencarian kata kunci pada judul/konten |
| `page` | number | Halaman pagination |
| `limit` | number | Jumlah data per halaman |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "aspirations": [
      {
        "id": "uuid",
        "senderName": "Anonim",
        "isAnonymous": true,
        "category": "Kebersihan/Lingkungan",
        "title": "Sampah di Sungai",
        "content": "Banyak sampah menumpuk di sungai dekat pasar...",
        "attachment": "https://...",
        "isRead": false,
        "createdAt": "2026-07-30T10:00:00Z",
        "updatedAt": "2026-07-30T10:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

#### `PATCH /api/aspirations/:id`
Memperbarui status baca aspirasi. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "isRead": true
}
```

#### `DELETE /api/aspirations/:id`
Menghapus pesan aspirasi. **[Auth Required: Admin]**

---

### 3. Articles (Berita & Artikel)

#### `GET /api/articles`
Mengambil daftar artikel. **[Public — hanya published; Admin — semua]**

**Query Parameters:**
| Parameter | Type | Deskripsi |
|---|---|---|
| `category` | string | Filter kategori |
| `search` | string | Pencarian judul/konten |
| `isDraft` | boolean | Filter draft (admin only) |
| `page` | number | Halaman pagination |
| `limit` | number | Jumlah data per halaman |

#### `GET /api/articles/:slug`
Mengambil detail artikel berdasarkan slug. **[Public]**

#### `POST /api/articles`
Membuat artikel baru. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "title": "Judul Berita",
  "content": "Isi konten...",
  "category": "Kegiatan",
  "imageUrl": "https://...",
  "isDraft": false
}
```

#### `PUT /api/articles/:id`
Memperbarui artikel. **[Auth Required: Admin]**

#### `DELETE /api/articles/:id`
Menghapus artikel. **[Auth Required: Admin]**

---

### 4. UMKM

#### `GET /api/umkm`
Mengambil daftar UMKM. **[Public]**

#### `POST /api/umkm`
Menambah data UMKM baru. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "title": "Keripik Pisang Bu Siti",
  "ownerName": "Siti Aisyah",
  "description": "Keripik pisang renyah khas Sukabanjar...",
  "price": "Rp 15.000",
  "whatsapp": "6281234567890",
  "imageUrl": "https://..."
}
```

#### `PUT /api/umkm/:id`
Memperbarui data UMKM. **[Auth Required: Admin]**

#### `DELETE /api/umkm/:id`
Menghapus data UMKM. **[Auth Required: Admin]**

---

### 5. Tourism (Wisata)

#### `GET /api/tourism`
Mengambil daftar wisata. **[Public]**

#### `POST /api/tourism`
Menambah destinasi wisata baru. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "title": "Bukit Panorama Sukabanjar",
  "description": "Pemandangan sawah terasering...",
  "location": "Dusun 2, RT 03",
  "imageUrl": "https://..."
}
```

#### `PUT /api/tourism/:id`
Memperbarui data wisata. **[Auth Required: Admin]**

#### `DELETE /api/tourism/:id`
Menghapus data wisata. **[Auth Required: Admin]**

---

### 6. Facilities (Peta Fasilitas)

#### `GET /api/facilities`
Mengambil daftar fasilitas pada peta. **[Public]**

#### `POST /api/facilities`
Menambah titik fasilitas baru. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "name": "SDN 1 Sukabanjar",
  "category": "Pendidikan",
  "latitude": -5.7891,
  "longitude": 105.6543,
  "address": "Jl. Pendidikan No. 1",
  "imageUrl": "https://..."
}
```

#### `PUT /api/facilities/:id`
Memperbarui data fasilitas. **[Auth Required: Admin]**

#### `DELETE /api/facilities/:id`
Menghapus titik fasilitas. **[Auth Required: Admin]**

---

### 7. Apparatus (Perangkat Desa)

#### `GET /api/apparatus`
Mengambil daftar perangkat desa (urut berdasarkan `orderNum`). **[Public]**

#### `POST /api/apparatus`
Menambah perangkat desa baru. **[Auth Required: Admin]**

**Request Body:**
```json
{
  "name": "Budi Santoso",
  "role": "Kepala Desa",
  "imageUrl": "https://...",
  "orderNum": 1
}
```

#### `PUT /api/apparatus/:id`
Memperbarui data perangkat. **[Auth Required: Admin]**

#### `DELETE /api/apparatus/:id`
Menghapus perangkat desa. **[Auth Required: Admin]**

---

### 8. Auth (Autentikasi Admin)

#### `POST /api/auth/login`
Login admin ke Panel CMS.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

#### `POST /api/auth/logout`
Logout admin.

---

## Error Codes

| HTTP Status | Kode | Deskripsi |
|---|---|---|
| 400 | `BAD_REQUEST` | Input tidak valid / field wajib kosong |
| 401 | `UNAUTHORIZED` | Token tidak valid atau tidak ada |
| 403 | `FORBIDDEN` | Akses ditolak (bukan admin) |
| 404 | `NOT_FOUND` | Resource tidak ditemukan |
| 409 | `CONFLICT` | Data duplikat (slug artikel, username) |
| 413 | `PAYLOAD_TOO_LARGE` | File upload melebihi batas ukuran |
| 429 | `TOO_MANY_REQUESTS` | Rate limit tercapai |
| 500 | `INTERNAL_SERVER_ERROR` | Kesalahan server internal |
