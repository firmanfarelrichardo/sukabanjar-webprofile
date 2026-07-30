# Changelog — Website Profil Desa Sukabanjar

---

## 2026-07-30 14:50

### Added
- Inisialisasi dokumen PRD v2.0 (Product Requirement Document)
- Struktur Knowledge Base project lengkap (01-project, 02-development, 03-management, 04-agent-output, 05-prompts)
- Dokumentasi overview, architecture, database, features, tech-stack
- Dokumentasi conventions, API, testing, deployment
- Backlog task, progress tracker, decisions log

### Changed
- Memperbarui modul E-Aspirasi & Pengaduan Warga dari sistem ticketing menjadi model pengiriman pesan langsung (seperti email)
- Menghapus fitur Generator Tiket Laporan (`ASP-2026-xxx`)
- Menghapus fitur Cek Status Aspirasi
- Menghapus input Nomor WhatsApp/Telepon pada form aspirasi
- Menyederhanakan model Prisma `Aspiration` (menghapus field: `ticketCode`, `phoneNumber`, `status`, `response`; menambah: `isRead`)
- Mengubah modul admin dari tracking/balasan tiket menjadi Inbox Pesan Aspirasi

### Fixed
- *(Belum ada)*

### Removed
- Field `ticketCode` pada model Aspiration
- Field `phoneNumber` pada model Aspiration
- Field `status` pada model Aspiration
- Field `response` pada model Aspiration
- Istilah "Kode Tiket / Resi" dari glosarium PRD
