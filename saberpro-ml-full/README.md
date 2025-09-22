Here tienes un **README** pulido, claro y “bonito” para tu repo. Está centrado 100% en la **IA** (sin analytics) e incluye tu **deploy en Render** y notas para Vercel/Docker.

---

# 📚 SaberPro-ML — Predicción de Puntaje Saber Pro (FastAPI + scikit-learn)

Servicio de **predicción** del puntaje global de **Saber Pro** usando historiales de **Saber 11** y metadatos institucionales.
API en **FastAPI**, modelo entrenado con **scikit-learn**, listo para correr **local**, en **Vercel** o **Render**.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-%F0%9F%9A%80-009688.svg)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E.svg?logo=scikitlearn\&logoColor=white)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-2ea44f.svg)](#%EF%B8%8F-licencia)

---

## 🌐 Deploys

* **Render (salud del servicio):**
  👉 `GET` **[https://masterdatascienceceupe-1.onrender.com/health](https://masterdatascienceceupe-1.onrender.com/health)**

* **Local:** `http://localhost:8000/health`

* **Docs OpenAPI (local):** `http://localhost:8000/docs`

> El proyecto no incluye “analytics” (rankings, dashboards). Esta API es **solo IA/predicción**.

---

## ✨ Funcionalidad

* Predice **`spro_global`** a partir de:

  * 6 puntajes **Saber 11**: `global, matemáticas, lectura, sociales, naturales, inglés`
  * Metadatos: `inst_origen`, `inst_caracter_academico`
  * `anio` (respeta temporalidad del entrenamiento)
* Devuelve **intervalo de predicción**:

  * Preferencia: **cuantiles** 10-90 (si se entrenaron)
  * Alternativa: **±RMSE** del reporte de entrenamiento
* Soporta **predicción por lotes** (batch)

---

## 🧱 Tecnologías

* **Python 3.10+**, **FastAPI**, **Uvicorn**
* **scikit-learn** (HistGradientBoostingRegressor, Pipelines)
* **pandas / numpy**, **joblib**
* **python-dotenv** (config local)
* Deploy: **Vercel** o **Render** (también Docker)

---

## 🗂️ Estructura

```
artifacts/                 # después de entrenar
  pipeline.pkl             # modelo central (prepro + HGBR)
  pipeline_q10.pkl         # opcional (cuantil 0.10)
  pipeline_q90.pkl         # opcional (cuantil 0.90)
  training_report.json     # métricas, features, intervalos

train/
  train_model.py           # script de entrenamiento

app/
  main.py                  # FastAPI: /health, /api/predict, /api/predict/batch, /api/model/info
  model_loader.py          # carga artifacts y maneja intervalos
  feature_builder.py       # normaliza y arma vector de features
  schemas.py               # Pydantic (request/response)

requirements.txt
Dockerfile                 # (opcional) despliegue por contenedor
README.md
```

---

## 📚 Datos para entrenamiento

**Archivos por año** (exportados desde tus notebooks EDA):

* `train_features_{YEAR}.csv`

  ```
  s11_punt_global, s11_punt_matematicas, s11_punt_lectura_critica,
  s11_punt_sociales_ciudadanas, s11_punt_c_naturales, s11_punt_ingles,
  inst_origen, inst_caracter_academico, anio
  ```

* `train_labels_{YEAR}.csv`

  ```
  spro_global
  ```

> Recomendación: usar varias cohortes (p. ej., 2020–2024) para mejor generalización.

---

## 🏋️ Entrenamiento

1. Edita rutas en `train/train_model.py`:

   ```python
   DATA_DIRS = [
       r"C:\Temp\eda_exports_2020",
       r"C:\Temp\eda_exports_2021",
       r"C:\Temp\eda_exports_2022",
       r"C:\Temp\eda_exports_2023",
       r"C:\Temp\eda_exports_2024",
   ]
   ```
2. Instala dependencias y ejecuta:

   ```bash
   python -m venv .venv
   # Windows: .\.venv\Scripts\Activate.ps1
   # Linux/Mac: source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt

   python train/train_model.py
   ```
3. Se generan artefactos en `artifacts/`:

   * `pipeline.pkl` (modelo productivo)
   * `pipeline_q10.pkl` y `pipeline_q90.pkl` (si `TRAIN_QUANTILES=True`)
   * `training_report.json` (métricas y features)

**Benchmark de referencia** (ejemplo real):

```
CV (HGBR) -> RMSE ≈ 9.9 ± 1.8 | R² ≈ 0.24 ± 0.13
```

---

## 🧠 Modelo

* **HistGradientBoostingRegressor** (no lineal, robusto para tabular).
* **Preprocesamiento**:

  * Numéricas → imputación “median” + `StandardScaler`
  * Categóricas → imputación “most\_frequent” + `OneHotEncoder(handle_unknown="ignore")`
  * Normalización de categorías (`upper().strip()`)
* **Validación**: `GroupKFold(5)` agrupando por `anio`.
* **Intervalos**: cuantiles q10–q90 (si existen) o ±RMSE como fallback.

---

## 🌐 API

### Levantar local

```bash
uvicorn app.main:app --reload --port 8000
```

* Health: `GET /health` → `{"status":"ok"}`
* Docs: `http://localhost:8000/docs`

### Endpoints

#### 1) `POST /api/predict` — predicción individual

**Request**

```json
{
  "anio": 2024,
  "s11_punt_global": 300,
  "s11_punt_matematicas": 70,
  "s11_punt_lectura_critica": 65,
  "s11_punt_sociales_ciudadanas": 60,
  "s11_punt_c_naturales": 62,
  "s11_punt_ingles": 55,
  "inst_origen": "NO OFICIAL - CORPORACIÓN",
  "inst_caracter_academico": "INSTITUCIÓN UNIVERSITARIA"
}
```

**Response (ejemplo)**

```json
{
  "y_pred": 156.2,
  "intervalo": {"inf": 146.3, "sup": 166.1, "tipo": "cuantiles"},
  "metadatos": {
    "modelo": "HGBR",
    "features": ["s11_*", "inst_*", "anio"]
  }
}
```

#### 2) `POST /api/predict/batch` — predicción por lotes

Recibe un array de objetos con el mismo esquema que `/api/predict`.

#### 3) `GET /api/model/info` — info del modelo

Devuelve `training_report.json` (métricas, features, si hay cuantiles).

---

## ☁️ Despliegue

### 🔹 Render (tu despliegue)

* Salud del servicio: **[https://masterdatascienceceupe-1.onrender.com/health](https://masterdatascienceceupe-1.onrender.com/health)**
* Render puede usar el **Dockerfile** o un **Start Command** con Uvicorn.
  Asegúrate de que la carpeta **`artifacts/`** esté presente en la imagen/instancia.

### 🔹 Vercel (opción alternativa)

**Opción A — Dockerfile (recomendado si `artifacts/` pesa):**

```dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY artifacts ./artifacts
COPY app ./app

ENV PORT=8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

* Importa el repo en Vercel → detecta Docker → deploy.
* Verifica que **`artifacts/`** se copie al build.

**Opción B — Serverless Python**
No recomendado si los artifacts cambian mucho o son pesados.

---

## 🧪 Ejemplos (curl)

```bash
# Health
curl https://masterdatascienceceupe-1.onrender.com/health

# Predicción
curl -X POST https://masterdatascienceceupe-1.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "anio": 2024,
    "s11_punt_global": 290,
    "s11_punt_matematicas": 65,
    "s11_punt_lectura_critica": 60,
    "s11_punt_sociales_ciudadanas": 58,
    "s11_punt_c_naturales": 62,
    "s11_punt_ingles": 55,
    "inst_origen": "NO OFICIAL - CORPORACIÓN",
    "inst_caracter_academico": "INSTITUCIÓN UNIVERSITARIA"
  }'
```

---

## 🧩 Notas y buenas prácticas

* Incluye **varios años** en el entrenamiento.
* Asegúrate de que las 6 S11 sean **numéricas** y `anio` tenga **4 dígitos** (no 20161).
* Verifica que `artifacts/` exista **antes de levantar** la API.
* Cuantiles: pon `TRAIN_QUANTILES=True` y reentrena si quieres intervalos “q10–q90”.

---

## 📈 Conclusiones (IA)

* Con los features actuales, el modelo logra **RMSE \~ 10** y **R² \~ 0.24** (CV por año).
* Es **útil para proyección** y **detección de riesgo**; no pretende sustituir evaluación real ni explicar causalidad.
* Subirá el rendimiento al agregar **contexto** (baseline municipal, medias colegio/programa, tamaño muestral, tendencia anual) y probar **CatBoost/LightGBM** con tuning.

---

## 🛠️ Troubleshooting

* **“No encontré datos de entrenamiento”** → revisa `DATA_DIRS` y nombres `train_features_{YEAR}.csv` / `train_labels_{YEAR}.csv`.
* **R² muy bajo** → añade más años, revisa tipos, confirma que `anio` esté en features.
* **En Render/Vercel no encuentra artifacts** → asegúrate de **incluir `artifacts/` en el build** (Docker o assets).
* **Cuantiles ausentes** → reentrena con `TRAIN_QUANTILES=True`; si no, la API usa ±RMSE.

---

## 🧾 .env (opcional local)

No es obligatorio, pero puedes agregar un `.env` para variables propias:

```
# ejemplo
APP_ENV=local
```

---

## 🧭 Roadmap corto

* Añadir features de contexto (baseline municipal, medias n\_estu y tendencias).
* Probar CatBoost/LightGBM + tuning.
* Calibración de intervalos (conformal).
* Endpoint `/api/explain` con importancias/SHAP (explicabilidad).

---

## ©️ Licencia

MIT — libre uso académico y comercial con atribución.

---
