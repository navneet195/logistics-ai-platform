import pandas as pd
from db import get_engine
from config import DATA_DIR

engine = get_engine()

def load_csv(file, table):
    df = pd.read_csv(f"{DATA_DIR}/{file}")
    df.to_sql(table, engine, if_exists="replace", index=False)
    print(f"Loaded {table}")

if __name__ == "__main__":
    load_csv("customers.csv", "customers")
    load_csv("routes.csv", "routes")
    load_csv("shipments.csv", "shipments")
    load_csv("invoices.csv", "invoices")
    load_csv("claims.csv", "claims")

    print("DATABASE SEEDED")