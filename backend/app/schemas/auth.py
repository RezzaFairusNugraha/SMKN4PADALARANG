from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class RoleEnum(str, Enum):
    Admin = "Admin"
    Guru = "Guru"
    Siswa = "Siswa"

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    username: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str
    nisn: Optional[str] = None
    nip: Optional[str] = None
    nama: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    no_hp: Optional[str] = None
    id_mapel: Optional[int] = None # For Guru
    id_kelas_guru: Optional[int] = None # For Guru Assignment
    id_kelas_registered: Optional[int] = None # For Siswa
    id_guru: Optional[int] = None
    id_siswa: Optional[int] = None

class UserUpdate(BaseModel):
    password: Optional[str] = None
    role: Optional[RoleEnum] = None

class UserResponse(UserBase):
    id_user: int
    id_guru: Optional[int] = None
    id_siswa: Optional[int] = None

    class Config:
        from_attributes = True
