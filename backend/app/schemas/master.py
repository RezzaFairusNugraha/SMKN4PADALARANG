from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from enum import Enum

class JenisKelaminEnum(str, Enum):
    LakiLaki = "Laki-laki"
    Perempuan = "Perempuan"

class KategoriMapelEnum(str, Enum):
    Umum = "Umum"
    Kejuruan = "Kejuruan"

# KELAS
class KelasBase(BaseModel):
    jurusan: str
    kelas: str

class KelasCreate(KelasBase):
    pass

class KelasResponse(KelasBase):
    id_kelas: int
    class Config:
        from_attributes = True

# SISWA
class SiswaBase(BaseModel):
    id_kelas: Optional[int] = None
    nisn: str
    nama: str
    jenis_kelamin: JenisKelaminEnum
    alamat: Optional[str] = None
    no_hp: Optional[str] = None
    tanggal_lahir: Optional[date] = None

class SiswaCreate(SiswaBase):
    pass

class SiswaResponse(SiswaBase):
    id_siswa: int
    class Config:
        from_attributes = True

# MATA PELAJARAN
class MapelBase(BaseModel):
    nama_mapel: str
    kategori: KategoriMapelEnum
    class Config:
        from_attributes = True

class MapelCreate(MapelBase):
    pass

class MapelResponse(MapelBase):
    id_mapel: int
    class Config:
        from_attributes = True

# MAPEL DIAMPU
class MapelDiampuBase(BaseModel):
    id_mapel: int
    id_kelas: Optional[int] = None
    id_guru: int

class AssignmentSimple(BaseModel):
    id_mapel: int
    id_kelas: int

class MapelDiampuCreate(MapelDiampuBase):
    pass

class MapelDiampuResponse(BaseModel):
    id_ampu: int
    id_mapel: Optional[int] = None
    id_kelas: Optional[int] = None
    id_guru: Optional[int] = None
    mapel: Optional[MapelResponse] = None
    kelas: Optional[KelasResponse] = None
    guru: Optional["GuruBase"] = None
    class Config:
        from_attributes = True

# GURU
class GuruBase(BaseModel):
    nip: str
    nama: str
    jenis_kelamin: JenisKelaminEnum
    email: Optional[EmailStr] = None
    no_hp: Optional[str] = None
    id_kelas: Optional[int] = None
    class Config:
        from_attributes = True

class GuruCreate(GuruBase):
    assignments: Optional[List[AssignmentSimple]] = []

class GuruResponse(GuruBase):
    id_guru: int
    mapel_diampu: List["MapelDiampuResponse"] = []
    class Config:
        from_attributes = True

# NILAI
class NilaiBase(BaseModel):
    id_siswa: int
    id_mapel: int
    nilai_uts: Optional[int] = 0
    nilai_uas: Optional[int] = 0
    nilai_akhir: Optional[int] = 0

class NilaiCreate(NilaiBase):
    pass

class NilaiResponse(NilaiBase):
    id_nilai: int
    mapel: Optional[MapelResponse] = None
    class Config:
        from_attributes = True

# Resolve forward references
MapelDiampuResponse.model_rebuild()
GuruResponse.model_rebuild()
GuruBase.model_rebuild()
