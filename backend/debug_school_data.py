
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import models

def check_data():
    db: Session = SessionLocal()
    try:
        print("--- DEBUGGING SCHOOL DATA ---")
        
        # 1. Check Gurus
        gurus = db.query(models.Guru).all()
        print(f"Total Gurus: {len(gurus)}")
        for g in gurus:
            print(f"  - [{g.id_guru}] {g.nama} (NIP: {g.nip})")

        # 2. Check Classes
        kelas_list = db.query(models.Kelas).all()
        print(f"\nTotal Classes: {len(kelas_list)}")
        for k in kelas_list:
            print(f"  - [{k.id_kelas}] {k.kelas} {k.jurusan}")

        # 3. Check Mapel (Subjects)
        mapels = db.query(models.MataPelajaran).all()
        print(f"\nTotal Subjects: {len(mapels)}")
        for m in mapels:
            print(f"  - [{m.id_mapel}] {m.nama_mapel} ({m.kategori})")

        # 4. Check Students
        students = db.query(models.Siswa).all()
        print(f"\nTotal Students: {len(students)}")
        for s in students:
            kelas_name = s.kelas.kelas if s.kelas else "NO CLASS"
            print(f"  - [{s.id_siswa}] {s.nama} (Class: {kelas_name})")

        # 5. CRITICAL: Check MapelDiampu (Teaching Assignments)
        assignments = db.query(models.MapelDiampu).all()
        print(f"\nTotal Teaching Assignments (MapelDiampu): {len(assignments)}")
        if not assignments:
            print("  !!! WARNING: No teaching assignments found. Gurus cannot input grades if they are not assigned to a class/subject.")
        for a in assignments:
            guru_name = a.guru.nama if a.guru else "UNKNOWN"
            mapel_name = a.mapel.nama_mapel if a.mapel else "UNKNOWN"
            kelas_name = a.kelas.kelas if a.kelas else "UNKNOWN"
            print(f"  - ID: {a.id_ampu} | Guru: {guru_name} -> teaches {mapel_name} -> to {kelas_name}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
