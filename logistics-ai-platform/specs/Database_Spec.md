# Database Specification

## 1. Overview
The platform uses PostgreSQL as its primary transactional and analytical store. The database is optimized for read-heavy analytical queries spanning 100,000+ shipment records.

## 2. Entity Relationship Diagram (ERD)
The schema consists of 5 core tables and 2 analytical views.

### 2.1 Core Tables
| Table | Description | Primary Key | Foreign Keys |
|-------|-------------|-------------|--------------|
| `customers` | Client company metadata | `customer_id` | - |
| `routes` | Port-to-port shipping routes | `route_id` | - |
| `shipments` | Core logistics transactions | `shipment_id` | `customer_id`, `route_id` |
| `invoices` | Financial records per shipment | `invoice_id` | `shipment_id`, `customer_id` |
| `claims` | Disputed shipments / damage claims | `claim_id` | `shipment_id` |

## 3. Data Dictionary

### 3.1 `shipments` Table
- `shipment_id`: VARCHAR(20) - Unique identifier.
- `customer_id`: VARCHAR(20) - Link to customer table.
- `route_id`: VARCHAR(20) - Link to routes table.
- `shipment_date`: DATE - Origin date.
- `delay_days`: INT - Positive integer for late arrivals.
- `transport_cost`: FLOAT - Base shipping cost.
- `status`: TEXT - Enum: ['Delivered', 'Delayed'].

## 4. Analytical Views
- `customer_profitability`: Aggregates revenue (invoices) vs costs (shipments) per customer.
- `route_performance`: Calculates average delay and shipment volume per port connection.

## 5. Seeding & Generation
- Data is generated using `faker` and `numpy` in Python.
- Volume: 1,000 customers, 50 routes, 100,000 shipments.
- Logic: Delays are weighted according to historical probability distributions.
