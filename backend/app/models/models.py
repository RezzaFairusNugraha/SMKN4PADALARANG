from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Enum, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class Kelas(Base):
    __tablename__ = "kelas"
    id_kelas = Column(Integer, primary_key=True, index=True)
    jurusan = Column(String(100), nullable=False)
    kelas = Column(String(50), nullable=False)
    
    siswa = relationship("Siswa", back_populates="kelas")
    guru = relationship("Guru", back_populates="kelas")
    mapel_diampu = relationship("MapelDiampu", back_populates="kelas")
    absensi = relationship("Absensi", back_populates="kelas")

class Siswa(Base):
    __tablename__ = "siswa"
    id_siswa = Column(Integer, primary_key=True, index=True)
    id_kelas = Column(Integer, ForeignKey("kelas.id_kelas"))
    nisn = Column(String(20), unique=True, index=True)
    nama = Column(String(100), nullable=False)
    jenis_kelamin = Column(Enum('Laki-laki', 'Perempuan', name='jk_siswa_enum'))
    alamat = Column(Text)
    no_hp = Column(String(15))
    tanggal_lahir = Column(Date)

    kelas = relationship("Kelas", back_populates="siswa")
    nilai = relationship("Nilai", back_populates="siswa")
    absensi = relationship("Absensi", back_populates="siswa")
    pengguna = relationship("Pengguna", back_populates="siswa", uselist=False)

class Guru(Base):
    __tablename__ = "guru"
    id_guru = Column(Integer, primary_key=True, index=True)
    nip = Column(String(30), unique=True, index=True)
    nama = Column(String(100), nullable=False)
    jenis_kelamin = Column(Enum('Laki-laki', 'Perempuan', name='jk_guru_enum'), nullable=False)
    email = Column(String(100), unique=True, index=True)
    no_hp = Column(String(15))
    id_kelas = Column(Integer, ForeignKey("kelas.id_kelas"))

    kelas = relationship("Kelas", back_populates="guru")
    mapel_diampu = relationship("MapelDiampu", back_populates="guru")
    pengguna = relationship("Pengguna", back_populates="guru", uselist=False)

class MataPelajaran(Base):
    __tablename__ = "mata_pelajaran"
    id_mapel = Column(Integer, primary_key=True, index=True)
    nama_mapel = Column(String(100), nullable=False)
    kategori = Column(Enum('Umum', 'Produktif', name='kategori_mapel_enum'))

    mapel_diampu = relationship("MapelDiampu", back_populates="mapel")
    nilai = relationship("Nilai", back_populates="mapel")

class MapelDiampu(Base):
    __tablename__ = "mapel_diampu"
    id_ampu = Column(Integer, primary_key=True, index=True)
    id_guru = Column(Integer, ForeignKey("guru.id_guru"))
    id_kelas = Column(Integer, ForeignKey("kelas.id_kelas"))
    id_mapel = Column(Integer, ForeignKey("mata_pelajaran.id_mapel"))

    guru = relationship("Guru", back_populates="mapel_diampu")
    kelas = relationship("Kelas", back_populates="mapel_diampu")
    mapel = relationship("MataPelajaran", back_populates="mapel_diampu")

class Nilai(Base):
    __tablename__ = "nilai"
    id_nilai = Column(Integer, primary_key=True, index=True)
    id_siswa = Column(Integer, ForeignKey("siswa.id_siswa"))
    id_mapel = Column(Integer, ForeignKey("mata_pelajaran.id_mapel"))
    nilai_uts = Column(Integer)
    nilai_uas = Column(Integer)
    nilai_akhir = Column(Integer)

    siswa = relationship("Siswa", back_populates="nilai")
    mapel = relationship("MataPelajaran", back_populates="nilai")

class Absensi(Base):
    __tablename__ = "absensi"
    id_absensi = Column(Integer, primary_key=True, index=True)
    id_siswa = Column(Integer, ForeignKey("siswa.id_siswa"))
    id_kelas = Column(Integer, ForeignKey("kelas.id_kelas"))
    tanggal = Column(Date)
    status = Column(Enum('Hadir', 'Izin', 'Sakit', 'Alpa', name='status_absensi_enum'))

    siswa = relationship("Siswa", back_populates="absensi")
    kelas = relationship("Kelas", back_populates="absensi")

class Berita(Base):
    __tablename__ = "berita"
    id_berita = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("pengguna.id_user"))
    judul = Column(String(150))
    isi = Column(Text)
    gambar = Column(String(255), nullable=True)
    tanggal_post = Column(TIMESTAMP, server_default=func.now())

    pengguna = relationship("Pengguna", back_populates="berita")

class Pengguna(Base):
    __tablename__ = "pengguna"
    id_user = Column(Integer, primary_key=True, index=True)
    id_guru = Column(Integer, ForeignKey("guru.id_guru"), unique=True, nullable=True)
    id_siswa = Column(Integer, ForeignKey("siswa.id_siswa"), unique=True, nullable=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum('Admin', 'Guru', 'Siswa', name='role_enum'), nullable=False)

    guru = relationship("Guru", back_populates="pengguna")
    siswa = relationship("Siswa", back_populates="pengguna")
    berita = relationship("Berita", back_populates="pengguna")

    @property
    def nama(self):
        if self.role == 'Admin':
            return self.username
        if self.role == 'Guru' and self.guru:
            return self.guru.nama
        if self.role == 'Siswa' and self.siswa:
            return self.siswa.nama
        return self.username
