from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List
from ..database import get_db
from ..models import models
from ..api import deps

router = APIRouter()

@router.post("/")
def create_absensi(
    id_siswa: int,
    id_kelas: int,
    status: str,
    db: Session = Depends(get_db),
    current_guru = Depends(deps.get_current_guru)
):
    db_obj = models.Absensi(
        id_siswa=id_siswa,
        id_kelas=id_kelas,
        tanggal=date.today(),
        status=status
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/siswa/{id_siswa}")
def get_absensi_siswa(
    id_siswa: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(models.Absensi).filter(models.Absensi.id_siswa == id_siswa).all()
