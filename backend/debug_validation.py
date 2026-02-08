from app.database import SessionLocal
from app.models import models
from app.schemas import master as schemas
import json

def debug_validation():
    db = SessionLocal()
    try:
        assignments = db.query(models.MapelDiampu).all()
        print(f"Found {len(assignments)} assignments")
        for a in assignments:
            try:
                # Manually validate one by one
                validated = schemas.MapelDiampuResponse.model_validate(a)
                print(f"Validated ID {a.id_ampu} OK")
            except Exception as e:
                print(f"Failed validation for ID {a.id_ampu}: {e}")
                # Print more details if possible
                if hasattr(a, 'mapel'): print(f"  mapel: {a.mapel}")
                if hasattr(a, 'guru'): print(f"  guru: {a.guru}")
                if hasattr(a, 'kelas'): print(f"  kelas: {a.kelas}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_validation()
