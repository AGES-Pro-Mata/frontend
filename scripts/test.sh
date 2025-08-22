#!/bin/bash

# Pro-Mata Frontend Test Script
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="all"
COVERAGE=true
WATCH=false
UPDATE_SNAPSHOTS=false
PARALLEL=true
VERBOSE=false
CI_MODE=false

# Help function
show_help() {
    echo -e "${BLUE}Pro-Mata Frontend Test Script${NC}"
    echo -e "${YELLOW}Usage: $0 [OPTIONS]${NC}"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo -e "  -t, --type TYPE          Test type (unit, e2e, integration, all) [default: all]"
    echo -e "  -c, --no-coverage        Skip coverage report"
    echo -e "  -w, --watch              Run tests in watch mode"
    echo -e "  -u, --update-snapshots   Update test snapshots"
    echo -e "  -s, --sequential         Run tests sequentially (not in parallel)"
    echo -e "  -v, --verbose            Verbose output"
    echo -e "  -i, --ci                 CI mode (no interactive features)"
    echo -e "  -h, --help               Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 --type unit --coverage"
    echo -e "  $0 --type e2e --watch"
    echo -e "  $0 --ci --no-coverage"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            TEST_TYPE="$2"
            shift 2
            ;;
        -c|--no-coverage)
            COVERAGE=false
            shift
            ;;
        -w|--watch)
            WATCH=true
            shift
            ;;
        -u|--update-snapshots)
            UPDATE_SNAPSHOTS=true
            shift
            ;;
        -s|--sequential)
            PARALLEL=false
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -i|--ci)
            CI_MODE=true
            WATCH=false
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
}

# Setup test environment
setup_test_environment() {
    print_status "Setting up test environment..."
    
    export NODE_ENV=test
    export CI=$CI_MODE
    
    # Create test directories if they don't exist
    mkdir -p coverage
    mkdir -p test-results
    
    print_success "Test environment configured"
}

# Run unit tests
run_unit_tests() {
    print_status "Running unit tests with Vitest..."
    
    local args=""
    
    # Configure test arguments
    if [[ "$COVERAGE" == "true" ]]; then
        args="$args --coverage"
    fi
    
    if [[ "$WATCH" == "true" && "$CI_MODE" == "false" ]]; then
        args="$args --watch"
    else
        args="$args --run"
    fi
    
    if [[ "$UPDATE_SNAPSHOTS" == "true" ]]; then
        args="$args --update-snapshots"
    fi
    
    if [[ "$VERBOSE" == "true" ]]; then
        args="$args --verbose"
    fi
    
    if [[ "$PARALLEL" == "false" ]]; then
        args="$args --no-threads"
    fi
    
    # Run the tests
    npm run test:unit -- $args
    
    print_success "Unit tests completed"
}

# Run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    # Check if integration tests exist
    if [[ ! -d "src/tests/integration" ]]; then
        print_warning "No integration tests found, skipping..."
        return
    fi
    
    local args="--testPathPattern=integration"
    
    if [[ "$COVERAGE" == "true" ]]; then
        args="$args --coverage"
    fi
    
    if [[ "$VERBOSE" == "true" ]]; then
        args="$args --verbose"
    fi
    
    npm run test:unit -- $args
    
    print_success "Integration tests completed"
}

# Run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests with Playwright..."
    
    # Check if E2E tests exist
    if [[ ! -f "playwright.config.ts" ]]; then
        print_warning "Playwright config not found, skipping E2E tests..."
        return
    fi
    
    # Install Playwright browsers if needed
    if [[ "$CI_MODE" == "true" ]]; then
        npx playwright install --with-deps
    fi
    
    local args=""
    
    # Configure Playwright arguments
    if [[ "$VERBOSE" == "true" ]]; then
        args="$args --verbose"
    fi
    
    if [[ "$PARALLEL" == "false" ]]; then
        args="$args --workers=1"
    fi
    
    # Start the development server for E2E tests
    if [[ "$CI_MODE" == "false" ]]; then
        print_status "Starting development server for E2E tests..."
        npm run dev &
        DEV_SERVER_PID=$!
        
        # Wait for server to start
        sleep 10
        
        # Function to cleanup dev server
        cleanup_dev_server() {
            if [[ -n "$DEV_SERVER_PID" ]]; then
                kill $DEV_SERVER_PID 2>/dev/null || true
            fi
        }
        
        # Set trap for cleanup
        trap cleanup_dev_server EXIT
    fi
    
    # Run E2E tests
    npm run test:e2e -- $args
    
    print_success "E2E tests completed"
}

