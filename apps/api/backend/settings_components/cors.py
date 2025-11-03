# cors.py — chỉ định nghĩa hằng số, không đụng vào settings globals
import os

CORS_APP = "corsheaders"
CORS_MIDDLEWARE = "corsheaders.middleware.CorsMiddleware"

_raw = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:4200")
CORS_ALLOWED_ORIGINS = [o.strip() for o in _raw.split(",") if o.strip()]

