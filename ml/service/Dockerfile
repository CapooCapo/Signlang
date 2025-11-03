FROM python:3.12-slim
WORKDIR /app
# Cài thẳng các gói cần, bỏ qua requirements.txt
RUN pip install --no-cache-dir fastapi "uvicorn[standard]" pydantic numpy
COPY . .
CMD ["uvicorn","app:app","--host","0.0.0.0","--port","9000"]
