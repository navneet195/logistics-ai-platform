# 🚢 Logistics AI Platform

> **Developer Docs:** [Software Design Description (SDD)](./specs/SDD.md)

A full-stack AI-powered logistics analytics platform that lets you query a PostgreSQL database of **100,000+ shipments** using plain English. Type a question, the backend converts it to SQL, executes it, and the frontend renders the results in a beautiful dark-mode table.

---

## 📁 Project Structure

```
logistics-ai-platform/
├── backend/                     # FastAPI Python backend
│   ├── .env                     # DB connection string
│   ├── requirements.txt         # Python dependencies
│   ├── .venv/                   # Python virtual environment
│   └── app/
│       ├── main.py              # FastAPI app entrypoint + CORS
│       ├── api/
│       │   └── routes_chat.py   # POST /chat and GET /chat/stream
│       ├── core/
│       │   ├── config.py        # Settings (reads .env)
│       │   └── db.py            # SQLAlchemy engine
│       ├── services/
│       │   ├── chat_engine.py   # NL → SQL rule engine (LLM-ready)
│       │   └── sql_executor.py  # Executes SQL via pandas
│       └── utils/
│           └── stream.py        # SSE streaming utility
│
├── data_creation/               # Data generation & DB seeding
│   ├── config.py                # DB config + data volume settings
│   ├── db.py                    # SQLAlchemy engine for seeding
│   ├── generate_data.py         # Generates CSV data with Faker/NumPy
│   ├── seed_db.py               # Loads CSVs → PostgreSQL
│   ├── schema.sql               # Table DDL (customers, routes, shipments…)
│   ├── analytics_views.sql      # SQL views (customer_profitability, route_perf)
│   └── data/                   # Generated CSV files (gitignored)
│
└── frontend/
    └── frontend/                # Vite + React frontend (the runnable app)
        ├── index.html
        ├── vite.config.js
        ├── package.json
        └── src/
            ├── main.jsx         # React root mount
            ├── index.css        # Full design system (dark mode, vars)
            ├── App.css          # Minimal reset
            └── App.jsx          # Complete app: Sidebar + Chat + SQL table
```

---

## 🗄️ Database Schema

| Table | Rows | Description |
|-------|------|-------------|
| `customers` | 1,000 | Company name, industry, country, region, risk score, credit limit |
| `routes` | 50 | Origin/destination ports, distance, avg transit days |
| `shipments` | 100,000 | Costs, delays, status (Delivered / Delayed) |
| `invoices` | 10,000 | Invoice amount, tax, status (Paid / Pending / Overdue / Disputed) |
| `claims` | 5,000 | Claim amount, reason, status (Open / Closed / Under Review) |

**Views:**
- `customer_profitability` — revenue, cost, profit per customer
- `route_performance` — shipment count and avg delay per route

---

## 🚀 Quick Start

### Prerequisites

- **PostgreSQL** running locally (`psql -d logistics_db` should work)
- **Python 3.11+** with virtual environment
- **Node.js 18+** with npm

---

### 1. Database (already set up ✅)

The database `logistics_db` is already seeded with 100K+ records. To verify:

```bash
psql -d logistics_db -c "SELECT COUNT(*) FROM shipments;"
# Should return: 100000
```

To re-seed from scratch (optional):

```bash
cd data_creation
pip install -r requirements.txt
python generate_data.py    # generates CSV files
python seed_db.py          # loads CSVs into PostgreSQL
psql -d logistics_db -f analytics_views.sql  # creates views
```

---

### 2. Backend

```bash
cd backend

# Activate virtual environment
source .venv/bin/activate

# Install dependencies (first time)
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**

**Verify:**
```bash
curl http://localhost:8000/
# {"status":"ok","message":"Logistics AI Platform is running"}

curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show delayed shipments"}'
```

---

### 3. Frontend

```bash
cd frontend/frontend

# Install dependencies (first time)
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Reference

### `POST /chat`

Accepts a natural language query and returns SQL + data.

**Request:**
```json
{ "message": "show me all delayed shipments" }
```

