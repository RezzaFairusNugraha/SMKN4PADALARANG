from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import master as schemas
from ..api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.KelasResponse])
def read_kelas(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return db.query(models.Kelas).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.KelasResponse)
def create_kelas(
    kelas_in: schemas.KelasCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = models.Kelas(**kelas_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{id_kelas}", response_model=schemas.KelasResponse)
def read_kelas_by_id(
    id_kelas: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.Kelas).filter(models.Kelas.id_kelas == id_kelas).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Kelas not found")
    return db_obj

@router.put("/{id_kelas}", response_model=schemas.KelasResponse)
def update_kelas(
    id_kelas: int,
    kelas_in: schemas.KelasCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Kelas).filter(models.Kelas.id_kelas == id_kelas).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Kelas not found")
    
    update_data = kelas_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{id_kelas}")
def delete_kelas(
    id_kelas: int,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Kelas).filter(models.Kelas.id_kelas == id_kelas).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Kelas not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Kelas deleted successfully"}
