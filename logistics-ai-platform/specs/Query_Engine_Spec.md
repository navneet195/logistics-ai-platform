# Query Engine Specification

## 1. Overview
The Query Engine is responsible for translating user intent (Natural Language) into structured database queries (SQL).

## 2. Current Implementation: Rule-Based
At present, the engine uses a keyword-mapping strategy:

| Intent | Keywords | Generated SQL |
|--------|----------|---------------|
| Shipments | "shipment", "show" | `SELECT * FROM shipments LIMIT 10` |
| Delays | "delayed", "late" | `SELECT * FROM shipments WHERE delay_days > 0 LIMIT 50` |
| Profitability | "profit", "revenue" | `SELECT * FROM customer_profitability LIMIT 50` |
| Routes | "route", "map" | `SELECT * FROM routes LIMIT 50` |

## 3. Planned Implementation: LLM
The architecture is ready to transition to a Large Language Model (LLM) integration:
1. **Context injection:** Provide database schema to the LLM.
2. **Few-shot prompting:** Provide examples of complex logistics queries.
3. **Guardrails:** Add a validation layer to ensure generated SQL is read-only and safe.

## 4. Execution Pipeline
1. `run_chat(query)` receives user string.
2. `generate_sql(query)` returns the SQL string.
3. `run_sql(sql)` executes via the SQLAlchemy engine.
4. Results are converted to a dictionary/list format for the frontend.
