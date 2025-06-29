# RegOps AI Suite Backend

## Overview
The backend for the RegOps AI Suite is an intelligent, multi-agent system built on FastAPI. It leverages a clean architecture to provide robust, scalable, and maintainable services for AI-powered compliance automation. The system includes modular orchestrators for complex tasks like permit analysis, compliance audits, and generating regulatory explanations.

---

## Key Features
- **Authentication & Authorization**: Secure JWT-based auth with email verification.
- **Multi-Agent Orchestrators**: Dedicated orchestrators for `Permit`, `Audit`, and `Explanation` tasks, managing chains of specialized AI agents.
- **Conversational Media Endpoints**:
  - **Tavus Integration**: Generates real-time, context-aware conversational video sessions.
  - **ElevenLabs Integration**: Provides configuration for real-time, conversational audio sessions.
- **Centralized Routing**: All API routes are managed directly in `main.py` for clarity.
- **Singleton MongoDB Client**: Efficiently managed in `infrastructure/db.py`.
- **Comprehensive OpenAPI Docs**: Automatically generated and secured via JWT.

---

## Architecture Diagram

The diagram below illustrates the multi-agent architecture of the RegOps backend, including the flow of requests from the user through the API endpoints to the various orchestrators and external services.

```mermaid
graph TD
    subgraph "User & Client"
        User(["<br/>User<br/>(Browser)"])
    end

    subgraph "RegOps Backend (FastAPI)"
        A[/"CORS Middleware"/] --> B{API Routers}
        
        B -->|/audit| Audit["Audit Orchestrator"]
        B -->|/permit| Permit["Permit Orchestrator"]
        B -->|/explain| Explain["Explanation Orchestrator"]
        B -->|/media| Media["Media Endpoints"]

        Media --> VideoOrchestrator["Video Orchestrator"]
        Media --> AudioOrchestrator["Audio Orchestrator"]
        
        VideoOrchestrator --> TavusClient["Tavus Service"]
        AudioOrchestrator --> C["Config Generation"]

        subgraph "Audit Agents"
            Audit --> AS[Compliance Scanner] & AR[Remediation Suggestor]
        end
        
        subgraph "Permit Agents"
            Permit --> PI[Intent Extractor] & PP[Policy Expert] & PL[Location Agent] & PV[Pre-Submission Validator]
        end
        
        subgraph "Explanation Agents"
            Explain --> EQ[Query Deconstructor] & ER[Regulation Finder] & ES[Synthesizer]
        end

        AS & AR & PI & PP & PL & PV & EQ & ER & ES --> ADK[ADK Service]
        ADK --> VertexAI[("Google Vertex AI")]
        
        TavusClient --> TavusAPI[("Tavus API")]
        C -.-> ClientToldToUse[("ElevenLabs API")]

        Audit & Permit & Explain --> DB[(MongoDB)]
    end

    User -- "HTTPS Request" --> A
    subgraph "External Services"
        VertexAI
        TavusAPI
        ClientToldToUse
        DB
    end

    style User fill:#cde4ff,stroke:#6699ff
    style VertexAI fill:#d4edda,stroke:#155724
    style TavusAPI fill:#d4edda,stroke:#155724
    style ClientToldToUse fill:#fff3cd,stroke:#856404
    style DB fill:#f8d7da,stroke:#721c24
    linkStyle 15 stroke-width:2px,fill:none,stroke:green;
    linkStyle 16 stroke-width:2px,fill:none,stroke:green;
    linkStyle 17 stroke-dasharray: 5 5, stroke-width:2px,fill:none,stroke:orange;
    linkStyle 18 stroke-width:2px,fill:none,stroke:maroon;
```

---

## Setup

