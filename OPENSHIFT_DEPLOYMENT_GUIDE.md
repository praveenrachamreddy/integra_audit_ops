# IntegraOps OpenShift Deployment Guide

## Overview
This guide provides instructions for building OpenShift-compatible Docker images for IntegraOps and deploying them to your OpenShift cluster using your Gemini API key for AI capabilities.

## Prerequisites
1. OpenShift CLI (oc) installed and configured
2. Docker installed locally
3. Access to your OpenShift cluster
4. Gemini API key
5. MongoDB connection details

## 1. Backend Docker Image (FastAPI)

### Dockerfile for Backend (api/Dockerfile.openshift)
```dockerfile
# Use Red Hat Universal Base Image for OpenShift compatibility
FROM registry.access.redhat.com/ubi8/python-39:latest

# Set working directory
WORKDIR /app

# Install system dependencies
RUN dnf update -y && \
    dnf install -y gcc python3-devel && \
    dnf clean all

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for OpenShift security compliance
RUN adduser -D -s /bin/sh -u 1001 integra && \
    chown -R 1001:0 /app && \
    chmod -R g+w /app

USER 1001

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### OpenShift Deployment for Backend (api/openshift-backend.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: integraops-backend
  labels:
    app: integraops
    component: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: integraops
      component: backend
  template:
    metadata:
      labels:
        app: integraops
        component: backend
    spec:
      containers:
      - name: backend
        image: image-registry.openshift-image-registry.svc:5000/integraops/integraops-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENV
          value: "production"
        - name: DEBUG
          value: "False"
        - name: PORT
          value: "8000"
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: secret-key
        - name: ACCESS_TOKEN_EXPIRE_MINUTES
          value: "30"
        - name: REFRESH_TOKEN_EXPIRE_DAYS
          value: "7"
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: mongodb-url
        - name: DATABASE_NAME
          value: "integraops"
        - name: GCP_PROJECT_ID
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: gcp-project-id
        - name: GOOGLE_APPLICATION_CREDENTIALS
          value: "/etc/gcp/credentials.json"
        - name: VERTEX_MODEL_NAME
          value: "gemini-1.5-pro-001"
        - name: ADK_MODEL_NAME
          value: "gemini-2.0-flash"
        - name: TAVUS_API_KEY
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: tavus-api-key
        - name: TAVUS_REPLICA_ID
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: tavus-replica-id
        - name: ELEVENLABS_API_KEY
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: elevenlabs-api-key
        - name: ELEVENLABS_AGENT_ID
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: elevenlabs-agent-id
        - name: MAILTRAP_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: mailtrap-api-token
        volumeMounts:
        - name: gcp-credentials
          mountPath: /etc/gcp
          readOnly: true
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 30
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      volumes:
      - name: gcp-credentials
        secret:
          secretName: gcp-credentials
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
---
apiVersion: v1
kind: Service
metadata:
  name: integraops-backend
  labels:
    app: integraops
    component: backend
spec:
  selector:
    app: integraops
    component: backend
  ports:
  - port: 8000
    targetPort: 8000
  type: ClusterIP
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: integraops-backend
  labels:
    app: integraops
    component: backend
spec:
  host: integraops-backend-integraops.apps.your-cluster-domain.com
  to:
    kind: Service
    name: integraops-backend
  port:
    targetPort: 8000
  tls:
    termination: edge
```

## 2. Frontend Docker Image (Next.js)

### Dockerfile for Frontend (www/Dockerfile.openshift)
```dockerfile
# Use Red Hat Universal Base Image for builder
FROM registry.access.redhat.com/ubi8/nodejs-18:latest AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:latest

# Set working directory
WORKDIR /app

# Create non-root user for OpenShift security compliance
RUN adduser -D -s /bin/sh -u 1001 integra && \
    chown -R 1001:0 /app && \
    chmod -R g+w /app

USER 1001

# Copy built application from builder stage
COPY --from=builder --chown=1001:0 /app/.next ./.next
COPY --from=builder --chown=1001:0 /app/node_modules ./node_modules
COPY --from=builder --chown=1001:0 /app/public ./public
COPY --from=builder --chown=1001:0 /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Run application
CMD ["npm", "start"]
```

### OpenShift Deployment for Frontend (www/openshift-frontend.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: integraops-frontend
  labels:
    app: integraops
    component: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: integraops
      component: frontend
  template:
    metadata:
      labels:
        app: integraops
        component: frontend
    spec:
      containers:
      - name: frontend
        image: image-registry.openshift-image-registry.svc:5000/integraops/integraops-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://integraops-backend-integraops.apps.your-cluster-domain.com"
        - name: NEXT_PUBLIC_COMPANY_NAME
          value: "Integra"
        - name: NEXT_PUBLIC_PLATFORM_NAME
          value: "IntegraOps"
        - name: NEXT_PUBLIC_TAVUS_API_KEY
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: tavus-api-key
        - name: NEXT_PUBLIC_TAVUS_REPLICA_ID
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: tavus-replica-id
        - name: NEXT_PUBLIC_ELEVENLABS_AGENT_ID
          valueFrom:
            secretKeyRef:
              name: integraops-secrets
              key: elevenlabs-agent-id
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 30
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
---
apiVersion: v1
kind: Service
metadata:
  name: integraops-frontend
  labels:
    app: integraops
    component: frontend
