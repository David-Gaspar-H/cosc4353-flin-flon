FROM python:3.12.7-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/requirements.txt ./

# Install system dependencies for mysqlclient and other necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libmariadb-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

ENV DJANGO_SETTINGS_MODULE=config.settings

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]