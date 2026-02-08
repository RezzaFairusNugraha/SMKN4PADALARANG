
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import models
from app.database import SessionLocal, engine

# Ensure tables exist (normally they do)
# Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if NIP exists
    nip = "197209282005011004"
    existing = db.query(models.Guru).filter(models.Guru.nip == nip).first()
    if existing:
        print(f"Guru with NIP {nip} ALREADY EXISTS. ID: {existing.id_guru}, Name: {existing.nama}, Email: {existing.email}")
    else:
        print(f"Guru with NIP {nip} NOT FOUND. Attempting to create...")
        
        # Create new Guru with NULL email
        new_guru = models.Guru(
            nip=nip,
            nama="Test Guru Auto",
            jenis_kelamin="Laki-laki",
            email=None,  # Sending None
            no_hp="08123456789"
        )
        db.add(new_guru)
        db.commit()
        db.refresh(new_guru)
        print(f"Successfully created Guru. ID: {new_guru.id_guru}, Email: {new_guru.email}")

except Exception as e:
    print(f"Error creating Guru: {e}")
    db.rollback()
finally:
    db.close()
