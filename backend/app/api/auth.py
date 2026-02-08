from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..core import security
from ..models import models
from ..schemas import auth as auth_schemas
from ..api import deps

router = APIRouter()

@router.post("/login", response_model=auth_schemas.Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(models.Pengguna).filter(models.Pengguna.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=security.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": security.create_access_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=auth_schemas.UserResponse)
def register_user(
    user_in: auth_schemas.UserCreate,
    db: Session = Depends(get_db)
):
    user = db.query(models.Pengguna).filter(models.Pengguna.username == user_in.username).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this username already exists in the system",
        )
    
    id_guru = None
    id_siswa = None

    if user_in.role == auth_schemas.RoleEnum.Siswa:
        if not user_in.nisn:
            raise HTTPException(status_code=400, detail="NISN is required for student registration")
        
        siswa = db.query(models.Siswa).filter(models.Siswa.nisn == user_in.nisn).first()
        
        if not siswa:
            # Require additional fields for creation
            if not user_in.nama or not user_in.jenis_kelamin:
                 raise HTTPException(status_code=400, detail="Nama and Jenis Kelamin are required for new student registration")
            
            new_siswa = models.Siswa(
                nisn=user_in.nisn,
                nama=user_in.nama,
                jenis_kelamin=user_in.jenis_kelamin,
                no_hp=user_in.no_hp,
                id_kelas=user_in.id_kelas_registered
            )
            db.add(new_siswa)
            db.commit()
            db.refresh(new_siswa)
            id_siswa = new_siswa.id_siswa
        else:
            if siswa.pengguna:
                raise HTTPException(status_code=400, detail="Student already has an account")
            
            id_siswa = siswa.id_siswa

    elif user_in.role == auth_schemas.RoleEnum.Guru:
        if not user_in.nip:
            raise HTTPException(status_code=400, detail="NIP is required for teacher registration")
            
        guru = db.query(models.Guru).filter(models.Guru.nip == user_in.nip).first()
        
        if not guru:
             # Require additional fields for creation
            if not user_in.nama or not user_in.jenis_kelamin:
                 raise HTTPException(status_code=400, detail="Nama and Jenis Kelamin are required for new teacher registration")
            
            new_guru = models.Guru(
                nip=user_in.nip,
                nama=user_in.nama,
                jenis_kelamin=user_in.jenis_kelamin,
                no_hp=user_in.no_hp
            )
            db.add(new_guru)
            db.commit()
            db.refresh(new_guru)
            id_guru = new_guru.id_guru

            if user_in.id_mapel:
                # Check if mapel exists
                mapel = db.query(models.MataPelajaran).filter(models.MataPelajaran.id_mapel == user_in.id_mapel).first()
                if mapel:
                    new_assignment = models.MapelDiampu(
                        id_guru=id_guru,
                        id_mapel=user_in.id_mapel,
                        id_kelas=user_in.id_kelas_guru
                    )
                    db.add(new_assignment)
                    db.commit()
        else:
            if guru.pengguna:
                raise HTTPException(status_code=400, detail="Teacher already has an account")
            id_guru = guru.id_guru
    
    db_obj = models.Pengguna(

        username=user_in.username,
        password=security.get_password_hash(user_in.password),
        role=user_in.role,
        id_guru=id_guru,
        id_siswa=id_siswa
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/me", response_model=auth_schemas.UserResponse)
def read_user_me(
    current_user: models.Pengguna = Depends(deps.get_current_active_user)
):
    return current_user

@router.get("/profile")
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: models.Pengguna = Depends(deps.get_current_active_user)
):
    profile_data = {
        "username": current_user.username,
        "role": current_user.role,
        "id_user": current_user.id_user,
    }
    
    if current_user.role == "Guru" and current_user.guru:
        profile_data["guru"] = current_user.guru
    elif current_user.role == "Siswa" and current_user.siswa:
        profile_data["siswa"] = current_user.siswa
        
    return profile_data

@router.put("/profile")
def update_user_profile(
    data: dict,
    db: Session = Depends(get_db),
    current_user: models.Pengguna = Depends(deps.get_current_active_user)
):
    if current_user.role == "Guru" and current_user.guru:
        guru = current_user.guru
        for key, value in data.items():
            if hasattr(guru, key) and key not in ["id_guru", "nip"]:
                setattr(guru, key, value)
        db.add(guru)
    
    elif current_user.role == "Siswa" and current_user.siswa:
        siswa = current_user.siswa
        for key, value in data.items():
            if hasattr(siswa, key) and key not in ["id_siswa", "nisn"]:
                setattr(siswa, key, value)
    db.add(siswa)
    
    if "password" in data and data["password"]:
        current_user.password = security.get_password_hash(data["password"])
        db.add(current_user)

    db.commit()
    return {"message": "Profile updated successfully"}
