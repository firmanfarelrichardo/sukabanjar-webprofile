# Agent Output — Website Profil Desa Suka Banjar

Folder ini menyimpan seluruh output yang dihasilkan oleh AI Agent selama pengembangan project.

---

## Struktur Penyimpanan

```
04-agent-output/
├── backend/        ← Output terkait API, server logic, database
├── frontend/       ← Output terkait komponen UI, halaman, styling
├── database/       ← Output terkait schema, migrasi, seed data
├── devops/         ← Output terkait deployment, CI/CD, konfigurasi
├── documentation/  ← Output terkait dokumentasi project
└── research/       ← Output terkait riset teknologi, benchmark
```

---

## Format Penamaan File

```
<kategori>/YYYY/MM/DD/task-name.md
```

**Contoh:**
```
backend/2026/07/30/aspiration-api-endpoint.md
frontend/2026/07/30/landing-page-hero-component.md
database/2026/07/30/prisma-schema-migration.md
```

---

## Template Output AI Agent

```markdown
# Metadata

Tanggal: YYYY-MM-DD
Agent: [Backend Agent / Frontend Agent / dll.]
Task: [Nama Tugas]
Status: [Completed / In Progress / Failed]

---

# Objective

[Tujuan dari task yang dikerjakan]

---

# Analysis

[Analisis masalah atau kebutuhan]

---

# Solution

[Solusi yang diimplementasikan]

---

# Generated Artifacts

[Daftar file yang dihasilkan]

---

# Decisions

[Keputusan yang dibuat selama pengerjaan]

---

# Risks

[Risiko atau potensi masalah]

---

# Follow Up Tasks

[Task lanjutan yang perlu dikerjakan]
```

---

## Aturan Penting

1. Setiap AI Agent **wajib menyimpan output** ke folder ini.
2. Format file menggunakan **Markdown (.md)**.
3. Setiap output harus mengikuti **template** di atas.
4. File diorganisir berdasarkan **kategori** dan **tanggal**.