spec:
  selector:
    app: integraops
    component: frontend
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: integraops-frontend
  labels:
    app: integraops
    component: frontend
spec:
  host: integraops-frontend-integraops.apps.your-cluster-domain.com
  to:
    kind: Service
    name: integraops-frontend
  port:
    targetPort: 3000
  tls:
    termination: edge
```

## 3. Secrets Configuration

### Create Secrets File (secrets.yaml)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: integraops-secrets
type: Opaque
data:
  # Generate these values with: echo -n "your-value" | base64
  secret-key: eW91ci1zdXBlci1zZWNyZXQta2V5LWNoYW5nZS1pbi1wcm9kdWN0aW9u
  mongodb-url: bW9uZ29kYjovL2xvY2FsaG9zdDoyNzAxNw==
  gcp-project-id: eW91ci1nY3AtcHJvamVjdC1pZA==
  tavus-api-key: eW91ci10YXZ1cy1hcGkta2V5
  tavus-replica-id: eW91ci10YXZ1cy1yZXBsaWNhLWlk
  elevenlabs-api-key: eW91ci1lbGV2ZW5sYWJzLWFwaS1rZXk=
  elevenlabs-agent-id: eW91ci1lbGV2ZW5sYWJzLWFnZW50LWlk
  mailtrap-api-token: eW91ci1tYWlsdHJhcC1hcGktdG9rZW4=
---
apiVersion: v1
kind: Secret
metadata:
  name: gcp-credentials
type: Opaque
data:
  credentials.json: e30=  # Base64 encoded GCP service account key
```

## 4. Build and Deployment Scripts

### Build Script (build-images.sh)
```bash
#!/bin/bash

# Build and push backend image
echo "Building backend image..."
docker build -f api/Dockerfile.openshift -t integraops-backend:latest api/

echo "Tagging backend image for OpenShift..."
docker tag integraops-backend:latest image-registry.openshift-image-registry.svc:5000/integraops/integraops-backend:latest

# Build and push frontend image
echo "Building frontend image..."
docker build -f www/Dockerfile.openshift -t integraops-frontend:latest www/

echo "Tagging frontend image for OpenShift..."
docker tag integraops-frontend:latest image-registry.openshift-image-registry.svc:5000/integraops/integraops-frontend:latest

echo "Images built successfully!"
```

### Deploy Script (deploy-openshift.sh)
```bash
#!/bin/bash

# Login to OpenShift cluster (if needed)
# oc login --token=YOUR_TOKEN --server=YOUR_SERVER

# Create project if it doesn't exist
echo "Creating OpenShift project..."
oc new-project integraops || echo "Project already exists"

# Create secrets
echo "Creating secrets..."
oc apply -f secrets.yaml

# Replace GCP credentials with actual values
# echo "Updating GCP credentials secret..."
# oc patch secret gcp-credentials -p='{"data":{"credentials.json":"$(echo -n 'ACTUAL_GCP_CREDENTIALS_JSON' | base64)"}}'

# Deploy backend
echo "Deploying backend..."
oc apply -f api/openshift-backend.yaml

# Deploy frontend
echo "Deploying frontend..."
oc apply -f www/openshift-frontend.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
oc rollout status deployment/integraops-backend
oc rollout status deployment/integraops-frontend

echo "Deployment completed!"
echo "Backend URL: https://integraops-backend-integraops.apps.your-cluster-domain.com"
echo "Frontend URL: https://integraops-frontend-integraops.apps.your-cluster-domain.com"
```

## 5. Gemini Integration Configuration

### Update Backend Configuration for Gemini (api/app/core/config.py additions)
```python
# Add these to the Settings class in config.py
class Settings(BaseSettings):
    # ... existing settings ...
    
    # Gemini-specific settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-pro-001")
    GEMINI_MAX_OUTPUT_TOKENS: int = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", 2048))
    GEMINI_TEMPERATURE: float = float(os.getenv("GEMINI_TEMPERATURE", 0.7))
    
    # ADK configuration for Gemini
    GOOGLE_GENAI_USE_VERTEX: bool = os.getenv("GOOGLE_GENAI_USE_VERTEX", "True").lower() == "true"
    VERTEX_MODEL_NAME: str = os.getenv("VERTEX_MODEL_NAME", "gemini-1.5-pro-001")
    ADK_MODEL_NAME: str = os.getenv("ADK_MODEL_NAME", "gemini-2.0-flash")
```

### Create Gemini Service (api/app/services/gemini_service.py)
```python
import os
import google.generativeai as genai
from app.core.config import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL_NAME
        self.max_output_tokens = settings.GEMINI_MAX_OUTPUT_TOKENS
        self.temperature = settings.GEMINI_TEMPERATURE
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
    
    async def generate_content(self, prompt: str, **kwargs) -> str:
        """Generate content using Gemini API"""
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not configured")
            
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=self.max_output_tokens,
                    temperature=self.temperature,
                    **kwargs
                )
            )
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    def is_configured(self) -> bool:
        """Check if Gemini service is properly configured"""
        return bool(self.api_key)

gemini_service = GeminiService()
```

