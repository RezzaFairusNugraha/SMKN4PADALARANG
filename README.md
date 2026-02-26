# 🏫 SIAKAD — Sistem Informasi Akademik Sekolah

Aplikasi manajemen akademik sekolah berbasis **Full-Stack Modern** menggunakan **Next.js 15** (Frontend) dan **FastAPI** (Backend), dengan database **PostgreSQL via Supabase**.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Arsitektur Sistem](#arsitektur-sistem)
- [API Endpoints](#api-endpoints)
- [Setup & Instalasi](#setup--instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Peran Pengguna](#peran-pengguna)

---

## ✨ Fitur Utama

| Fitur | Admin | Guru | Siswa |
|---|:---:|:---:|:---:|
| Login Multi-Role (JWT) | ✅ | ✅ | ✅ |
| Manajemen Data Kelas | ✅ | — | — |
| Manajemen Data Guru | ✅ | — | — |
| Manajemen Data Siswa | ✅ | — | — |
| Manajemen Mata Pelajaran | ✅ | — | — |
| Atur Pengampu (Mapel Diampu) | ✅ | — | — |
| Input Nilai UTS & UAS | — | ✅ | — |
| Lihat Raport / Nilai | — | — | ✅ |
| Kelola Berita / Pengumuman | ✅ | ✅ | — |
| Lihat Berita Publik | ✅ | ✅ | ✅ |
| Dashboard Statistik | ✅ | ✅ | ✅ |
| Manajemen Absensi | — | ✅ | — |

---

## 🛠 Tech Stack

### Backend
| Teknologi | Keterangan |
|---|---|
| **FastAPI** | Python web framework untuk REST API |
| **SQLAlchemy** | ORM untuk interaksi database |
| **Alembic** | Database migration tool |
| **Pydantic v2** | Validasi data & serialisasi |
| **python-jose** | JWT authentication |
| **passlib (bcrypt)** | Password hashing |
| **Uvicorn** | ASGI server |
| **psycopg2-binary** | PostgreSQL driver |

### Frontend
| Teknologi | Keterangan |
|---|---|
| **Next.js 15** | React framework dengan App Router |
| **TypeScript** | Type-safe JavaScript |
| **Prisma 5** | ORM untuk PostgreSQL (server-side) |
| **Shadcn/UI + Radix UI** | Komponen UI yang accessible |
| **Tailwind CSS** | Utility-first CSS framework |
| **TanStack Query** | Data fetching & caching |
| **Axios** | HTTP client |
| **Recharts** | Grafik & visualisasi data |
| **React Hook Form + Zod** | Form handling & validasi |
| **Framer Motion** | Animasi UI |
| **Sonner** | Toast notifications |

### Database & Infrastruktur
| Teknologi | Keterangan |
|---|---|
| **PostgreSQL** | Relational database |
| **Supabase** | Managed PostgreSQL cloud (hosting DB) |
| **Docker Compose** | Untuk development database lokal |

---

## 📁 Struktur Project

```
NEXT+FASTAPI/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/                # Route handlers (controllers)
│   │   │   ├── auth.py         # Login, register, token refresh
│   │   │   ├── guru.py         # CRUD data guru
│   │   │   ├── siswa.py        # CRUD data siswa
│   │   │   ├── kelas.py        # CRUD data kelas
│   │   │   ├── mapel.py        # CRUD mata pelajaran & pengampu
│   │   │   ├── nilai.py        # Input & lihat nilai
│   │   │   ├── absensi.py      # Manajemen absensi
│   │   │   ├── berita.py       # CRUD berita/pengumuman
│   │   │   ├── dashboard.py    # Statistik per role
│   │   │   └── deps.py         # Dependency injection (get_current_user)
│   │   ├── core/               # Konfigurasi (settings)
│   │   ├── models/
│   │   │   └── models.py       # SQLAlchemy table models
│   │   ├── schemas/
│   │   │   └── master.py       # Pydantic request/response schemas
│   │   └── database.py         # SQLAlchemy engine & session
│   ├── uploads/                # File upload storage (gambar berita)
│   ├── seed.py                 # Script seeding data awal
│   ├── main.py                 # Entry point FastAPI app
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables backend
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/        # Route group: halaman Admin
│   │   │   ├── (guru)/         # Route group: halaman Guru
│   │   │   ├── (siswa)/        # Route group: halaman Siswa
│   │   │   ├── (auth)/         # Route group: login page
│   │   │   ├── berita/         # Halaman berita publik
│   │   │   ├── page.tsx        # Landing / Home page
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── globals.css     # Global styles
│   │   ├── components/         # Reusable UI components (Shadcn)
│   │   ├── hooks/
│   │   │   └── use-auth.ts     # Custom hook untuk auth state
│   │   └── lib/
│   │       ├── api-client.ts   # Axios instance dengan interceptor JWT
│   │       └── utils.ts        # Utility functions (cn, dll)
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema (mirroring SQLAlchemy models)
│   │   └── migrations/         # Prisma migration files
│   ├── public/                 # Static assets (logo, gambar)
│   ├── package.json
│   └── .env                    # Environment variables frontend
│
├── docker-compose.yml          # Local PostgreSQL via Docker
└── README.md
```

---

## 🏗 Arsitektur Sistem

```
[ Browser / Client ]
        │
        ▼
[ Next.js 15 — Frontend ]
  - App Router (RSC + Client Components)
  - Axios + TanStack Query (API calls)
  - JWT disimpan di localStorage / cookie
        │  HTTP Request + Bearer Token
        ▼
[ FastAPI — Backend REST API ]
  - JWT Middleware (deps.py)
  - Route Handlers (api/)
  - Pydantic Validation
  - SQLAlchemy ORM
        │  SQL Queries
        ▼
[ PostgreSQL — Supabase Cloud ]
  - 9 Tabel: guru, siswa, kelas, mata_pelajaran,
    mapel_diampu, nilai, absensi, berita, pengguna
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`  
Dokumentasi interaktif: `http://localhost:8000/docs`

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/login` | Login, mendapatkan access token |
| `GET` | `/api/auth/me` | Profil user yang sedang login |

### Kelas
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/kelas` | Daftar semua kelas |
| `POST` | `/api/kelas` | Tambah kelas baru |
| `PUT` | `/api/kelas/{id}` | Edit kelas |
| `DELETE` | `/api/kelas/{id}` | Hapus kelas |

### Guru
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/guru` | Daftar semua guru |
| `POST` | `/api/guru` | Tambah guru + akun pengguna |
| `PUT` | `/api/guru/{id}` | Edit data guru |
| `DELETE` | `/api/guru/{id}` | Hapus guru |

### Siswa
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/siswa` | Daftar semua siswa |
| `POST` | `/api/siswa` | Tambah siswa + akun pengguna |
| `PUT` | `/api/siswa/{id}` | Edit data siswa |
| `DELETE` | `/api/siswa/{id}` | Hapus siswa |

### Mata Pelajaran & Pengampu
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/mapel` | Daftar mata pelajaran |
| `POST` | `/api/mapel` | Tambah mata pelajaran |
| `GET` | `/api/mapel/diampu/list` | Daftar mapel yang diampu guru |
| `POST` | `/api/mapel/diampu` | Assign guru ke mapel & kelas |

### Nilai
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/nilai/siswa/{id}` | Nilai semua mapel seorang siswa |
| `POST` | `/api/nilai` | Input nilai UTS & UAS |
| `PUT` | `/api/nilai/{id}` | Update nilai |

### Berita
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/berita` | Daftar semua berita (publik) |
| `GET` | `/api/berita/{id}` | Detail berita |
| `POST` | `/api/berita` | Tambah berita (Guru/Admin) |
| `PUT` | `/api/berita/{id}` | Edit berita |
| `DELETE` | `/api/berita/{id}` | Hapus berita |

### Dashboard
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/dashboard/admin` | Statistik untuk Admin |
| `GET` | `/api/dashboard/guru` | Statistik untuk Guru |
| `GET` | `/api/dashboard/siswa` | Statistik untuk Siswa |

---

## 🚀 Setup & Instalasi

### Prasyarat
- Python 3.10+
- Node.js 18+
- PostgreSQL / Akun Supabase

### 1. Clone Repository

```bash
git clone <url-repo>
cd NEXT+FASTAPI
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Salin dan isi .env
cp .env.example .env
# Edit DATABASE_URL di .env

# Jalankan server
uvicorn main:app --reload
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Salin dan isi .env
# Edit DATABASE_URL dan DIRECT_URL di .env

# Generate Prisma client
npx prisma generate

# Jalankan development server
npm run dev
```

### 4. (Opsional) Database Lokal via Docker

```bash
# Di root project
docker-compose up -d
```

### 5. Seed Data Awal

```bash
cd backend
source venv/bin/activate
python seed.py
```

---

## ⚙️ Konfigurasi Environment

### `backend/.env`

```env
DATABASE_URL=postgresql://user:password@host:6543/postgres
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_MINUTES=10080
```

### `frontend/.env`

```env
# Transaction Pooler — untuk Prisma Client runtime
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"

# Direct Connection — untuk Prisma Migrate
DIRECT_URL="postgresql://postgres:password@db.<project-ref>.supabase.co:5432/postgres"
```

> **Supabase:** Connection strings bisa didapat di **Supabase Dashboard → Settings → Database → Connection String**.

---

## 👥 Peran Pengguna

### 🔴 Admin
- Mengelola seluruh data master: kelas, guru, siswa, mata pelajaran
- Mengatur pengampu (guru mana yang mengajar mapel apa di kelas mana)
- Mengelola dan mempublikasikan berita/pengumuman

### 🟡 Guru
- Melihat daftar siswa di kelas yang diampu
- Menginput dan mengedit nilai UTS & UAS siswa
- Mengelola absensi kelas
- Membuat dan mengedit berita/pengumuman

### 🟢 Siswa
- Melihat nilai dan raport digital
- Melihat riwayat absensi
- Membaca berita dan pengumuman sekolah

---

## 🗄️ Skema Database

```
pengguna (id_user, username, password, role, id_guru, id_siswa)
guru     (id_guru, nip, nama, jenis_kelamin, email, no_hp, id_kelas)
siswa    (id_siswa, nisn, nama, jenis_kelamin, alamat, no_hp, tanggal_lahir, id_kelas)
kelas    (id_kelas, jurusan, kelas)
mata_pelajaran (id_mapel, nama_mapel, kategori)
mapel_diampu   (id_ampu, id_guru, id_kelas, id_mapel)
nilai    (id_nilai, id_siswa, id_mapel, nilai_uts, nilai_uas, nilai_akhir)
absensi  (id_absensi, id_siswa, id_kelas, tanggal, status)
berita   (id_berita, id_guru, judul, isi, tanggal_post)
```

---

## 📝 Lisensi

Project ini dibuat sebagai bagian dari program **PKL (Praktek Kerja Lapangan)** di **SMKN 4 Padalarang**.
