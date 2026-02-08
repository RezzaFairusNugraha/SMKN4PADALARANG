
import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

# Try to load from ../.env (root of project?)
load_dotenv("../.env")

# Fallback or use what's in database.py
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/school_management")
print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
inspector = inspect(engine)

columns = inspector.get_columns('guru')
for column in columns:
    if column['name'] == 'email':
        print(f"Column: {column['name']}, Nullable: {column['nullable']}")