# Run component tests
run_component_tests() {
    print_status "Running component tests..."
    
    # Check if component tests exist
    if [[ ! -d "src/components" ]]; then
        print_warning "No components found, skipping component tests..."
        return
    fi
    
    local args="--testPathPattern=components"
    
    if [[ "$COVERAGE" == "true" ]]; then
        args="$args --coverage"
    fi
    
    if [[ "$UPDATE_SNAPSHOTS" == "true" ]]; then
        args="$args --update-snapshots"
    fi
    
    npm run test:unit -- $args
    
    print_success "Component tests completed"
}

# Run accessibility tests
run_accessibility_tests() {
    print_status "Running accessibility tests..."
    
    # Check if axe-core is available
    if ! npm list @axe-core/react >/dev/null 2>&1; then
        print_warning "axe-core not found, skipping accessibility tests..."
        return
    fi
    
    local args="--testPathPattern=a11y"
    
    npm run test:unit -- $args
    
    print_success "Accessibility tests completed"
}

# Run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Check if lighthouse CI is available
    if ! command -v lhci >/dev/null 2>&1; then
        print_warning "Lighthouse CI not found, skipping performance tests..."
        return
    fi
    
    # Build the app first
    npm run build
    
    # Run lighthouse CI
    lhci autorun
    
    print_success "Performance tests completed"
}

# Generate test report
generate_test_report() {
    if [[ "$COVERAGE" != "true" ]]; then
        return
    fi
    
    print_status "Generating test report..."
    
    # Create test report
    cat > test-results/test-report.md << EOF
# Pro-Mata Frontend Test Report

## Test Summary
- **Date**: $(date)
- **Test Type**: $TEST_TYPE
- **Coverage**: $COVERAGE
- **CI Mode**: $CI_MODE

## Coverage Report
$(if [[ -f "coverage/coverage-summary.json" ]]; then
    node -e "
    const fs = require('fs');
    const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
    const total = coverage.total;
    console.log(\`- **Lines**: \${total.lines.pct}%\`);
    console.log(\`- **Functions**: \${total.functions.pct}%\`);
    console.log(\`- **Branches**: \${total.branches.pct}%\`);
    console.log(\`- **Statements**: \${total.statements.pct}%\`);
    "
fi)

## Test Files
$(find src -name "*.test.*" -o -name "*.spec.*" | wc -l) test files found

## Report Location
- Coverage: \`coverage/index.html\`
- Test Results: \`test-results/\`
EOF
    
    print_success "Test report generated: test-results/test-report.md"
}

# Main execution
main() {
    echo -e "${BLUE}Pro-Mata Frontend Test Runner${NC}"
    echo -e "${BLUE}=============================${NC}"
    
    check_directory
    setup_test_environment
    
    case $TEST_TYPE in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "component")
            run_component_tests
            ;;
        "a11y")
            run_accessibility_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "all")
            run_unit_tests
            run_component_tests
            run_integration_tests
            
            # Only run E2E tests if not in watch mode
            if [[ "$WATCH" == "false" ]]; then
                run_e2e_tests
                run_accessibility_tests
            fi
            ;;
        *)
            print_error "Unknown test type: $TEST_TYPE"
            exit 1
            ;;
    esac
    
    generate_test_report
    
    echo ""
    echo -e "${GREEN}🎉 Tests completed successfully!${NC}"
    echo -e "${YELLOW}Test Type:${NC} $TEST_TYPE"
    echo -e "${YELLOW}Coverage:${NC} $COVERAGE"
    
    if [[ "$COVERAGE" == "true" && -f "coverage/index.html" ]]; then
        echo -e "${YELLOW}Coverage Report:${NC} coverage/index.html"
    fi
    
    if [[ -f "test-results/test-report.md" ]]; then
        echo -e "${YELLOW}Test Report:${NC} test-results/test-report.md"
    fi
}

# Run main function
main "$@"