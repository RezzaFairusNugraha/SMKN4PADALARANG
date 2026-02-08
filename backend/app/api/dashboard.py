from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import models
from ..api import deps

router = APIRouter()

@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db),
    current_admin = Depends(deps.get_current_admin)
):
    total_siswa = db.query(models.Siswa).count()
    total_guru = db.query(models.Guru).count()
    total_kelas = db.query(models.Kelas).count()
    total_mapel = db.query(models.MataPelajaran).count()
    
    # Recent news
    recent_news = db.query(models.Berita).order_by(models.Berita.tanggal_post.desc()).limit(5).all()
    
    # Gender distribution
    gender_dist = db.query(
        models.Siswa.jenis_kelamin, 
        func.count(models.Siswa.id_siswa)
    ).group_by(models.Siswa.jenis_kelamin).all()
    
    return {
        "total_siswa": total_siswa,
        "total_guru": total_guru,
        "total_kelas": total_kelas,
        "total_mapel": total_mapel,
        "recent_news": recent_news,
        "gender_distribution": dict(gender_dist)
    }

@router.get("/statistics/guru")
def get_guru_statistics(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_guru)
):
    if current_user.role != "Guru":
        return {}
        
    guru = db.query(models.Guru).filter(models.Guru.id_guru == current_user.id_guru).first()
    if not guru:
        return {}

    # Subjects assigned to this guru
    assigned_mapels = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_guru == guru.id_guru).all()
    id_classes = [m.id_kelas for m in assigned_mapels]
    
    # Total students in those classes
    total_students = db.query(models.Siswa).filter(models.Siswa.id_kelas.in_(id_classes)).count() if id_classes else 0
    
    # Upcoming sessions (just a placeholder count of assigned classes/subjects)
    total_sessions = len(assigned_mapels)
    
    return {
        "total_students": total_students,
        "total_mapel": len(set([m.id_mapel for m in assigned_mapels])),
        "total_sessions": total_sessions,
        "assigned_classes": len(set(id_classes))
    }

@router.get("/statistics/siswa")
def get_siswa_statistics(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    if current_user.role != "Siswa":
        return {}

    siswa = db.query(models.Siswa).filter(models.Siswa.id_siswa == current_user.id_siswa).first()
    if not siswa:
        return {}

    # Average Grade
    grades = db.query(models.Nilai).filter(models.Nilai.id_siswa == siswa.id_siswa).all()
    avg_grade = sum([n.nilai_akhir for n in grades]) / len(grades) if grades else 0
    
    # Attendance summary
    attendance = db.query(
        models.Absensi.status, 
        func.count(models.Absensi.id_absensi)
    ).filter(models.Absensi.id_siswa == siswa.id_siswa).group_by(models.Absensi.status).all()
    
    # Tasks (Mock if no Model exists, for now return count of Mapels in their class)
    total_subjects = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_kelas == siswa.id_kelas).count()

    return {
        "average_grade": round(avg_grade, 2),
        "attendance": dict(attendance),
        "total_subjects": total_subjects,
        "pending_tasks": 0 # Default 0 as we don't have task model yet
    }

@router.get("/jadwal")
def get_jadwal_mengajar(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_guru)
):
    # Only return for the current guru if they are a guru
    guru = db.query(models.Guru).filter(models.Guru.id_guru == current_user.id_guru).first()
    if not guru:
        return []
        
    jadwal = db.query(models.MapelDiampu).filter(models.MapelDiampu.id_guru == guru.id_guru).all()
    return jadwal

@router.get("/rekap-absensi")
def get_rekap_absensi(
    db: Session = Depends(get_db),
    current_user = Depends(deps.get_current_active_user)
):
    # Logic for rekap absensi based on role
    if current_user.role == "Siswa":
        rekap = db.query(
            models.Absensi.status, 
            func.count(models.Absensi.id_absensi)
        ).filter(models.Absensi.id_siswa == current_user.id_siswa).group_by(models.Absensi.status).all()
        return dict(rekap)
    
    return {}