### Update ADK Client to Use Gemini (api/app/services/adk.py modifications)
```python
# Add Gemini service import
from app.services.gemini_service import gemini_service

# Modify the run_agent method in ADKClient class
async def run_agent(self, agent_name: str, data: dict, user_id: str, session_id: str, tools: list = None, instruction: str = None) -> dict:
    # Ensure session asynchronously before running agent
    await self.ensure_session(user_id, session_id)

    # Use provided tools or default to google_search
    agent_tools = tools if tools is not None else [google_search]
    
    # Use provided instruction or a default one
    agent_instruction = instruction if instruction is not None else "You are a helpful assistant."

    # Check if we should use Gemini directly instead of Vertex AI
    if gemini_service.is_configured() and settings.GOOGLE_GENAI_USE_VERTEX == False:
        # Use Gemini API directly
        prompt = getattr(data, "prompt", None)
        if prompt is None and isinstance(data, dict):
            prompt = data.get("prompt")
        if prompt is None:
            prompt = str(data)
        
        try:
            result = await gemini_service.generate_content(
                f"{agent_instruction}\n\n{prompt}"
            )
            return {"result": result}
        except Exception as e:
            print(f"Gemini service error: {e}")
            # Fall back to Vertex AI if Gemini fails
    
    # Existing Vertex AI code
    agent = LlmAgent(
        name=agent_name,
        model=self.model,
        instruction=agent_instruction,
        tools=agent_tools,
    )
    prompt = getattr(data, "prompt", None)
    if prompt is None and isinstance(data, dict):
        prompt = data.get("prompt")
    if prompt is None:
        prompt = str(data)
    prompt = str(prompt)
    logger.data({"prompt": prompt})
    content = Content(role="user", parts=[Part(text=prompt)])
    runner = Runner(agent=agent, app_name=self.app_name, session_service=self.session_service)
     # ✅ Use synchronous generator instead of `run_async`
    events = runner.run(user_id=user_id, session_id=session_id, new_message=content)

    final_response = None
    for event in events:
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    final_response = part.text
    return {"result": final_response}
```

## 6. Deployment Steps

### Step 1: Prepare Your Environment
1. Ensure you have access to your OpenShift cluster
2. Install OpenShift CLI (oc) if not already installed
3. Log in to your OpenShift cluster:
```bash
oc login --token=YOUR_TOKEN --server=YOUR_SERVER
```

### Step 2: Update Configuration
1. Update the secret values in `secrets.yaml` with your actual values
2. Replace the GCP credentials with your service account key
3. Update the route hostnames in the YAML files to match your cluster domain

### Step 3: Build Docker Images
```bash
# Make scripts executable
chmod +x build-images.sh
chmod +x deploy-openshift.sh

# Build images
./build-images.sh
```

### Step 4: Push Images to OpenShift Registry
```bash
# Login to OpenShift registry
oc registry login

# Push images
docker push image-registry.openshift-image-registry.svc:5000/integraops/integraops-backend:latest
docker push image-registry.openshift-image-registry.svc:5000/integraops/integraops-frontend:latest
```

### Step 5: Deploy to OpenShift
```bash
# Deploy the application
./deploy-openshift.sh
```

### Step 6: Configure Gemini API Key
1. Encode your Gemini API key:
```bash
echo -n "your-gemini-api-key" | base64
```

2. Update the secrets:
```bash
oc patch secret integraops-secrets -p='{"data":{"gemini-api-key":"YOUR_BASE64_ENCODED_KEY"}}'
```

3. Restart the backend deployment:
```bash
oc rollout restart deployment/integraops-backend
```

## 7. Verification

### Check Deployment Status
```bash
# Check pods
oc get pods

# Check services
oc get services

# Check routes
oc get routes

# Check logs
oc logs deployment/integraops-backend
oc logs deployment/integraops-frontend
```

### Test the Application
1. Visit the frontend URL in your browser
2. Try creating a user account and logging in
3. Test the audit functionality with sample documents
4. Verify that the AI features are working (assistant, QA, etc.)

## 8. Troubleshooting

### Common Issues and Solutions

1. **Permission denied errors**:
   - Ensure your user has proper permissions in the OpenShift cluster
   - Check that the project exists and you have access to it

2. **Image pull errors**:
   - Verify that images were pushed to the OpenShift registry correctly
   - Check the image names and tags in the deployment YAML files

3. **Gemini API issues**:
   - Verify that your Gemini API key is valid and has proper permissions
   - Check that the key is correctly encoded in the secrets

4. **Database connection issues**:
   - Ensure MongoDB is accessible from the OpenShift cluster
   - Verify the MongoDB URL in the secrets

This deployment guide provides everything you need to deploy IntegraOps to your OpenShift cluster using your Gemini API key for AI capabilities. The images are built with OpenShift security requirements in mind, using non-root users and proper security contexts.