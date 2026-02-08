import sys
import os

# Get the absolute path of the 'backend' directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
# Add it to sys.path so 'app' can be imported
sys.path.insert(0, backend_dir)

from app.database import SessionLocal, engine, Base
from app.models import models
from app.core.security import get_password_hash

def seed_data():
    # Ensure tables are created first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(models.Pengguna).filter(models.Pengguna.username == "admin").first()
        if not admin:
            # 1. Create a Default Admin
            new_admin = models.Pengguna(
                username="admin",
                password=get_password_hash("password123"),
                role="Admin"
            )
            db.add(new_admin)
            
            # Commit first to ensure we have the admin/base data
            db.commit()

            # 2. Add some initial master data
            # Check if class exists
            kelas = db.query(models.Kelas).first()
            if not kelas:
                kelas = models.Kelas(jurusan="IPA", kelas="XII-IPA-1")
                db.add(kelas)
                db.commit()
                db.refresh(kelas)
            
            # Check if guru exists
            guru = db.query(models.Guru).filter(models.Guru.nip == "123456789").first()
            if not guru:
                guru = models.Guru(
                    nip="123456789",
                    nama="Bapak Admin",
                    jenis_kelamin="Laki-laki",
                    email="admin@school.id",
                    id_kelas=kelas.id_kelas
                )
                db.add(guru)
            
            mapel = db.query(models.MataPelajaran).filter(models.MataPelajaran.nama_mapel == "Matematika").first()
            if not mapel:
                mapel = models.MataPelajaran(nama_mapel="Matematika", kategori="Umum")
                db.add(mapel)
            
            # Check if siswa exists
            siswa = db.query(models.Siswa).filter(models.Siswa.nisn == "12345").first()
            if not siswa:
                siswa = models.Siswa(
                    nisn="12345",
                    nama="Siswa Contoh",
                    jenis_kelamin="Laki-laki",
                    id_kelas=kelas.id_kelas,
                    alamat="Jl. Pendidikan No. 1",
                    no_hp="08123456789"
                )
                db.add(siswa)

            db.commit()
            db.refresh(guru)
            db.refresh(siswa)

            # 3. Create Login Accounts for Guru and Siswa
            # Guru Account
            guru_user = db.query(models.Pengguna).filter(models.Pengguna.username == "guru1").first()
            if not guru_user:
                guru_user = models.Pengguna(
                    username="guru1",
                    password=get_password_hash("password123"),
                    role="Guru",
                    id_guru=guru.id_guru
                )
                db.add(guru_user)

            # Siswa Account
            siswa_user = db.query(models.Pengguna).filter(models.Pengguna.username == "siswa1").first()
            if not siswa_user:
                siswa_user = models.Pengguna(
                    username="siswa1",
                    password=get_password_hash("password123"),
                    role="Siswa",
                    id_siswa=siswa.id_siswa
                )
                db.add(siswa_user)

            db.commit()
            print("Successfully created/verified default accounts:")
            print("Admin: admin / password123")
            print("Guru:  guru1 / password123")
            print("Siswa: siswa1 / password123")
        else:
            print("Admin user already exists. Checking for other accounts...")
            # Ensure Guru and Siswa accounts exist if admin exists
            # This handles cases where only admin was seeded previously
            
            # (Adding logic here to sync other roles if needed, 
            # but for now, we'll keep it simple as the user likely wants a fresh/updated seed)
            
            # Check for generic Guru account
            guru = db.query(models.Guru).first()
            if guru and not db.query(models.Pengguna).filter(models.Pengguna.role == "Guru").first():
                guru_user = models.Pengguna(
                    username="guru1",
                    password=get_password_hash("password123"),
                    role="Guru",
                    id_guru=guru.id_guru
                )
                db.add(guru_user)
            
            # Check for generic Siswa account
            siswa = db.query(models.Siswa).first()
            if siswa and not db.query(models.Pengguna).filter(models.Pengguna.role == "Siswa").first():
                siswa_user = models.Pengguna(
                    username="siswa1",
                    password=get_password_hash("password123"),
                    role="Siswa",
                    id_siswa=siswa.id_siswa
                )
                db.add(siswa_user)
            
            db.commit()
            print("Verified accounts for Admin, Guru, and Siswa roles.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
