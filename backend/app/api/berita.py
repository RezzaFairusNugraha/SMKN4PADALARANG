from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import uuid
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models import models
from ..api import deps

router = APIRouter()

class BeritaBase(BaseModel):
    judul: str
    isi: str

class BeritaCreate(BeritaBase):
    pass

class BeritaUpdate(BeritaBase):
    pass

class BeritaResponse(BeritaBase):
    id_berita: int
    id_user: int
    nama_penulis: Optional[str] = None
    role_penulis: Optional[str] = None
    gambar: Optional[str] = None
    tanggal_post: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[BeritaResponse])
def read_berita(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    results = db.query(models.Berita).order_by(models.Berita.tanggal_post.desc()).all()
    for item in results:
        item.nama_penulis = item.pengguna.nama
        item.role_penulis = item.pengguna.role
    return results

@router.get("/public", response_model=List[BeritaResponse])
def read_berita_public(
    db: Session = Depends(get_db)
):
    results = db.query(models.Berita).order_by(models.Berita.tanggal_post.desc()).limit(6).all()
    for item in results:
        item.nama_penulis = item.pengguna.nama
        item.role_penulis = item.pengguna.role
    return results

@router.get("/public/all", response_model=List[BeritaResponse])
def read_berita_public_all(
    db: Session = Depends(get_db)
):
    results = db.query(models.Berita).order_by(models.Berita.tanggal_post.desc()).all()
    for item in results:
        item.nama_penulis = item.pengguna.nama
        item.role_penulis = item.pengguna.role
    return results

@router.get("/public/{id_berita}", response_model=BeritaResponse)
def read_single_berita_public(
    id_berita: int,
    db: Session = Depends(get_db)
):
    db_obj = db.query(models.Berita).filter(models.Berita.id_berita == id_berita).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    
    db_obj.nama_penulis = db_obj.pengguna.nama
    db_obj.role_penulis = db_obj.pengguna.role
    return db_obj

@router.post("/", response_model=BeritaResponse)
def create_berita(
    judul: str = Form(...),
    isi: str = Form(...),
    gambar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    file_path = None
    if gambar:
        file_extension = os.path.splitext(gambar.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"berita/{file_name}"
        save_path = os.path.join("uploads", file_path)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(gambar.file, buffer)

    db_obj = models.Berita(
        id_user=current_user.id_user,
        judul=judul,
        isi=isi,
        gambar=file_path
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    # Add author info for response
    db_obj.nama_penulis = db_obj.pengguna.nama
    db_obj.role_penulis = db_obj.pengguna.role
    return db_obj

@router.put("/{id_berita}", response_model=BeritaResponse)
def update_berita(
    id_berita: int,
    judul: str = Form(...),
    isi: str = Form(...),
    gambar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.Berita).filter(models.Berita.id_berita == id_berita).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    
    if current_user.role != "Admin" and db_obj.id_user != current_user.id_user:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses untuk mengedit berita ini")
    
    if gambar:
        if db_obj.gambar:
            old_path = os.path.join("uploads", db_obj.gambar)
            if os.path.exists(old_path):
                os.remove(old_path)
        
        file_extension = os.path.splitext(gambar.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"berita/{file_name}"
        save_path = os.path.join("uploads", file_path)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(gambar.file, buffer)
        db_obj.gambar = file_path
        pass
    
    db_obj.judul = judul
    db_obj.isi = isi
    db.commit()
    db.refresh(db_obj)
    
    # Add author info for response
    db_obj.nama_penulis = db_obj.pengguna.nama
    db_obj.role_penulis = db_obj.pengguna.role
    return db_obj

@router.delete("/{id_berita}")
def delete_berita(
    id_berita: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.Berita).filter(models.Berita.id_berita == id_berita).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Berita tidak ditemukan")
    
    if current_user.role != "Admin" and db_obj.id_user != current_user.id_user:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses untuk menghapus berita ini")
    
    db.delete(db_obj)
    db.commit()
    return {"message": "Berita berhasil dihapus"}