1.  **Clone the repo** and navigate to the `regops/api` directory.
2.  **Create and activate a virtual environment**:
    ```bash
    python -m venv env
    source env/bin/activate  # Or `env\Scripts\activate` on Windows
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Create a `.env` file** in the `regops/api` directory. Populate it with your credentials.
    ```env
    # General
    ENV=development
    DEBUG=True
    PORT=8000
    SECRET_KEY=your-super-secret-key
    BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8000

    # Database
    MONGODB_URL=mongodb://localhost:27017
    DATABASE_NAME=regops

    # Google Cloud
    GCP_PROJECT_ID=your-gcp-project-id
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json

    # Media Services
    TAVUS_API_KEY=your_tavus_api_key
    TAVUS_REPLICA_ID=your_tavus_replica_id
    ELEVENLABS_API_KEY=your_elevenlabs_api_key
    ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
    ```
5.  **Run the application**:
    ```bash
    uvicorn app.main:app --reload
    ```

---

## API Usage

Access the interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### Media Endpoints

These endpoints provide configurations for starting real-time conversational media sessions.

#### Start Video Conversation

-   `POST /api/v1/media/video/start_conversation`
-   **Description**: Takes permit details and returns a unique Tavus URL for a real-time video call with a context-aware AI avatar.
-   **Request Body**:
    ```json
    {
      "permit_details": {
        "applicant_name": "EcoBuild Corp",
        "project_type": "New Commercial Building",
        "status": "Pending Review"
      }
    }
    ```
-   **Success Response (200)**:
    ```json
    {
      "conversation_url": "https://tavus.daily.co/c123456..."
    }
    ```

#### Get Audio Conversation Config

-   `POST /api/v1/media/audio/start_conversation`
-   **Description**: Takes permit details and returns the necessary configuration for a client to establish a WebSocket connection with a context-aware ElevenLabs audio agent.
-   **Request Body**:
    ```json
    {
      "permit_details": {
        "applicant_name": "EcoBuild Corp",
        "project_type": "New Commercial Building",
        "status": "Pending Review"
      }
    }
    ```
-   **Success Response (200)**:
    ```json
    {
      "agent_id": "your_elevenlabs_agent_id",
      "prompt": "You are an expert AI assistant for RegOps... Here is the permit information: ..."
    }
    ```

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

## Architecture Diagram

Below is the architecture for the RegOps AI Suite. You can copy this Mermaid code into any Mermaid-compatible markdown viewer or the [Mermaid Live Editor](https://mermaid.live) to visualize and download the diagram.

```mermaid
flowchart TD
  %% Users
  subgraph Users
    U1["Compliance Officer"]
    U2["Business User"]
  end

  %% Frontend
  FE["Frontend (Next.js)\n[Vercel/GCP Hosting]"]

  %% API Backend
  API["Backend API (FastAPI)\n[GCP VM / Cloud Run]"]

  %% Database
  DB["MongoDB\n[Atlas/Managed]"]

  %% Email
  EMAIL["Email Service\n(Mailtrap/SMTP)"]

  %% AI Agents
  AGENTS["AI Agents\n(Python modules)"]

  %% Google Cloud AI
  GCP["Google Cloud AI APIs\n(Vertex AI, DocAI, etc.)"]

  %% Monitoring
  MON["Monitoring & Logging\n(GCP Ops, Sentry, etc.)"]

  %% CDN
  CDN["CDN/Static Assets\n(Vercel/GCP Storage)"]

  %% Secrets
  SECRETS["Secrets & Config\n(.env, GCP creds)"]

  %% Connections
  U1 -->|"HTTPS"| FE
  U2 -->|"HTTPS"| FE
  FE -->|"REST API (HTTPS)"| API
  FE -->|"Static Assets"| CDN
  API -->|"DB Ops"| DB
  API -->|"Email"| EMAIL
  API -->|"AI Tasks"| AGENTS
  AGENTS -->|"Cloud AI API"| GCP
  API -->|"Monitoring"| MON
  API <--> SECRETS
  AGENTS <--> SECRETS
  API -->|"Health Check"| MON

  classDef cloud fill:#e3f2fd,stroke:#2196f3,stroke-width:2px;
  class GCP,CDN,MON cloud;
```

**How it works:**
- Users interact with the Next.js frontend, which communicates with the FastAPI backend via secure REST APIs.
- The backend handles business logic, authentication, and orchestrates AI agents for compliance tasks.
- MongoDB stores all persistent data.
- Email notifications are sent via Mailtrap or SMTP.
- AI agents interact with Google Cloud AI APIs for advanced document and language processing.
- All secrets and configuration are managed securely.
- Monitoring and health checks are integrated for observability.
- Static assets are served via CDN for fast, global access. 