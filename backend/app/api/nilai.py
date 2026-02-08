from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import master as schemas
from ..api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.NilaiResponse])
def read_nilai(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(models.Nilai).all()

@router.get("/guru/me")
def get_guru_teaching_data(
    db: Session = Depends(get_db),
    current_guru = Depends(deps.get_current_guru)
):
    # Get what this guru teaches
    teaching = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_guru == current_guru.id_guru).all()
    
    # Structure data to return: Classes -> Students -> Grades
    result = []
    for t in teaching:
        kelas = t.kelas
        students = db.query(models.Siswa).filter(models.Siswa.id_kelas == kelas.id_kelas).all()
        
        student_data = []
        for s in students:
            # Get existing grade for this student and this specific subject
            grade = db.query(models.Nilai).filter(
                models.Nilai.id_siswa == s.id_siswa,
                models.Nilai.id_mapel == t.id_mapel
            ).first()
            
            student_data.append({
                "id_siswa": s.id_siswa,
                "nama": s.nama,
                "nisn": s.nisn,
                "nilai": grade
            })
            
        result.append({
            "id_ampu": t.id_ampu,
            "id_kelas": t.id_kelas,
            "kelas_nama": kelas.kelas,
            "id_mapel": t.id_mapel,
            "mapel_nama": t.mapel.nama_mapel,
            "students": student_data
        })
    return result

@router.post("/", response_model=schemas.NilaiResponse)
def create_or_update_nilai(
    nilai_in: schemas.NilaiCreate,
    db: Session = Depends(get_db),
    current_guru = Depends(deps.get_current_guru)
):
    # Calculate nilai_akhir
    nilai_akhir = int(((nilai_in.nilai_uts or 0) + (nilai_in.nilai_uas or 0)) / 2)
    
    # Check if exists
    db_obj = db.query(models.Nilai).filter(
        models.Nilai.id_siswa == nilai_in.id_siswa,
        models.Nilai.id_mapel == nilai_in.id_mapel
    ).first()
    
    if db_obj:
        db_obj.nilai_uts = nilai_in.nilai_uts
        db_obj.nilai_uas = nilai_in.nilai_uas
        db_obj.nilai_akhir = nilai_akhir
    else:
        db_obj = models.Nilai(
            **nilai_in.model_dump(exclude={"nilai_akhir"}),
            nilai_akhir=nilai_akhir
        )
        db.add(db_obj)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/siswa/me", response_model=List[schemas.NilaiResponse])
def get_my_nilai(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    if current_user.role != "Siswa":
        raise HTTPException(status_code=400, detail="Only students can view their grades here")
    
    return db.query(models.Nilai).filter(models.Nilai.id_siswa == current_user.id_siswa).all()

@router.get("/siswa/{id_siswa}", response_model=List[schemas.NilaiResponse])
def get_nilai_siswa(
    id_siswa: int,
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(models.Nilai).filter(models.Nilai.id_siswa == id_siswa).all()
