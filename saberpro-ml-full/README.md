# SaberPro ML — Backend completo (FastAPI + Analytics + Entrenamiento)

## 1) Instalar
```bash
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/Mac:
# source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## 2) Entrenar
Edita `DATA_DIRS` en `train/train_model.py` si tus CSV están en otras carpetas.
```bash
python train/train_model.py
```
Genera artefactos en `artifacts/`:
- `pipeline.pkl` (modelo central)
- `pipeline_q10.pkl` y `pipeline_q90.pkl` (si TRAIN_QUANTILES=True)
- `training_report.json`

## 3) Variables de entorno (Supabase opcional)
Crea `.env` (o exporta en tu entorno) si quieres usar endpoints de analytics y autocompletar S11 por colegio:
```
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
```
Si no configuras Supabase, la API de predicción funciona igual (requiere que envíes las 6 notas S11).

## 4) Levantar API
```bash
uvicorn app.main:app --reload --port 8000
```
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 5) Endpoints principales
- `POST /api/predict`            → predicción individual (usa cuantiles si existen, si no ±RMSE)
- `POST /api/predict/college`    → igual que /api/predict; si faltan S11 intenta completarlas con EDA del colegio (requiere Supabase)
- `POST /api/predict/batch`      → predicción por lotes

### Analytics (requiere Supabase)
- `GET  /api/rank/colleges?anio=2024&municipio=PASTO&ordenar_por=media_global&order=desc&limit=20`
- `GET  /api/rank/programs?anio=2024&criterio=media_global|va_promedio&limit=50&municipio=PASTO`
- `GET  /api/summary/college?anio=2024&colegio_nombre=...&municipio=...`
- `GET  /api/summary/program?anio=2024&programa_id=...`
- `GET  /api/rank/competencias?anio=2024&competencia=prom_mat`
- `GET  /api/options/municipios` / `options/colegios` / `options/programas`

## 6) Docker
```bash
docker build -t saberpro-ml:latest .
docker run -p 8000:8000 saberpro-ml:latest
```
