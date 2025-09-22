FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MODEL_PATH=/app/artifacts/pipeline.pkl \
    MODEL_Q10_PATH=/app/artifacts/pipeline_q10.pkl \
    MODEL_Q90_PATH=/app/artifacts/pipeline_q90.pkl \
    REPORT_PATH=/app/artifacts/training_report.json \
    PORT=8000

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY artifacts ./artifacts

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
