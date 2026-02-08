from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import master as schemas
from ..api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.GuruResponse])
def read_guru(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(models.Guru).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.GuruResponse)
def create_guru(
    guru_in: schemas.GuruCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    guru_data = guru_in.model_dump(exclude={"assignments"})
    assignments = guru_in.assignments or []
    
    db_obj = models.Guru(**guru_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    
    for assign in assignments:
        db_assign = models.MapelDiampu(
            id_guru=db_obj.id_guru,
            id_mapel=assign.id_mapel,
            id_kelas=assign.id_kelas
        )
        db.add(db_assign)
    
    if assignments:
        db.commit()
        db.refresh(db_obj)
        
    return db_obj

@router.get("/{id_guru}", response_model=schemas.GuruResponse)
def read_guru_by_id(
    id_guru: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.Guru).filter(models.Guru.id_guru == id_guru).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Guru not found")
    return db_obj

@router.put("/{id_guru}", response_model=schemas.GuruResponse)
def update_guru(
    id_guru: int,
    guru_in: schemas.GuruCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Guru).filter(models.Guru.id_guru == id_guru).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Guru not found")
    
    update_data = guru_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{id_guru}")
def delete_guru(
    id_guru: int,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.Guru).filter(models.Guru.id_guru == id_guru).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Guru not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Guru deleted successfully"}
