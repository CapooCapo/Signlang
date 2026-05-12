#!/bin/bash
set -e

# Temporary debugging commands
echo "--- DEBUG INFO ---"
echo "Current User: $(whoami)"
echo "Working Directory: $(pwd)"
echo "Environment Variables (Filtered):"
printenv | grep -E "DJANGO|DB|REDIS|GOOGLE|CORS|API" || true
echo "Files in /app:"
ls -F /app
echo "Check connectivity to Google:"
curl -I https://www.google.com || echo "Google unreachable"
echo "------------------"

# Function to wait for database
wait_for_db() {
    echo "Waiting for database..."
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done
    echo "Database started"
}

# Wait for DB if not in test mode
if [ "$ENVIRONMENT" != "test" ]; then
    wait_for_db
fi

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

# Start application
echo "Starting application with command: $@"
exec "$@"
