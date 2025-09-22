from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class PredictIn(BaseModel):
    anio: int = Field(ge=2015, le=2100)
    s11_punt_global: Optional[float] = None
    s11_punt_matematicas: Optional[float] = None
    s11_punt_lectura_critica: Optional[float] = None
    s11_punt_sociales_ciudadanas: Optional[float] = None
    s11_punt_c_naturales: Optional[float] = None
    s11_punt_ingles: Optional[float] = None
    inst_origen: str
    inst_caracter_academico: str
    colegio_nombre: Optional[str] = None
    municipio: Optional[str] = None

class PredictOut(BaseModel):
    y_pred: float
    intervalo: Dict[str, float] | None = None
    contexto: Dict[str, Any] | None = None

class BatchPredictIn(BaseModel):
    items: List[PredictIn]

class BatchPredictOut(BaseModel):
    results: List[PredictOut]
