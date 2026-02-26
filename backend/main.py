from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api import auth, kelas, siswa, guru, mapel, dashboard, nilai, absensi, berita
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="School Management System API")

uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
if not os.path.exists(os.path.join(uploads_dir, "berita")):
    os.makedirs(os.path.join(uploads_dir, "berita"))

app.mount("/api/uploads", StaticFiles(directory=uploads_dir), name="uploads")

origins = [
    "http://localhost:3000",
    "https://smkn-4-padalarang.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(kelas.router, prefix="/api/kelas", tags=["Kelas"])
app.include_router(siswa.router, prefix="/api/siswa", tags=["Siswa"])
app.include_router(guru.router, prefix="/api/guru", tags=["Guru"])
app.include_router(mapel.router, prefix="/api/mapel", tags=["Mapel"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(nilai.router, prefix="/api/nilai", tags=["Nilai"])
app.include_router(absensi.router, prefix="/api/absensi", tags=["Absensi"])
app.include_router(berita.router, prefix="/api/berita", tags=["Berita"])

@app.get("/")
def read_root():
    return {"message": "Welcome to School Management System API"}
