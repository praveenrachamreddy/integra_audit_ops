# RegOps AI Suite Backend

## Overview
RegOps is an AI-powered compliance automation platform for streamlining regulatory operations. It features modular backend services (FastAPI, Python), a modern frontend (Next.js), and robust integrations for authentication, permit management, audits, and notifications.

---

## Key Features
- **Authentication & Authorization**: JWT-based, role-based access, email verification, password setup
- **Health Endpoint**: `/api/v1/health` for app and database status
- **Singleton MongoDB Client**: Managed in `infrastructure/db.py` for efficient connection reuse
- **Mailtrap API Integration**: For all transactional emails (no SMTP config)
- **Audit Endpoint**: Run compliance audits and retrieve results via `/api/v1/audit`
- **Clean Code Architecture**: Separation of concerns, modular services, infrastructure, and domain layers
- **OpenAPI/Swagger**: JWT-protected endpoints show lock icon, all endpoints documented

---

## Project Structure
```
regops/api/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── auth.py
│   │           └── health.py
│   ├── core/
│   │   └── config.py
│   ├── domain/
│   │   ├── models/
│   │   │   └── user.py
│   │   └── schemas/
│   │       └── auth.py
│   ├── infrastructure/
│   │   └── db.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── email_service.py
│   ├── templates/
│   │   ├── verification_email.html
│   │   └── password_setup.html
│   └── main.py
├── requirements.txt
└── README.md
```

---

## Setup

1. **Clone the repo and enter the directory**
2. **Create a virtual environment and activate it**
   ```bash
   python -m venv env
   source env/bin/activate  # or env\Scripts\activate on Windows
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Create a `.env` file in `regops/api/`**
   Example:
   ```env
   ENV=development
   DEBUG=True
   PORT=8000
   PROJECT_NAME=RegOps AI Suite
   VERSION=1.0.0
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=regops
   REDIS_URL=redis://localhost:6379
   MAILTRAP_API_TOKEN=your-mailtrap-api-token
   MAILTRAP_SENDER_EMAIL=your-sender@email.com
   MAILTRAP_SENDER_NAME=RegOps AI Suite
   MAILTRAP_INBOX_ID=your-inbox-id  # optional
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]
   LOG_LEVEL=INFO
   ```
5. **Start MongoDB** (locally or via Docker)
6. **Run the app**
   ```bash
   uvicorn app.main:app --reload --port 8000
   # or use your configured port
   uvicorn app.main:app --reload --port $PORT
   ```

---

## Usage
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **Auth Endpoints**: `/api/v1/auth/*` (register, verify-email, set-password, login, refresh, me)
- **Audit Endpoint**: `/api/v1/audit` (run and retrieve compliance audits)

### Audit Endpoint

- **POST /api/v1/audit**
  - **Description:** Run a compliance audit for a given permit or entity.
  - **Auth:** Requires JWT access token (Bearer).
  - **Request Body Example:**
    ```json
    {
      "permit_id": "1234567890abcdef",
      "parameters": {
        "region": "EU",
        "type": "environmental"
      }
    }
    ```
  - **Response Example:**
    ```json
    {
      "audit_id": "audit_abc123",
      "status": "completed",
      "result": {
        "compliant": true,
        "issues": []
      }
    }
    ```
  - **Notes:** Audits may run asynchronously; check status with `GET /api/v1/audit/{audit_id}`.

---

## Clean Code & Architecture Notes
- **main.py**: Only handles app wiring, middleware, router inclusion, and event hooks
- **infrastructure/db.py**: Manages MongoDB client lifecycle and exposes `get_db` dependency
- **services/**: Business logic (auth, email)
- **domain/**: Pydantic models and schemas
- **api/v1/endpoints/**: All API routes, modular and versioned
- **No business or DB logic in main.py**
- **All config from `.env`**

---

## Health Endpoint Example
```json
{
  "status": "ok",
  "database": "ok"
}
```
If the database is unreachable:
```json
{
  "status": "ok",
  "database": "unreachable"
}
```

---

## Troubleshooting
- If health check says `database: unreachable`, ensure MongoDB is running and accessible from your app environment (see README for WSL/Windows tips).
- Always specify `--port` with Uvicorn if you want to override the default 8000.
- All email is sent via Mailtrap API (no SMTP setup required).

---

## Contributing
- Fork, branch, PR. Follow clean code and modularity guidelines. 
