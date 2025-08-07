#!/bin/bash

# Pro-Mata Frontend Build Script
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
BUILD_TYPE="full"
SKIP_TESTS=false
SKIP_LINT=false
ANALYZE=false
DOCKER_BUILD=false
DOCKER_PUSH=false

# Help function
show_help() {
    echo -e "${BLUE}Pro-Mata Frontend Build Script${NC}"
    echo -e "${YELLOW}Usage: $0 [OPTIONS]${NC}"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo -e "  -e, --env ENVIRONMENT     Set build environment (dev, prod) [default: production]"
    echo -e "  -t, --type TYPE          Build type (full, quick, docker) [default: full]"
    echo -e "  -s, --skip-tests         Skip running tests"
    echo -e "  -l, --skip-lint          Skip linting"
    echo -e "  -a, --analyze            Generate bundle analysis"
    echo -e "  -d, --docker             Build Docker image"
    echo -e "  -p, --push               Push Docker image to registry"
    echo -e "  -h, --help               Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 --env dev --skip-tests"
    echo -e "  $0 --type docker --push"
    echo -e "  $0 --analyze"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -t|--type)
            BUILD_TYPE="$2"
            shift 2
            ;;
        -s|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -l|--skip-lint)
            SKIP_LINT=true
            shift
            ;;
        -a|--analyze)
            ANALYZE=true
            shift
            ;;
        -d|--docker)
            DOCKER_BUILD=true
            shift
            ;;
        -p|--push)
            DOCKER_PUSH=true
            DOCKER_BUILD=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Function to print status
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the right directory
check_directory() {
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found. Please run this script from the frontend root directory."
        exit 1
    fi
    
    if [[ ! -f "vite.config.ts" ]]; then
        print_error "vite.config.ts not found. This doesn't appear to be a Vite project."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    if [[ "$BUILD_TYPE" == "quick" ]]; then
        print_warning "Skipping dependency installation (quick build)"
        return
    fi
    
    print_status "Installing dependencies..."
    
    if [[ -f "package-lock.json" ]]; then
        npm ci --prefer-offline --no-audit
    else
        npm install
    fi
    
    print_success "Dependencies installed"
}

# Run linting
run_lint() {
    if [[ "$SKIP_LINT" == "true" ]]; then
        print_warning "Skipping linting"
        return
    fi
    
    print_status "Running linter..."
    
    # TypeScript check
    npm run type-check
    
    # ESLint
    npm run lint
    
    # Stylelint (if available)
    if npm run | grep -q "lint:css"; then
        npm run lint:css
    fi
    
    print_success "Linting completed"
}

# Run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        print_warning "Skipping tests"
        return
    fi
    
    print_status "Running tests..."
    
    # Unit tests
    npm run test:unit -- --coverage --watchAll=false
    
    # E2E tests (if not in CI)
    if [[ -z "$CI" ]]; then
        if npm run | grep -q "test:e2e"; then
            npm run test:e2e
        fi
    fi
    
    print_success "Tests completed"
}

# Set environment variables
set_environment() {
    print_status "Setting environment for: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "dev")
            export NODE_ENV=development
            export VITE_API_URL=https://api.promata-dev.duckdns.org
            export VITE_APP_ENV=development
            ;;
        "prod")
            export NODE_ENV=production
            export VITE_API_URL=https://api.promata.duckdns.org
            export VITE_APP_ENV=production
            ;;
        *)
            print_error "Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    export VITE_APP_VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    export VITE_BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    print_success "Environment configured"
}

# Build application
build_application() {
    print_status "Building application..."
    
    # Clean previous build
    rm -rf dist/
    
    # Build with Vite
    if [[ "$ANALYZE" == "true" ]]; then
        npm run build:analyze
    else
        npm run build
    fi
    
    # Optimize assets
    print_status "Optimizing assets..."
    
    # Pre-compress files
    find dist -name "*.js" -exec gzip -k {} \;
    find dist -name "*.css" -exec gzip -k {} \;
    find dist -name "*.html" -exec gzip -k {} \;
    
    # Generate build info
    cat > dist/build-info.json << EOF
{
    "version": "$VITE_APP_VERSION",
    "environment": "$ENVIRONMENT",
    "buildDate": "$VITE_BUILD_DATE",
    "nodeVersion": "$(node --version)",
    "npmVersion": "$(npm --version)"
}
EOF
    
    print_success "Application built successfully"
}

# Build Docker image
build_docker() {
    if [[ "$DOCKER_BUILD" != "true" ]]; then
        return
    fi
    
    print_status "Building Docker image..."
    
    IMAGE_NAME="norohim/pro-mata-frontend"
    IMAGE_TAG="${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
    
    docker build \
        --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --build-arg VCS_REF="$(git rev-parse HEAD)" \
        --build-arg VERSION="$VITE_APP_VERSION" \
        -t "$IMAGE_NAME:$IMAGE_TAG" \
        -t "$IMAGE_NAME:$ENVIRONMENT" \
        -f Dockerfile.prod \
        .
    
    print_success "Docker image built: $IMAGE_NAME:$IMAGE_TAG"
    
    # Push to registry
    if [[ "$DOCKER_PUSH" == "true" ]]; then
        print_status "Pushing Docker image..."
        
        docker push "$IMAGE_NAME:$IMAGE_TAG"
        docker push "$IMAGE_NAME:$ENVIRONMENT"
        
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
    echo -e "${BLUE}Pro-Mata Frontend Build Script${NC}"
    echo -e "${BLUE}===============================${NC}"
    
    check_directory
    set_environment
    install_dependencies
    run_lint
    run_tests
    build_application
    build_docker
    generate_report
    
    echo ""
    echo -e "${GREEN}🎉 Build completed successfully!${NC}"
    echo -e "${YELLOW}Environment:${NC} $ENVIRONMENT"
    echo -e "${YELLOW}Build Type:${NC} $BUILD_TYPE"
    echo -e "${YELLOW}Output Directory:${NC} ./dist/"
    
    if [[ "$DOCKER_BUILD" == "true" ]]; then
        echo -e "${YELLOW}Docker Image:${NC} norohim/pro-mata-frontend:$ENVIRONMENT"
    fi
    
    if [[ -f "build-report.txt" ]]; then
        echo -e "${YELLOW}Build Report:${NC} ./build-report.txt"
    fi
}

# Error handling
trap cleanup EXIT

# Run main function
main "$@"