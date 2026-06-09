from app.core.db import engine
import pandas as pd

def run_sql(query: str):
    with engine.connect() as conn:
        result = pd.read_sql(query, conn)
    return result