#!/bin/bash

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

SUITE="all"
COVERAGE=false
WATCH=false
E2E_HEADLESS=true

show_help() {
  cat <<EOF
${BLUE}Pro-Mata Frontend Test Runner${NC}

Usage: scripts/test.sh [options]

Options:
  -s, --suite <unit|integration|e2e|all>  Which suite to run (default: all)
  -c, --coverage                          Generate coverage report (unit/integration)
  -w, --watch                             Run Vitest in watch mode (unit/integration only)
  -H, --headed                            Run Playwright tests in headed mode
  -h, --help                              Display this help message

Examples:
  scripts/test.sh --suite unit --coverage
  scripts/test.sh --suite e2e --headed
  scripts/test.sh --suite all
EOF
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -s|--suite)
      SUITE="$2"
      shift 2
      ;;
    -c|--coverage)
      COVERAGE=true
      shift
      ;;
    -w|--watch)
      WATCH=true
      shift
      ;;
    -H|--headed)
      E2E_HEADLESS=false
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

run_unit_tests() {
  echo -e "${BLUE}› Running unit tests${NC}"
  local args=()
  if [[ "$WATCH" == "true" ]]; then
    npx vitest watch tests/unit src
    return
  fi
  args+=("run" "tests/unit" "src")
  if [[ "$COVERAGE" == "true" ]]; then
    args+=("--coverage")
  fi
  npx vitest "${args[@]}"
}

run_integration_tests() {
  if [[ ! -d "tests/integration" ]]; then
    echo -e "${YELLOW}⚠ No integration tests found. Skipping.${NC}"
    return
  fi
  echo -e "${BLUE}› Running integration tests${NC}"
  local args=("run" "tests/integration")
  if [[ "$COVERAGE" == "true" ]]; then
    args+=("--coverage")
  fi
  npx vitest "${args[@]}"
}

run_e2e_tests() {
  if [[ ! -f "playwright.config.ts" ]]; then
    echo -e "${YELLOW}⚠ Playwright config not found. Skipping E2E suite.${NC}"
    return
  fi
  echo -e "${BLUE}› Ensuring Playwright browsers are installed${NC}"
  npx playwright install --with-deps >/dev/null

  echo -e "${BLUE}› Running Playwright tests${NC}"
  local args=("test")
  if [[ "$E2E_HEADLESS" == "false" ]]; then
    args+=("--headed")
  fi
  npx playwright "${args[@]}"
}

echo -e "${BLUE}Pro-Mata Test Runner${NC}"
echo -e "Suite: ${SUITE}"

declare -a executed

case $SUITE in
  unit)
    run_unit_tests
    executed+=("unit")
    ;;
  integration)
    run_integration_tests
    executed+=("integration")
    ;;
  e2e)
    run_e2e_tests
    executed+=("e2e")
    ;;
  all)
    run_unit_tests
    executed+=("unit")
    run_integration_tests
    executed+=("integration")
    run_e2e_tests
    executed+=("e2e")
    ;;
  *)
    echo -e "${RED}Unknown suite: ${SUITE}${NC}"
    exit 1
    ;;
 esac

echo -e "${GREEN}✔ Completed suites:${NC} ${executed[*]}"