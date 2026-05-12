FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create a non-root user and set permissions
RUN useradd -m mluser && \
    chown -R mluser:mluser /app

USER mluser

EXPOSE 9000

# Use uvicorn with reload in development (if needed, otherwise CMD can be overridden)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "9000"]
