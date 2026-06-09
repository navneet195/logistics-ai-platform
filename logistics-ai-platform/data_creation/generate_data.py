import pandas as pd
import numpy as np
from faker import Faker
from tqdm import tqdm
import os

from config import *

fake = Faker()

os.makedirs(DATA_DIR, exist_ok=True)

# -----------------------------
# 1. CUSTOMERS
# -----------------------------
def generate_customers():
    data = []

    for i in range(NUM_CUSTOMERS):
        data.append({
            "customer_id": f"C{i:05}",
            "customer_name": fake.company(),
            "industry": np.random.choice(
                ["Retail", "Pharma", "FMCG", "Auto", "Electronics"]
            ),
            "country": fake.country(),
            "region": np.random.choice(
                ["APAC", "Europe", "MEA", "Americas"]
            ),
            "risk_score": np.random.randint(1, 100),
            "credit_limit": np.random.randint(50000, 5000000)
        })

    df = pd.DataFrame(data)
    df.to_csv(f"{DATA_DIR}/customers.csv", index=False)
    return df


# -----------------------------
# 2. ROUTES
# -----------------------------
def generate_routes():
    ports = ["Mumbai","Shanghai","Rotterdam","Singapore","Hamburg",
             "Dubai","Los Angeles","Antwerp","New York"]

    data = []

    for i in range(NUM_ROUTES):
        data.append({
            "route_id": f"R{i:03}",
            "origin_port": np.random.choice(ports),
            "destination_port": np.random.choice(ports),
            "distance_km": np.random.randint(500, 15000),
            "avg_transit_days": np.random.randint(5, 40)
        })

    df = pd.DataFrame(data)
    df.to_csv(f"{DATA_DIR}/routes.csv", index=False)
    return df


# -----------------------------
# 3. SHIPMENTS (100K)
# -----------------------------
def generate_shipments(customers, routes):
    data = []

    for i in tqdm(range(NUM_SHIPMENTS)):
        c = customers.sample(1).iloc[0]
        r = routes.sample(1).iloc[0]

        delay = np.random.choice(
            [0,1,2,3,5,7,10,15],
            p=[0.55,0.12,0.10,0.08,0.07,0.04,0.03,0.01]
        )

        data.append({
            "shipment_id": f"S{i:06}",
            "customer_id": c["customer_id"],
            "route_id": r["route_id"],

            "shipment_date": fake.date_between("-2y", "today"),

            "expected_delivery": fake.date_between("-2y", "today"),

            "actual_delivery": fake.date_between("-2y", "today"),

            "container_count": np.random.randint(1, 20),
            "weight_tons": round(np.random.uniform(1, 120), 2),

            "transport_cost": round(np.random.uniform(1000, 50000), 2),
            "fuel_cost": round(np.random.uniform(500, 10000), 2),
            "storage_cost": round(np.random.uniform(100, 5000), 2),

            "delay_days": delay,

            "status": "Delayed" if delay > 0 else "Delivered"
        })

    df = pd.DataFrame(data)
    df.to_csv(f"{DATA_DIR}/shipments.csv", index=False)
    return df


# -----------------------------
# 4. INVOICES (10K)
# -----------------------------
def generate_invoices(shipments):
    data = []

    sample = shipments.sample(NUM_INVOICES)

    for i, row in enumerate(sample.iterrows()):
        s = row[1]

        amount = s["transport_cost"] + s["fuel_cost"] + np.random.randint(500, 5000)

        data.append({
            "invoice_id": f"INV{i:05}",
            "shipment_id": s["shipment_id"],
            "customer_id": s["customer_id"],
            "invoice_date": s["shipment_date"],
            "invoice_amount": amount,
            "tax_amount": amount * 0.18,
            "payment_due_date": s["shipment_date"],
            "invoice_status": np.random.choice(
                ["Paid", "Pending", "Overdue", "Disputed"]
            )
        })

    df = pd.DataFrame(data)
    df.to_csv(f"{DATA_DIR}/invoices.csv", index=False)
    return df


# -----------------------------
# 5. CLAIMS (5K)
# -----------------------------
def generate_claims(shipments):
    data = []

    delayed = shipments[shipments["delay_days"] > 5].sample(NUM_CLAIMS)

    for i, row in enumerate(delayed.iterrows()):
        s = row[1]

        data.append({
            "claim_id": f"CL{i:05}",
            "shipment_id": s["shipment_id"],
            "claim_amount": np.random.randint(500, 15000),
            "claim_reason": np.random.choice(
                ["Late Delivery","Damage","Lost Container","Customs Issue"]
            ),
            "claim_status": np.random.choice(
                ["Open","Closed","Under Review"]
            )
        })

    df = pd.DataFrame(data)
    df.to_csv(f"{DATA_DIR}/claims.csv", index=False)
    return df


def generate_payments(invoices):
    data = []

    for i, row in invoices.iterrows():

        invoice_amount = row["invoice_amount"]

        payment_type = np.random.choice(
            ["Full", "Partial", "Failed"],
            p=[0.7, 0.2, 0.1]
        )

        if payment_type == "Full":
            paid_amount = invoice_amount

        elif payment_type == "Partial":
            paid_amount = round(invoice_amount * np.random.uniform(0.3, 0.9), 2)

        else:  # Failed payment
            paid_amount = 0

        data.append({
            "payment_id": f"P{i:06}",
            "invoice_id": row["invoice_id"],
            "payment_date": row["invoice_date"] + pd.Timedelta(days=np.random.randint(1, 45)),
            "payment_amount": paid_amount,
            "payment_method": np.random.choice(["Wire", "Credit Card", "Bank Transfer"]),
            "payment_status": payment_type
        })

    return pd.DataFrame(data)

# -----------------------------
# RUN ALL
# -----------------------------
if __name__ == "__main__":
    customers = generate_customers()
    routes = generate_routes()
    shipments = generate_shipments(customers, routes)
    invoices = generate_invoices(shipments)
    claims = generate_claims(shipments)

    # ✅ FIX: payments generated properly
    payments = generate_payments(invoices)

    customers.to_csv(f"{DATA_DIR}/customers.csv", index=False)
    routes.to_csv(f"{DATA_DIR}/routes.csv", index=False)
    shipments.to_csv(f"{DATA_DIR}/shipments.csv", index=False)
    invoices.to_csv(f"{DATA_DIR}/invoices.csv", index=False)
    claims.to_csv(f"{DATA_DIR}/claims.csv", index=False)
    payments.to_csv(f"{DATA_DIR}/payments.csv", index=False)

    print("DATA GENERATED SUCCESSFULLY")