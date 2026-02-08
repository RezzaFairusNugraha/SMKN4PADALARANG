from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql://postgres:postgres@localhost/siakad_db" # Checking if this matches common dev setups or .env

def check_db():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            result = conn.execute(text("SELECT DISTINCT kategori FROM mata_pelajaran"))
            categories = [row[0] for row in result]
            print(f"Categories in DB: {categories}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
