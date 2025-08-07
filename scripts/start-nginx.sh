#!/bin/sh
set -e

echo "🚀 Starting Pro-Mata Frontend with Nginx..."

# Function to substitute environment variables in files
substitute_env_vars() {
    local file="$1"
    echo "📝 Processing environment variables in $file..."
    
    # List of environment variables to substitute
    ENV_VARS="VITE_API_URL VITE_APP_ENV VITE_APP_VERSION NODE_ENV"
    
    for var in $ENV_VARS; do
        if [ -n "$(eval echo \$$var)" ]; then
            echo "   - Substituting \$${var} with $(eval echo \$$var)"
            sed -i "s|\$${var}|$(eval echo \$$var)|g" "$file"
        fi
    done
}

# Function to inject runtime configuration
inject_runtime_config() {
    echo "🔧 Injecting runtime configuration..."
    
    # Create runtime config file
    cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
    API_URL: '${VITE_API_URL:-/api}',
    APP_ENV: '${VITE_APP_ENV:-production}',
    APP_VERSION: '${VITE_APP_VERSION:-unknown}',
    BUILD_DATE: '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'
};
EOF

    echo "✅ Runtime configuration injected"
}

# Function to optimize nginx configuration
optimize_nginx_config() {
    echo "⚡ Optimizing Nginx configuration..."
    
    # Set worker processes based on CPU cores
    if [ -n "$NGINX_WORKER_PROCESSES" ]; then
        sed -i "s/worker_processes auto;/worker_processes $NGINX_WORKER_PROCESSES;/" /etc/nginx/nginx.conf
    fi
    
    # Set worker connections
    if [ -n "$NGINX_WORKER_CONNECTIONS" ]; then
        sed -i "s/worker_connections 1024;/worker_connections $NGINX_WORKER_CONNECTIONS;/" /etc/nginx/nginx.conf
    fi
    
    echo "✅ Nginx configuration optimized"
}

# Function to validate nginx configuration
validate_nginx_config() {
    echo "🔍 Validating Nginx configuration..."
    
    if nginx -t; then
        echo "✅ Nginx configuration is valid"
    else
        echo "❌ Nginx configuration is invalid"
        exit 1
    fi
}

# Function to ensure required directories exist
ensure_directories() {
    echo "📁 Ensuring required directories exist..."
    
    REQUIRED_DIRS="/var/log/nginx /var/cache/nginx /tmp/nginx"
    
    for dir in $REQUIRED_DIRS; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            chown nginx:nginx "$dir" 2>/dev/null || true
        fi
    done
    
    echo "✅ Required directories ensured"
}

# Function to setup log rotation
setup_log_rotation() {
    echo "📋 Setting up log rotation..."
    
    # Create logrotate configuration
    cat > /etc/logrotate.d/nginx << EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0644 nginx nginx
    postrotate
        if [ -f /tmp/nginx.pid ]; then
            kill -USR1 \$(cat /tmp/nginx.pid)
        fi
    endscript
}
EOF
    
    echo "✅ Log rotation configured"
}

# Function to print startup information
print_startup_info() {
    echo ""
    echo "🌟 Pro-Mata Frontend Information:"
    echo "   - Environment: ${VITE_APP_ENV:-production}"
    echo "   - API URL: ${VITE_API_URL:-/api}"
    echo "   - Version: ${VITE_APP_VERSION:-unknown}"
    echo "   - Nginx Version: $(nginx -v 2>&1 | cut -d' ' -f3)"
    echo "   - Worker Processes: ${NGINX_WORKER_PROCESSES:-auto}"
    echo "   - Worker Connections: ${NGINX_WORKER_CONNECTIONS:-1024}"
    echo ""
}

# Function to handle graceful shutdown
graceful_shutdown() {
    echo "🛑 Received shutdown signal, stopping Nginx gracefully..."
    nginx -s quit
    wait $!
    echo "✅ Nginx stopped gracefully"
    exit 0
}

# Setup signal handlers for graceful shutdown
trap graceful_shutdown TERM INT

# Main execution
main() {
    # Ensure we're running as nginx user
    if [ "$(id -u)" = "0" ]; then
        echo "⚠️  Warning: Running as root, this is not recommended"
    fi
    
    # Setup environment
    ensure_directories
    inject_runtime_config
    optimize_nginx_config
    setup_log_rotation
    
    # Substitute environment variables in static files if needed
    if [ -f "/usr/share/nginx/html/index.html" ]; then
        substitute_env_vars "/usr/share/nginx/html/index.html"
    fi
    
    # Validate configuration
    validate_nginx_config
    
    # Print startup information
    print_startup_info
    
    echo "🚀 Starting Nginx server..."
    echo "📡 Frontend will be available on port 3000"
    echo "💚 Health check available at /health"
    echo ""
    
    # Start nginx in foreground
    exec "$@"
}

# Run main function with all arguments
main "$@"