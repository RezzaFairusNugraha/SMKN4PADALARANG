-- CreateEnum
CREATE TYPE "jk_guru_enum" AS ENUM ('Laki-laki', 'Perempuan');

-- CreateEnum
CREATE TYPE "jk_siswa_enum" AS ENUM ('Laki-laki', 'Perempuan');

-- CreateEnum
CREATE TYPE "kategori_mapel_enum" AS ENUM ('Umum', 'Produktif');

-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('Admin', 'Guru', 'Siswa');

-- CreateEnum
CREATE TYPE "status_absensi_enum" AS ENUM ('Hadir', 'Izin', 'Sakit', 'Alpa');

-- CreateTable
CREATE TABLE "kelas" (
    "id_kelas" SERIAL NOT NULL,
    "jurusan" VARCHAR(100) NOT NULL,
    "kelas" VARCHAR(50) NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id_kelas")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id_siswa" SERIAL NOT NULL,
    "id_kelas" INTEGER,
    "nisn" VARCHAR(20),
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kelamin" "jk_siswa_enum",
    "alamat" TEXT,
    "no_hp" VARCHAR(15),
    "tanggal_lahir" DATE,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id_siswa")
);

-- CreateTable
CREATE TABLE "guru" (
    "id_guru" SERIAL NOT NULL,
    "nip" VARCHAR(30),
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kelamin" "jk_guru_enum" NOT NULL,
    "email" VARCHAR(100),
    "no_hp" VARCHAR(15),
    "id_kelas" INTEGER,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id_guru")
);

-- CreateTable
CREATE TABLE "mata_pelajaran" (
    "id_mapel" SERIAL NOT NULL,
    "nama_mapel" VARCHAR(100) NOT NULL,
    "kategori" "kategori_mapel_enum",

    CONSTRAINT "mata_pelajaran_pkey" PRIMARY KEY ("id_mapel")
);

-- CreateTable
CREATE TABLE "mapel_diampu" (
    "id_ampu" SERIAL NOT NULL,
    "id_guru" INTEGER,
    "id_kelas" INTEGER,
    "id_mapel" INTEGER,

    CONSTRAINT "mapel_diampu_pkey" PRIMARY KEY ("id_ampu")
);

-- CreateTable
CREATE TABLE "nilai" (
    "id_nilai" SERIAL NOT NULL,
    "id_siswa" INTEGER,
    "id_mapel" INTEGER,
    "nilai_uts" INTEGER,
    "nilai_uas" INTEGER,
    "nilai_akhir" INTEGER,

    CONSTRAINT "nilai_pkey" PRIMARY KEY ("id_nilai")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id_absensi" SERIAL NOT NULL,
    "id_siswa" INTEGER,
    "id_kelas" INTEGER,
    "tanggal" DATE,
    "status" "status_absensi_enum",

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id_absensi")
);

-- CreateTable
CREATE TABLE "berita" (
    "id_berita" SERIAL NOT NULL,
    "id_guru" INTEGER,
    "judul" VARCHAR(150),
    "isi" TEXT,
    "tanggal_post" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berita_pkey" PRIMARY KEY ("id_berita")
);

-- CreateTable
CREATE TABLE "pengguna" (
    "id_user" SERIAL NOT NULL,
    "id_guru" INTEGER,
    "id_siswa" INTEGER,
    "username" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "role" "role_enum" NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE INDEX "ix_kelas_id_kelas" ON "kelas"("id_kelas");

-- CreateIndex
CREATE UNIQUE INDEX "ix_siswa_nisn" ON "siswa"("nisn");

-- CreateIndex
CREATE INDEX "ix_siswa_id_siswa" ON "siswa"("id_siswa");

-- CreateIndex
CREATE UNIQUE INDEX "ix_guru_nip" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "ix_guru_email" ON "guru"("email");

-- CreateIndex
CREATE INDEX "ix_guru_id_guru" ON "guru"("id_guru");

-- CreateIndex
CREATE INDEX "ix_mata_pelajaran_id_mapel" ON "mata_pelajaran"("id_mapel");

-- CreateIndex
CREATE INDEX "ix_mapel_diampu_id_ampu" ON "mapel_diampu"("id_ampu");

-- CreateIndex
CREATE INDEX "ix_nilai_id_nilai" ON "nilai"("id_nilai");

-- CreateIndex
CREATE INDEX "ix_absensi_id_absensi" ON "absensi"("id_absensi");

-- CreateIndex
CREATE INDEX "ix_berita_id_berita" ON "berita"("id_berita");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_id_guru_key" ON "pengguna"("id_guru");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_id_siswa_key" ON "pengguna"("id_siswa");

-- CreateIndex
CREATE UNIQUE INDEX "ix_pengguna_username" ON "pengguna"("username");

-- CreateIndex
CREATE INDEX "ix_pengguna_id_user" ON "pengguna"("id_user");

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mapel_diampu" ADD CONSTRAINT "mapel_diampu_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mapel_diampu" ADD CONSTRAINT "mapel_diampu_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mapel_diampu" ADD CONSTRAINT "mapel_diampu_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "mata_pelajaran"("id_mapel") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_id_mapel_fkey" FOREIGN KEY ("id_mapel") REFERENCES "mata_pelajaran"("id_mapel") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "kelas"("id_kelas") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "berita" ADD CONSTRAINT "berita_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "guru"("id_guru") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "siswa"("id_siswa") ON DELETE NO ACTION ON UPDATE NO ACTION;
