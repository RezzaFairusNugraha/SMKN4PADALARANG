"""
Script untuk menambahkan data testing Guru ke database
"""
import sys
sys.path.append('/home/rezza/Documents/PROJECT/NEXT+FASTAPI/backend')

from app.database import SessionLocal
from app.models.models import Guru, Pengguna, Kelas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_guru():
    db = SessionLocal()
    
    try:
        # Cek apakah sudah ada kelas
        kelas = db.query(Kelas).first()
        if not kelas:
            # Buat kelas dummy jika belum ada
            kelas = Kelas(jurusan="Rekayasa Perangkat Lunak", kelas="XII RPL 1")
            db.add(kelas)
            db.commit()
            db.refresh(kelas)
            print(f"✅ Kelas dibuat: {kelas.jurusan} - {kelas.kelas}")
        
        # Data guru testing
        test_gurus = [
            {
                "nip": "123456789",
                "nama": "Budi Santoso",
                "jenis_kelamin": "Laki-laki",
                "email": "budi.guru@smkn4.sch.id",
                "no_hp": "081234567890",
                "username": "guru123",
                "password": "guru123"
            },
            {
                "nip": "987654321",
                "nama": "Siti Nurhaliza",
                "jenis_kelamin": "Perempuan",
                "email": "siti.guru@smkn4.sch.id",
                "no_hp": "081234567891",
                "username": "gurusiti",
                "password": "guru123"
            }
        ]
        
        for guru_data in test_gurus:
            # Cek apakah guru sudah ada
            existing_guru = db.query(Guru).filter(Guru.nip == guru_data["nip"]).first()
            if existing_guru:
                print(f"⚠️  Guru dengan NIP {guru_data['nip']} sudah ada")
                continue
            
            # Buat guru baru
            guru = Guru(
                nip=guru_data["nip"],
                nama=guru_data["nama"],
                jenis_kelamin=guru_data["jenis_kelamin"],
                email=guru_data["email"],
                no_hp=guru_data["no_hp"],
                id_kelas=kelas.id_kelas
            )
            db.add(guru)
            db.commit()
            db.refresh(guru)
            
            # Buat akun pengguna untuk guru
            hashed_password = pwd_context.hash(guru_data["password"])
            pengguna = Pengguna(
                username=guru_data["username"],
                password_hash=hashed_password,
                role="Guru",
                id_guru=guru.id_guru
            )
            db.add(pengguna)
            db.commit()
            
            print(f"✅ Guru berhasil dibuat:")
            print(f"   Nama: {guru.nama}")
            print(f"   NIP: {guru.nip}")
            print(f"   Username: {guru_data['username']}")
            print(f"   Password: {guru_data['password']}")
            print()
        
        print("\n🎉 Data testing guru berhasil ditambahkan!")
        print("\n📝 Untuk login sebagai Guru, gunakan:")
        print("   Username: guru123")
        print("   Password: guru123")
        print("\n   atau")
        print("\n   Username: gurusiti")
        print("   Password: guru123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_guru()
