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