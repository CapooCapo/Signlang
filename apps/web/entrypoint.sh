#!/bin/sh

# Replace placeholders in environment files with actual environment variables
if [ -n "$GOOGLE_CLIENT_ID" ]; then
  echo "Injecting GOOGLE_CLIENT_ID into environment files..."
  sed -i "s|googleClientId: ''|googleClientId: '$GOOGLE_CLIENT_ID'|g" /app/src/environments/environment.ts
  sed -i "s|googleClientId: ''|googleClientId: '$GOOGLE_CLIENT_ID'|g" /app/src/environments/environment.prod.ts
fi

# Execute the CMD
exec "$@"
