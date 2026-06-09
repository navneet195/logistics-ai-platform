# Backend API Specification

## 1. Stack
- **Framework:** FastAPI (Python 3.12+)
- **Server:** Uvicorn (ASGI)
- **Database Driver:** SQLAlchemy + psycopg2-binary
- **Data Handling:** Pandas (for SQL result serialization)

## 2. API Endpoints

### 2.1 `POST /chat`
Primary entry point for natural language analysis.
- **Request Body:** `{ "message": string }`
- **Logic:** Calls Query Engine → Executes SQL → Returns JSON.
- **Response:**
  ```json
  {
    "sql": "SELECT ...",
    "data": [ ...rows... ]
  }
  ```

### 2.2 `GET /chat/stream`
Server-Sent Events (SSE) endpoint for streaming progress.
- **Parameters:** `message` (string)
- **Response:** `text/event-stream` chunks.

### 2.3 `GET /`
Health check endpoint returning system status and version.

## 3. Core Modules
- `app.core.db`: Manages engine creation and connection pooling.
- `app.services.chat_engine`: Logic for string-to-SQL mapping.
- `app.services.sql_executor`: Safe execution of SQL via Pandas `read_sql`.

## 4. Security
- CORS enabled for specified origins.
- Database credentials managed via `.env` variables.
