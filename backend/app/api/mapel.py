from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import master as schemas
from ..api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.MapelResponse])
def read_mapel(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return db.query(models.MataPelajaran).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.MapelResponse)
def create_mapel(
    mapel_in: schemas.MapelCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = models.MataPelajaran(**mapel_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{id_mapel}", response_model=schemas.MapelResponse)
def read_mapel_by_id(
    id_mapel: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    db_obj = db.query(models.MataPelajaran).filter(models.MataPelajaran.id_mapel == id_mapel).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Mata pelajaran not found")
    return db_obj

@router.put("/{id_mapel}", response_model=schemas.MapelResponse)
def update_mapel(
    id_mapel: int,
    mapel_in: schemas.MapelCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.MataPelajaran).filter(models.MataPelajaran.id_mapel == id_mapel).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Mata pelajaran not found")
    
    update_data = mapel_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/{id_mapel}")
def delete_mapel(
    id_mapel: int,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.MataPelajaran).filter(models.MataPelajaran.id_mapel == id_mapel).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Mata pelajaran not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Mata pelajaran deleted successfully"}

# -------------------------------------------------------------
# MAPEL DIAMPU (ASSIGNMENTS)
# -------------------------------------------------------------

@router.get("/diampu/list", response_model=List[schemas.MapelDiampuResponse])
def read_all_assignments(
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    return db.query(models.MapelDiampu).all()

@router.post("/diampu/", response_model=schemas.MapelDiampuResponse)
def create_assignment(
    assignment_in: schemas.MapelDiampuCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    # Check if assignment already exists
    exists = db.query(models.MapelDiampu).filter(
        models.MapelDiampu.id_guru == assignment_in.id_guru,
        models.MapelDiampu.id_mapel == assignment_in.id_mapel,
        models.MapelDiampu.id_kelas == assignment_in.id_kelas
    ).first()
    
    if exists:
        raise HTTPException(status_code=400, detail="Assignment already exists")
        
    db_obj = models.MapelDiampu(**assignment_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.put("/diampu/{id_ampu}", response_model=schemas.MapelDiampuResponse)
def update_assignment(
    id_ampu: int,
    assignment_in: schemas.MapelDiampuCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_ampu == id_ampu).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    update_data = assignment_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/diampu/{id_ampu}")
def delete_assignment(
    id_ampu: int,
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    db_obj = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_ampu == id_ampu).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Assignment deleted successfully"}
