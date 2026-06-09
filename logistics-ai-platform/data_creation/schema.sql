DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    customer_name TEXT,
    industry TEXT,
    country TEXT,
    region TEXT,
    risk_score INT,
    credit_limit NUMERIC
);

CREATE TABLE routes (
    route_id VARCHAR(20) PRIMARY KEY,
    origin_port TEXT,
    destination_port TEXT,
    distance_km INT,
    avg_transit_days INT
);

CREATE TABLE shipments (
    shipment_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20),
    route_id VARCHAR(20),
    shipment_date DATE,
    expected_delivery DATE,
    actual_delivery DATE,
    container_count INT,
    weight_tons FLOAT,
    transport_cost FLOAT,
    fuel_cost FLOAT,
    storage_cost FLOAT,
    delay_days INT,
    status TEXT
);

CREATE TABLE invoices (
    invoice_id VARCHAR(20) PRIMARY KEY,
    shipment_id VARCHAR(20),
    customer_id VARCHAR(20),
    invoice_date DATE,
    invoice_amount FLOAT,
    tax_amount FLOAT,
    payment_due_date DATE,
    invoice_status TEXT
);

CREATE TABLE claims (
    claim_id VARCHAR(20) PRIMARY KEY,
    shipment_id VARCHAR(20),
    claim_amount FLOAT,
    claim_reason TEXT,
    claim_status TEXT
);