from sqlalchemy import create_engine
import os

DB_URL = os.getenv("DB_URL", "postgresql://postgres:postgres@localhost:5432/logistics_db")

engine = create_engine(DB_URL)