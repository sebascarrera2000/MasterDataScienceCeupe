from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictIn, PredictOut, BatchPredictIn, BatchPredictOut
import app.model_loader as ml   # ⬅️ Importa el módulo completo
from app.feature_builder import build_features_row
import pandas as pd
import os
from datetime import datetime
import logging

app = FastAPI(
    title="SaberPro ML API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")

@app.on_event("startup")
def _startup():
    try:
        ml.load_models()
        logger.info("Modelos cargados correctamente.")
    except Exception as e:
        logger.exception(f"Error al cargar modelos en startup: {e}")

@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()+"Z"}

@app.get("/api/model/info")
def model_info():
    return {
        "version": os.getenv("MODEL_VERSION", "2.0.0"),
        "rmse_mean": ml.report.get("rmse_mean") if isinstance(ml.report, dict) else None,
        "r2_mean": ml.report.get("r2_mean") if isinstance(ml.report, dict) else None,
        "features": ml.report.get("features", []) if isinstance(ml.report, dict) else [],
        "quantiles": ml.have_quantiles()
    }

def _predict_df(X: pd.DataFrame):
    if ml.pipe is None:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    y_hat = float(ml.pipe.predict(X)[0])
    if ml.have_quantiles():
        y_lo = float(ml.pipe_q10.predict(X)[0])
        y_hi = float(ml.pipe_q90.predict(X)[0])
        intervalo = {"inf": y_lo, "sup": y_hi}
    else:
        rmse = (ml.report.get("rmse_mean") if isinstance(ml.report, dict) else None) or 7.0
        intervalo = {"inf": y_hat - rmse, "sup": y_hat + rmse}
    return y_hat, intervalo

@app.post("/api/predict", response_model=PredictOut)
def predict(p: PredictIn):
    try:
        payload = p.model_dump()
        features, dbg = build_features_row(payload)
        y_hat, intervalo = _predict_df(features)
        return PredictOut(
            y_pred=y_hat,
            intervalo=intervalo,
            contexto={
                "built_from": dbg,
                "anio": p.anio,
                "colegio_nombre": p.colegio_nombre,
                "municipio": p.municipio
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as ex:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {ex}")

@app.post("/api/predict/college", response_model=PredictOut)
def predict_college(p: PredictIn):
    return predict(p)

@app.post("/api/predict/batch", response_model=BatchPredictOut)
def predict_batch(batch: BatchPredictIn):
    results = []
    for item in batch.items:
        try:
            X, dbg = build_features_row(item.model_dump())
            y_hat, intervalo = _predict_df(X)
            results.append(PredictOut(
                y_pred=y_hat, intervalo=intervalo,
                contexto={"built_from": dbg, "anio": item.anio,
                          "colegio_nombre": item.colegio_nombre,
                          "municipio": item.municipio}
            ))
        except Exception as ex:
            results.append(PredictOut(
                y_pred=float("nan"),
                intervalo=None,
                contexto={"error": str(ex)}
            ))
    return BatchPredictOut(results=results)