**Response:**
```json
{
  "sql": "SELECT * FROM shipments WHERE delay_days > 0 LIMIT 50",
  "data": [
    {
      "shipment_id": "S000003",
      "customer_id": "C00042",
      "delay_days": 5,
      "status": "Delayed",
      ...
    }
  ]
}
```

### `GET /chat/stream?message=<query>`

Server-Sent Events (SSE) stream of the response text word-by-word.

---

## 🧠 Query Engine

The current engine is **rule-based** (no LLM required to run):

| Keyword in query | Generated SQL |
|-----------------|---------------|
| `delayed` | `SELECT * FROM shipments WHERE delay_days > 0 LIMIT 50` |
| `profit` | `SELECT customer_id, SUM(costs) FROM shipments GROUP BY customer_id` |
| *(anything else)* | `SELECT * FROM shipments LIMIT 10` |

### Upgrading to LLM

Edit `backend/app/services/chat_engine.py` — replace `generate_sql()` with an OpenAI / Gemini API call:

```python
import openai

def generate_sql(user_query: str) -> str:
    schema = """
    Tables: customers, routes, shipments, invoices, claims
    shipments: shipment_id, customer_id, route_id, delay_days, transport_cost, status...
    """
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a SQL expert. Schema:\n{schema}\nReturn only the SQL query."},
            {"role": "user", "content": user_query}
        ]
    )
    return response.choices[0].message.content.strip()
```

---

## 🎨 Frontend Features

- **Dual-Theme Support** — Toggle between premium Dark mode and clean Light mode
- **Professional SVG Icons** — Replaced emojis with industry-standard vector icons
- **Session Sidebar** — Tracks multiple analysis sessions
- **Auto-growing Textarea** — Shift+Enter for new lines
- **SQL Code Display** — Shows the generated query in a syntax-highlighted box
- **Smart Result Table** — Status chips, sticky header, and scrollable containers
- **Typing Indicator** — Micro-animations for improved UX
- **Actionable Suggestions** — One-click queries for common logistics questions

---

## ⚙️ Configuration

### Backend `.env`

```env
DB_URL=postgresql://navnitbaldha@localhost:5432/logistics_db
```

Change `navnitbaldha` to your local PostgreSQL username if needed.

### Data Volume (`data_creation/config.py`)

```python
NUM_CUSTOMERS  = 1000
NUM_ROUTES     = 50
NUM_SHIPMENTS  = 100000   # 100K rows
NUM_INVOICES   = 10000
NUM_CLAIMS     = 5000
```

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `psycopg2.OperationalError` | Check DB_URL in `.env` — username must match your local postgres user |
| `ModuleNotFoundError: pandas` | Run `pip install -r requirements.txt` inside `backend/` |
| Frontend shows "backend error" | Make sure `uvicorn app.main:app --reload` is running on port 8000 |
| CORS error in browser | Already handled — `CORSMiddleware` allows `*` origins |
| `relation "shipments" does not exist` | Re-run `python seed_db.py` from `data_creation/` |
| Empty frontend page | Ensure you're running `npm run dev` from `frontend/frontend/` (nested folder) |

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `fastapi` | Web framework |
| `uvicorn` | ASGI server |
| `sqlalchemy` | DB ORM / connection |
| `psycopg2-binary` | PostgreSQL driver |
| `pandas` | SQL result → Python dict |
| `python-dotenv` | Load `.env` file |
| `pydantic` | Request validation |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `vite` | Build tool / dev server |
| `@vitejs/plugin-react` | JSX transform |

> No axios, no uuid, no idb — uses native `fetch()` and `crypto.randomUUID()` for zero extra dependencies.

---

## 🗺️ Roadmap

- [ ] LLM-powered SQL generation (OpenAI / Gemini)
- [ ] Chart visualizations (bar, line, pie via Recharts)
- [ ] IndexedDB session persistence across browser refreshes
- [ ] Authentication & multi-user support
- [ ] Export results to CSV / Excel
- [ ] Streaming SQL results via SSE

---

## 📄 License

MIT — free to use and modify.
