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