from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import master as schemas
from ..api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.SiswaResponse])
def read_siswa(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(models.Siswa).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.SiswaResponse)
def create_siswa(
    siswa_in: schemas.SiswaCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = models.Siswa(**siswa_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{id_siswa}", response_model=schemas.SiswaResponse)
def read_siswa_by_id(
    id_siswa: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.Siswa).filter(models.Siswa.id_siswa == id_siswa).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Siswa not found")
    return db_obj

@router.put("/{id_siswa}", response_model=schemas.SiswaResponse)
def update_siswa(
    id_siswa: int,
    siswa_in: schemas.SiswaCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Siswa).filter(models.Siswa.id_siswa == id_siswa).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Siswa not found")
    
    update_data = siswa_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{id_siswa}")
def delete_siswa(
    id_siswa: int,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Siswa).filter(models.Siswa.id_siswa == id_siswa).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Siswa not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Siswa deleted successfully"}
