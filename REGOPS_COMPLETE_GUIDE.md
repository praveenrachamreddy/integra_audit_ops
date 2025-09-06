# RegOps Platform - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies Used](#technologies-used)
4. [Codebase Structure](#codebase-structure)
5. [Backend (FastAPI API)](#backend-fastapi-api)
6. [Frontend (Next.js)](#frontend-nextjs)
7. [Data Flow](#data-flow)
8. [Deployment Guide](#deployment-guide)
9. [Using RegOps in Your Company](#using-regops-in-your-company)
10. [Customization](#customization)
11. [Integration with Existing Systems](#integration-with-existing-systems)
12. [Training and Adoption](#training-and-adoption)
13. [Monitoring and Maintenance](#monitoring-and-maintenance)
14. [Compliance and Security](#compliance-and-security)
15. [Scaling Considerations](#scaling-considerations)

## Overview

RegOps is an AI-powered compliance automation platform designed to streamline regulatory operations for businesses and regulators. The platform provides a modular backend (FastAPI, Python) and a modern frontend (Next.js) to automate, track, and manage permit applications, audits, and regulatory workflows.

### Key Features
- **Smart Permit Engine:** Accepts project details and documents, analyzes required permits, and automates application submissions and status tracking.
- **Audit Genie:** Processes documents, logs, and data to generate compliance scores, identify issues, and recommend actions.
- **AI Agent Orchestration:** Integrates with Python-based agent frameworks (ADK) and Google Cloud LLMs to provide intelligent, explainable automation and chat-based support.
- **Document Management:** Securely handles uploads, metadata, and AI-driven extraction/validation.
- **Notifications & Reminders:** Sends event-driven email and in-app notifications for status changes, deadlines, and audit completions.
- **Role-Based Access:** Supports users, admins, and regulators with secure authentication and authorization.

### Who is it for?
- **Businesses:** Simplifies compliance, reduces manual paperwork, and accelerates regulatory approvals.
- **Regulators:** Provides dashboards and tools to manage, review, and audit submissions efficiently.

## Architecture

The RegOps platform follows a clean architecture pattern with a clear separation of concerns:

```
Frontend (Next.js) ←→ API (FastAPI) ←→ Database (MongoDB)
                            ↓
                    External Services (AI, Media, Email)
```

### Architecture Components
1. **Frontend Layer:** Next.js React application providing the user interface
2. **API Layer:** FastAPI backend handling business logic and external integrations
3. **Data Layer:** MongoDB database with GridFS for document storage
4. **AI Layer:** Google Cloud Vertex AI and ADK for intelligent processing
5. **External Services:** Tavus for video, ElevenLabs for audio, Mailtrap for email

### Data Flow
1. Users interact with the frontend interface
2. Frontend makes authenticated API calls to the backend
3. Backend processes requests using AI agents and services
4. Data is stored in MongoDB
5. Results are returned to the frontend for display

## Technologies Used

### Backend (API)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT-based auth with email verification
- **AI Integration**: Google Cloud Vertex AI and ADK (Agent Development Kit)
- **External Services**: 
  - Tavus for video conversations
  - ElevenLabs for audio conversations
- **Other**: Redis, Celery, Pydantic, Uvicorn

### Frontend (www)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: Zustand
- **API Communication**: Fetch API with custom client
- **Validation**: Zod, React Hook Form
- **Animations**: Framer Motion

## Codebase Structure

### Backend Directory Structure
```
regops/api/
├── app/
│   ├── agents/              # AI agent orchestrators
│   │   ├── sub_agents/      # Individual AI agents
│   │   └── prompts/         # AI prompt templates
│   ├── api/                 # API endpoints
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/                # Configuration and settings
│   ├── domain/              # Models and schemas
│   │   ├── models/
│   │   └── schemas/
│   ├── infrastructure/      # Database and infrastructure
│   ├── services/            # Business services
│   └── templates/           # Email templates
├── requirements.txt
└── README.md
```

### Frontend Directory Structure
```
regops/www/
├── app/                     # Next.js app router
│   ├── (dashboard)/         # Dashboard pages
│   ├── login/               # Authentication pages
│   └── ...
├── components/              # React components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── lib/                     # Libraries and utilities
│   ├── api/                 # API clients
│   ├── providers/           # React providers
│   ├── store/               # State management
│   └── hooks/               # Custom hooks
├── public/                  # Static assets
└── ...
```

## Backend (FastAPI API)

### Entry Point - main.py
This is the main application entry point that:
- Sets up the FastAPI application with proper configuration
- Initializes MongoDB connection on startup and closes it on shutdown
- Configures CORS for cross-origin requests
- Registers all API routers (auth, health, audit, explain, media)
- Sets up custom OpenAPI schema with JWT Bearer security
- Implements middleware for request logging and global exception handling
- Defines the root endpoint that provides API information

### Configuration - core/config.py
This module handles all application configuration:
- Loads environment variables from `.env` file
- Defines settings for environment, security, database, Redis, email, CORS, logging
- Configures Google Cloud Vertex AI and ADK integration settings
- Sets up API keys for external services (Tavus, ElevenLabs)

### Database Infrastructure - infrastructure/db.py
This module manages the MongoDB connection:
- Uses Motor (async MongoDB driver) for asynchronous operations
- Initializes and closes the database connection
- Provides a dependency for accessing the database in endpoints

### Authentication System - api/v1/endpoints/auth.py
This handles user authentication and authorization:
- User registration with email verification
- Email verification flow with token generation
- Password setup with secure hashing
- JWT-based login with access and refresh tokens
- Token refresh mechanism
- Current user endpoint to get user information

### Authentication Service - services/auth_service.py
This provides utility functions for authentication:
- Password hashing and verification using bcrypt
- JWT token creation (access and refresh tokens)
- Token verification with proper error handling

### Media Endpoints - api/v1/endpoints/media.py
This handles audio/video calling functionality:
- Video conversation endpoint that integrates with Tavus
- Audio conversation endpoint that integrates with ElevenLabs

### Video Orchestrator - agents/video_orchestrator.py
This orchestrates video conversations:
- Loads prompt templates for contextual conversations
- Creates Tavus conversations with proper context
- Handles conversation URLs and error cases

### Tavus Service - services/tavus_service.py
This integrates with the Tavus API:
- Creates video conversations using the Tavus API
- Handles API keys and request formatting
- Properly handles HTTP errors and exceptions

### Audio Orchestrator - agents/audio_orchestrator.py
This orchestrates audio conversations:
- Loads prompt templates for contextual conversations
- Generates configuration for ElevenLabs audio agents

### Audit Endpoints - api/v1/endpoints/audit.py
This handles compliance auditing functionality:
- Audit run endpoint that accepts form data and files
- Audit history endpoint to retrieve past audits
- PDF serving endpoint for audit reports

### Audit Orchestrator - agents/audit_orchestrator.py
This orchestrates the audit process:
- Manages document uploads to GridFS
- Coordinates compliance scanning and remediation
- Generates compliance scores based on severity weights
- Creates PDF reports using ReportLab
- Manages audit history retrieval

### Sub-Agents
- **Compliance Scanner** (`sub_agents/compliance_scanner.py`): Scans documents for compliance issues using AI
- **Remediation Suggestor** (`sub_agents/remediation_suggestor.py`): Suggests remediation steps for compliance issues
- **Report Generator** (`sub_agents/report_generator.py`): Generates PDF and Markdown reports

### ADK Service - services/adk.py
This integrates with Google's Agent Development Kit:
- Manages agent and session lifecycle
- Runs AI agents with proper tools and instructions
- Handles Vertex AI integration

### PDF Tools - services/pdf_tools.py
This handles PDF processing:
- Extracts text content from PDF files
- Generates professional PDF reports using ReportLab
- Manages GridFS storage for documents

## Frontend (Next.js)

### Main Layout - app/layout.tsx
This defines the root layout:
- Sets up metadata for SEO
- Configures theme provider for dark/light mode
- Sets up authentication provider
- Integrates toast notifications

### Dashboard Layout - app/dashboard/layout.tsx
This provides the dashboard layout:
- Implements authentication guard to protect routes
- Sets up navigation bar
- Defines main content area structure

### Dashboard Pages - app/dashboard/[...slug]/page.tsx
This handles dynamic routing for dashboard pages:
- Maps routes to components (overview, audit, assistant, etc.)
- Implements 404 handling for invalid routes

### Authentication Provider - lib/providers/auth-provider.tsx
This manages authentication state:
- Initializes authentication on app load
- Provides loading states during initialization

### Authentication Store - lib/store/auth-store.ts
This manages authentication state with Zustand:
- Handles user login, registration, logout
- Manages authentication status and user data
- Persists authentication state

### Authentication API - lib/api/auth.ts
This handles authentication API calls:
- Registration, email verification, password setup
- Login with JWT token management
- Current user retrieval

### Dashboard Components
- **Overview** (`components/dashboard/dashboard-overview.tsx`): Main dashboard with quick actions
- **Audit Genie** (`components/dashboard/audit-genie-content.tsx`): Compliance auditing interface
- **Assistant** (`components/dashboard/assistant-content.tsx`): Audio/video calling interface
- **QA, Documents, Settings, Help**: Additional dashboard components

### API Services
- **Base Client** (`lib/api/index.ts`): Base API client with token management
- **Media API** (`lib/api/media.ts`): Media-related API calls
- **Audit API** (`lib/api/audit.ts`): Audit-related API calls

## Data Flow

1. **User Authentication**:
   - User registers/logs in through frontend
   - Backend handles authentication and returns JWT tokens
   - Tokens are stored in localStorage and used for subsequent requests

2. **Audio/Video Calling**:
   - User initiates call from dashboard
   - Frontend makes request to backend media endpoints
   - Backend orchestrates with Tavus/ElevenLabs
   - Frontend integrates with SDKs for real-time communication

3. **Compliance Auditing**:
   - User creates audit with documents and parameters
   - Frontend uploads files and form data to backend
   - Backend orchestrates AI agents for compliance scanning
   - Results are processed and PDF reports are generated
   - Frontend displays results and allows report download

4. **Data Storage**:
   - Documents and reports are stored in MongoDB GridFS
   - User data and audit history are stored in MongoDB collections
   - Authentication tokens are managed client-side

## Deployment Guide

### Prerequisites
Before deploying RegOps in your company, ensure you have:
1. **Development Environment**:
   - Python 3.8+ for the backend
   - Node.js 16+ for the frontend
   - MongoDB database (local or cloud)
   - Docker (optional but recommended for deployment)

2. **External Service Accounts**:
   - Google Cloud Platform account for Vertex AI
   - Tavus account for video conversations
   - ElevenLabs account for audio conversations
   - Mailtrap account for email testing (or configure SMTP)

### Environment Configuration

#### Backend Configuration
Create a `.env` file in the `api` directory with your configuration:
```env
# Environment
ENV=production
DEBUG=False
PORT=8000

# Security
SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=regops

# Google Cloud
GCP_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json

# External Services
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA_ID=your_tavus_replica_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
MAILTRAP_API_TOKEN=your_mailtrap_api_token
```

#### Frontend Configuration
Create a `.env.local` file in the `www` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TAVUS_API_KEY=your_tavus_api_key
NEXT_PUBLIC_TAVUS_REPLICA_ID=your_tavus_replica_id
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
```

### Installation and Deployment

#### Backend (FastAPI)
1. Navigate to the `api` directory:
```bash
cd api
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Run the backend:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Frontend (Next.js)
1. Navigate to the `www` directory:
```bash
cd www
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

### Production Deployment

#### Docker Deployment (Recommended)
1. Use the provided Docker files in both `api` and `www` directories
2. Build and run the containers:
```bash
# Backend
cd api
docker build -t regops-api .
docker run -p 8000:8000 regops-api

# Frontend
cd www
docker build -t regops-frontend .
docker run -p 3000:3000 regops-frontend
```

#### Cloud Deployment Options
1. **Google Cloud Platform**:
   - Deploy backend to Google Cloud Run
   - Deploy frontend to Google Cloud Storage or Vercel
   - Use Google Cloud MongoDB Atlas for database

2. **AWS**:
   - Deploy backend to AWS ECS or Elastic Beanstalk
   - Deploy frontend to S3 with CloudFront
   - Use MongoDB Atlas for database

3. **Azure**:
   - Deploy backend to Azure Container Instances
   - Deploy frontend to Azure Static Web Apps
   - Use Azure Cosmos DB for MongoDB

## Using RegOps in Your Company

### Initial Setup and Configuration

#### Prerequisites
Before deploying RegOps in your company, ensure you have:
1. **Development Environment**:
   - Python 3.8+ for the backend
   - Node.js 16+ for the frontend
   - MongoDB database (local or cloud)
   - Docker (optional but recommended for deployment)

2. **External Service Accounts**:
   - Google Cloud Platform account for Vertex AI
   - Tavus account for video conversations
   - ElevenLabs account for audio conversations
   - Mailtrap account for email testing (or configure SMTP)

#### Environment Configuration
1. Create a `.env` file in the `api` directory with your configuration:
```env
# Environment
ENV=production
DEBUG=False
PORT=8000

# Security
SECRET_KEY=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=regops

# Google Cloud
GCP_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/gcp-credentials.json

# External Services
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA_ID=your_tavus_replica_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
MAILTRAP_API_TOKEN=your_mailtrap_api_token
```

2. Create a `.env.local` file in the `www` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_TAVUS_API_KEY=your_tavus_api_key
NEXT_PUBLIC_TAVUS_REPLICA_ID=your_tavus_replica_id
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
```

### Installation and Deployment

#### Backend (FastAPI)
1. Navigate to the `api` directory:
```bash
cd api
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Run the backend:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Frontend (Next.js)
1. Navigate to the `www` directory:
```bash
cd www
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

### Production Deployment

#### Docker Deployment (Recommended)
1. Use the provided Docker files in both `api` and `www` directories
2. Build and run the containers:
```bash
# Backend
cd api
docker build -t regops-api .
docker run -p 8000:8000 regops-api

# Frontend
cd www
docker build -t regops-frontend .
docker run -p 3000:3000 regops-frontend
```

#### Cloud Deployment Options
1. **Google Cloud Platform**:
   - Deploy backend to Google Cloud Run
   - Deploy frontend to Google Cloud Storage or Vercel
   - Use Google Cloud MongoDB Atlas for database

2. **AWS**:
   - Deploy backend to AWS ECS or Elastic Beanstalk
   - Deploy frontend to S3 with CloudFront
   - Use MongoDB Atlas for database

3. **Azure**:
   - Deploy backend to Azure Container Instances
   - Deploy frontend to Azure Static Web Apps
   - Use Azure Cosmos DB for MongoDB

## Customization

### Branding and UI
1. Update the company name and branding in:
   - `www/components/layout/homepage-navbar.tsx`
   - `www/app/layout.tsx` (metadata)
   - `www/components/dashboard/dashboard-overview.tsx`

2. Customize the color scheme in:
   - `www/tailwind.config.ts`
   - `www/components/providers/theme-provider.tsx`

### Compliance Frameworks
1. Update compliance frameworks in:
   - `www/components/dashboard/audit-genie-content.tsx` (auditTypes and controlFamilies)
   - Backend prompt templates in `api/app/agents/prompts/`

2. Add industry-specific compliance rules by:
   - Creating new prompt templates
   - Modifying the control families list
   - Updating the severity scoring system

### User Roles and Permissions
1. Extend user roles in:
   - `api/domain/models/user.py`
   - `api/api/v1/endpoints/auth.py`
   - Frontend components with role-based rendering

2. Add role-based access control:
   - Create middleware for role checking
   - Update API endpoints with role requirements
   - Modify frontend navigation based on user roles

## Integration with Existing Systems

### Document Management Systems
1. Connect to existing document repositories:
   - Implement new endpoints in `api/api/v1/endpoints/documents.py`
   - Add integration services in `api/services/`
   - Update frontend document components

2. Support additional file formats:
   - Extend `api/services/pdf_tools.py` with new parsers
   - Add file type validation in frontend

### Enterprise Authentication
1. Integrate with SSO providers:
   - Add OAuth2/OIDC authentication in `api/services/auth_service.py`
   - Update frontend login components
   - Modify authentication middleware

2. LDAP/Active Directory integration:
   - Implement LDAP authentication service
   - Sync user data with existing directories

### Notification Systems
1. Connect to enterprise communication tools:
   - Add Slack integration in `api/services/notification_service.py`
   - Implement Microsoft Teams webhook integration
   - Add SMS notification capabilities

## Training and Adoption

### User Training
1. Create user documentation:
   - Quick start guides for each feature
   - Video tutorials for complex workflows
   - FAQ for common issues

2. Role-based training programs:
   - Admin training for system management
   - User training for daily operations
   - Compliance officer training for audit features

### Change Management
1. Phased rollout approach:
   - Start with pilot group of users
   - Gather feedback and make improvements
   - Gradually expand to all users

2. Support system:
   - Internal help desk for user support
   - Regular feedback collection
   - Continuous improvement process

## Monitoring and Maintenance

### System Monitoring
1. Implement logging and monitoring:
   - Set up centralized logging with ELK stack or similar
   - Add application performance monitoring (APM)
   - Configure alerting for critical issues

2. Database maintenance:
   - Regular backups of MongoDB data
   - Index optimization for query performance
   - Capacity planning for growing data

### Updates and Upgrades
1. Version control and release management:
   - Use Git for source control
   - Implement CI/CD pipelines
   - Plan regular update schedules

2. Security updates:
   - Monitor for security vulnerabilities
   - Regularly update dependencies
   - Conduct security audits

## Compliance and Security

### Data Protection
1. Implement data encryption:
   - Encrypt data at rest in MongoDB
   - Use HTTPS for all communications
   - Implement field-level encryption for sensitive data

2. Access controls:
   - Regular access reviews
   - Principle of least privilege
   - Audit logging for all access

### Regulatory Compliance
1. Ensure compliance with relevant regulations:
   - GDPR for European users
   - HIPAA for healthcare data
   - SOX for financial data

2. Documentation and audit trails:
   - Maintain detailed audit logs
   - Document compliance processes
   - Regular compliance assessments

## Scaling Considerations

### Performance Optimization
1. Database optimization:
   - Implement proper indexing
   - Use connection pooling
   - Consider database sharding for large datasets

2. API performance:
   - Implement caching for frequently accessed data
   - Optimize AI agent calls
   - Use asynchronous processing for long-running tasks

### Infrastructure Scaling
1. Horizontal scaling:
   - Use load balancers for multiple instances
   - Implement auto-scaling based on demand
   - Use container orchestration (Kubernetes)

2. Geographic distribution:
   - Deploy in multiple regions for global users
   - Use CDNs for static assets
   - Implement database replication