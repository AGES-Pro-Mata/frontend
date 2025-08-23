#!/bin/bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration
ENVIRONMENT="${ENVIRONMENT:-development}"
DOCKER_BUILD="${DOCKER_BUILD:-false}"
NODE_VERSION="22.12.0"

# Environment variables for Vite
VITE_API_URL="${VITE_API_URL:-http://localhost:8080/api}"
VITE_APP_ENV="${VITE_APP_ENV:-$ENVIRONMENT}"
VITE_APP_VERSION="${VITE_APP_VERSION:-$(git rev-parse --short HEAD 2>/dev/null || echo 'local')}"
VITE_BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

export VITE_API_URL VITE_APP_ENV VITE_APP_VERSION VITE_BUILD_DATE

print_status "Starting build process..."
print_status "Environment: $ENVIRONMENT"
print_status "Node version requirement: $NODE_VERSION"
print_status "Vite API URL: $VITE_API_URL"

# Verify Node version
check_node_version() {
    local current_version
    current_version=$(node --version | sed 's/v//')
    local required_major=$(echo "$NODE_VERSION" | cut -d. -f1)
    local current_major=$(echo "$current_version" | cut -d. -f1)
    
    if [ "$current_major" -lt "$required_major" ]; then
        print_error "Node.js $required_major+ required, found $current_version"
        exit 1
    fi
    print_success "Node.js version check passed: $current_version"
}

# Clean previous builds
clean_build() {
    print_status "Cleaning previous build artifacts..."
    rm -rf dist/
    rm -rf node_modules/.vite/
    print_success "Clean completed"
}

# Install dependencies with React 19 compatibility
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --prefer-offline --no-audit --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    print_success "Dependencies installed"
}

# Type checking with route generation
type_check() {
    print_status "Generating routes and running TypeScript check..."
    
    if npm run type-check >/dev/null 2>&1; then
        print_success "Route generation and type checking passed"
    else
        print_error "Route generation or type checking failed"
        exit 1
    fi
}

# Build application
build_app() {
    print_status "Building application with Vite..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        npm run build
    else
        npm run build
    fi
    
    # Verify build output
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        print_error "Build failed - missing dist directory or index.html"
        exit 1
    fi
    
    # Generate build report
    local build_size=$(du -sh dist/ | cut -f1)
    print_success "Application built successfully (Size: $build_size)"
}

# Optimize build assets
optimize_assets() {
    print_status "Optimizing build assets..."
    
    # Pre-compress files for better serving
    find dist -name "*.js" -exec gzip -k {} \; 2>/dev/null || true
    find dist -name "*.css" -exec gzip -k {} \; 2>/dev/null || true
    find dist -name "*.html" -exec gzip -k {} \; 2>/dev/null || true
    
    # Generate build info for debugging
    cat > dist/build-info.json << EOF
{
    "version": "$VITE_APP_VERSION",
    "environment": "$ENVIRONMENT",
    "buildDate": "$VITE_BUILD_DATE",
    "nodeVersion": "$(node --version)",
    "npmVersion": "$(npm --version)",
    "viteVersion": "$(npm list vite --depth=0 2>/dev/null | grep vite || echo 'unknown')",
    "reactVersion": "$(npm list react --depth=0 2>/dev/null | grep react || echo 'unknown')"
}
EOF
    
    print_success "Asset optimization completed"
}

# Build Docker image
build_docker() {
    if [[ "$DOCKER_BUILD" != "true" ]]; then
        return
    fi
    
    print_status "Building Docker image..."
    
    BASE_IMAGE_NAME="norohim/pro-mata-frontend"
    IMAGE_TAG="${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        DOCKERFILE="Dockerfile.prod"
        FULL_IMAGE_NAME="$BASE_IMAGE_NAME"
    else
        DOCKERFILE="Dockerfile.dev"
        FULL_IMAGE_NAME="$BASE_IMAGE_NAME-dev"
    fi

    docker build \
        --build-arg BUILD_DATE="$VITE_BUILD_DATE" \
        --build-arg VCS_REF="$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
        --build-arg VERSION="$VITE_APP_VERSION" \
        -t "$FULL_IMAGE_NAME:$IMAGE_TAG" \
        -t "$FULL_IMAGE_NAME:$ENVIRONMENT" \
        -f "$DOCKERFILE" \
        .
    
    print_success "Docker image built: $FULL_IMAGE_NAME:$IMAGE_TAG"
    
    if [[ "$DOCKER_PUSH" == "true" ]]; then
        print_status "Pushing Docker image..."
        docker push "$FULL_IMAGE_NAME:$IMAGE_TAG"
        docker push "$FULL_IMAGE_NAME:$ENVIRONMENT"
        print_success "Docker image pushed to registry"
    fi
}

# Generate build report
generate_report() {
    print_status "Generating build report..."
    
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    JS_FILES=$(find dist -name "*.js" | wc -l)
    CSS_FILES=$(find dist -name "*.css" | wc -l)
    IMAGE_FILES=$(find dist -name "*.png" -o -name "*.jpg" -o -name "*.svg" | wc -l)
    
    cat > build-report.txt << EOF
Pro-Mata Frontend Build Report
==============================
Environment: $ENVIRONMENT
Build Type: $BUILD_TYPE
Build Date: $(date)
Version: $VITE_APP_VERSION

Statistics:
-----------
Total Size: $BUILD_SIZE
JavaScript Files: $JS_FILES
CSS Files: $CSS_FILES
Image Files: $IMAGE_FILES

Configuration:
--------------
API URL: $VITE_API_URL
App Environment: $VITE_APP_ENV
Skip Tests: $SKIP_TESTS
Skip Lint: $SKIP_LINT
Analyze: $ANALYZE
Docker Build: $DOCKER_BUILD
Docker Push: $DOCKER_PUSH
EOF
    
    print_success "Build report generated: build-report.txt"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    # Add any cleanup tasks here
    print_success "Cleanup completed"
}

# Main execution
main() {
    check_node_version
    clean_build
    install_dependencies
    type_check
    build_app
    optimize_assets
    
    # Build Docker if requested
    if [[ "$DOCKER_BUILD" == "true" ]]; then
        build_docker
    fi

    print_success "🎉 Build process completed successfully!"
    
    # Summary
    echo ""
    print_status "Build Summary:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Version: $VITE_APP_VERSION"
    echo "  Build Date: $VITE_BUILD_DATE"
    echo "  Output Directory: dist/"
    
    if [[ "$DOCKER_BUILD" == "true" ]]; then
        echo "  Docker Image: $FULL_IMAGE_NAME"
    fi
}

# Handle script arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [options]"
        echo ""
        echo "Environment Variables:"
        echo "  ENVIRONMENT         Target environment (default: development)"
        echo "  DOCKER_BUILD        Build Docker image (default: false)"
        echo "  VITE_API_URL       API URL for application"
        echo "  VITE_APP_ENV       Application environment"
        echo "  VITE_APP_VERSION   Application version"
        exit 0
        ;;
    "--clean")
        clean_build
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac