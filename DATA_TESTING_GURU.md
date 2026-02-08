# Data Testing untuk Login Guru

Berikut adalah data testing yang bisa Anda gunakan untuk login sebagai Guru dan mencoba fitur-fitur yang sudah dibuat.

## 📋 Cara Menambahkan Data Testing

### Opsi 1: Menggunakan SQL Direct (Recommended)

Jalankan query SQL berikut di database PostgreSQL Anda:

```sql
-- 1. Pastikan ada kelas terlebih dahulu
INSERT INTO kelas (jurusan, kelas) 
VALUES ('Rekayasa Perangkat Lunak', 'XII RPL 1')
ON CONFLICT DO NOTHING;

-- 2. Tambahkan data Guru
INSERT INTO guru (nip, nama, jenis_kelamin, email, no_hp, id_kelas)
VALUES 
    ('123456789', 'Budi Santoso', 'Laki-laki', 'budi.guru@smkn4.sch.id', '081234567890', 
     (SELECT id_kelas FROM kelas LIMIT 1)),
    ('987654321', 'Siti Nurhaliza', 'Perempuan', 'siti.guru@smkn4.sch.id', '081234567891', 
     (SELECT id_kelas FROM kelas LIMIT 1))
ON CONFLICT (nip) DO NOTHING;

-- 3. Tambahkan akun pengguna untuk Guru
-- Password: "guru123" (sudah di-hash dengan bcrypt)
INSERT INTO pengguna (username, password_hash, role, id_guru)
VALUES 
    ('guru123', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ND2jdMgiwe', 'Guru',
     (SELECT id_guru FROM guru WHERE nip = '123456789')),
    ('gurusiti', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ND2jdMgiwe', 'Guru',
     (SELECT id_guru FROM guru WHERE nip = '987654321'))
ON CONFLICT (username) DO NOTHING;
```

### Opsi 2: Menggunakan Admin Dashboard

Jika Anda sudah memiliki akun Admin:

1. Login sebagai Admin
2. Pergi ke menu **Guru**
3. Klik **Tambah Guru**
4. Isi data berikut:
   - **NIP**: `123456789`
   - **Nama**: `Budi Santoso`
   - **Jenis Kelamin**: `Laki-laki`
   - **Email**: `budi.guru@smkn4.sch.id`
   - **No HP**: `081234567890`
   - **Kelas**: Pilih kelas yang tersedia
5. Klik **Simpan**

Kemudian buat akun pengguna untuk guru tersebut di menu **Pengguna**.

## 🔑 Data Login Testing

Setelah data berhasil ditambahkan, gunakan kredensial berikut untuk login:

### Guru 1
- **Username**: `guru123`
- **Password**: `guru123`
- **Nama**: Budi Santoso
- **NIP**: 123456789

### Guru 2
- **Username**: `gurusiti`
- **Password**: `guru123`
- **Nama**: Siti Nurhaliza
- **NIP**: 987654321

## ✅ Fitur yang Bisa Dicoba

Setelah login sebagai Guru, Anda bisa mencoba:

1. **Dashboard Guru**
   - Lihat statistik mengajar
   - Akses quick actions

2. **Input Nilai**
   - Pilih kelas dan mata pelajaran
   - Input nilai UTS dan UAS siswa
   - Lihat nilai akhir otomatis terhitung

3. **Kelola Berita**
   - Tambah berita/pengumuman baru
   - Edit berita yang sudah ada
   - Hapus berita
   - Lihat berita muncul di home page

4. **Isi Absensi** (Coming Soon)
   - Fitur ini masih dalam tahap pengembangan

## 🔧 Troubleshooting

### Jika Login Gagal

1. **Cek database**: Pastikan data guru dan pengguna sudah ada di database
2. **Cek password**: Password default adalah `guru123`
3. **Cek role**: Pastikan role di tabel `pengguna` adalah `"Guru"` (bukan "guru")

### Jika NIP Tidak Ditemukan

Kemungkinan data guru belum ada di database. Silakan tambahkan menggunakan salah satu opsi di atas.

## 📝 Catatan

- Password di-hash menggunakan bcrypt untuk keamanan
- Setiap guru harus memiliki akun di tabel `pengguna` untuk bisa login
- Guru harus terhubung dengan kelas untuk bisa mengajar
- Untuk menambahkan mata pelajaran yang diampu, gunakan tabel `mapel_diampu`
