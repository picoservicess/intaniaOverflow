#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
BUILD_IMAGES=true
DEPLOY_K8S=true

# Function to print usage
print_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --skip-build     Skip building images"
    echo "  --skip-deploy    Skip kubernetes deployment"
    echo "  -h, --help       Show this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            BUILD_IMAGES=false
            shift
            ;;
        --skip-deploy)
            DEPLOY_K8S=false
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# Array of services
services=(
    "asset-service"
    "notification-service"
    "reply-service"
    "thread-service"
    "user-service"
    "voting-service"
    "api-gateway"
)

# Function to build Docker images
build_images() {
    echo -e "${BLUE}Building Docker images...${NC}"
    
    for service in "${services[@]}"; do
        echo -e "${YELLOW}Building ${service}...${NC}"
        docker build -t "${service}:latest" -f "./${service}/Dockerfile" .
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Successfully built ${service}${NC}"
        else
            echo -e "${RED}✗ Failed to build ${service}${NC}"
            exit 1
        fi
        echo "-----------------------------------"
    done
}

# Function to update kubernetes manifests with local image names
update_image_names() {
    echo -e "${BLUE}Updating image names in Kubernetes manifests...${NC}"
    
    for service in "${services[@]}"; do
        manifest_file="k8s/${service}/${service}-deployment.yaml"
        if [ -f "$manifest_file" ]; then
            # Use sed to update image name to use local image
            sed -i "s|image: .*${service}:.*|image: ${service}:latest|g" "$manifest_file"
            # Add imagePullPolicy: Never to use local images
            if ! grep -q "imagePullPolicy: Never" "$manifest_file"; then
                sed -i "/image: ${service}:latest/a\          imagePullPolicy: Never" "$manifest_file"
            fi
            echo -e "${GREEN}✓ Updated image configuration in $manifest_file${NC}"
        else
            echo -e "${RED}✗ Manifest file $manifest_file not found${NC}"
            exit 1
        fi
    done
}

# Function to apply manifest and check status
apply_manifest() {
    local manifest=$1
    echo -e "${BLUE}Applying $manifest...${NC}"
    kubectl apply -f "k8s/$manifest"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully applied $manifest${NC}"
    else
        echo -e "${RED}✗ Failed to apply $manifest${NC}"
        exit 1
    fi
    echo "-----------------------------------"
}

# Function to wait for deployment
wait_for_deployment() {
    local deployment=$1
    echo -e "${BLUE}Waiting for deployment $deployment to be ready...${NC}"
    kubectl wait --for=condition=available deployment/$deployment --timeout=120s
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Deployment $deployment is ready${NC}"
    else
        echo -e "${RED}✗ Deployment $deployment failed to become ready${NC}"
        kubectl describe deployment "$deployment"
        kubectl get pods -l app="$deployment"
        exit 1
    fi
    echo "-----------------------------------"
}

# Build images if not skipped
if [ "$BUILD_IMAGES" = true ]; then
    build_images
    update_image_names
fi

# Deploy to Kubernetes if not skipped
if [ "$DEPLOY_K8S" = true ]; then
    # Create namespace if it doesn't exist
    echo -e "${BLUE}Creating namespace intania-overflow if it doesn't exist...${NC}"
    kubectl create namespace intania-overflow --dry-run=client -o yaml | kubectl apply -f -
    echo "-----------------------------------"

    # Switch to the namespace
    kubectl config set-context --current --namespace=intania-overflow

    # Apply ConfigMap
    echo -e "${BLUE}Applying ConfigMap...${NC}"
    apply_manifest "configmap.yaml"

    # Apply PostgreSQL
    echo -e "${BLUE}Applying PostgreSQL...${NC}"
    apply_manifest "postgres/postgres-deployment.yaml"
    apply_manifest "postgres/postgres-service.yaml"
    kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

    # Apply RabbitMQ
    echo -e "${BLUE}Applying RabbitMQ...${NC}"
    apply_manifest "rabbitmq/rabbitmq-deployment.yaml"
    apply_manifest "rabbitmq/rabbitmq-service.yaml"
    wait_for_deployment "rabbitmq"

    # Apply microservices
    echo -e "${BLUE}Applying microservices...${NC}"
    for service in "${services[@]}"; do
        if [ "$service" != "api-gateway" ]; then
            apply_manifest "${service}/${service}-deployment.yaml"
            apply_manifest "${service}/${service}-service.yaml"
            wait_for_deployment "$service"
        fi
    done

    # Apply API Gateway last
    echo -e "${BLUE}Applying API Gateway...${NC}"
    apply_manifest "api-gateway/api-gateway-deployment.yaml"
    apply_manifest "api-gateway/api-gateway-service.yaml"
    wait_for_deployment "api-gateway"

    echo -e "${GREEN}All manifests have been applied successfully!${NC}"

    # Display the status of all resources
    echo -e "${BLUE}Current status of all resources:${NC}"
    echo "-----------------------------------"
    echo -e "${BLUE}Pods:${NC}"
    kubectl get pods
    echo "-----------------------------------"
    echo -e "${BLUE}Services:${NC}"
    kubectl get services
    echo "-----------------------------------"
    echo -e "${BLUE}Deployments:${NC}"
    kubectl get deployments
    echo "-----------------------------------"
    echo -e "${BLUE}StatefulSets:${NC}"
    kubectl get statefulsets
fi