#!/usr/bin/env sh
set -e
python manage.py migrate --noinput
# chạy ASGI server (Channels)
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
