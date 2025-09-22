import os, json, joblib
from pathlib import Path

MODEL_PATH      = Path(os.getenv("MODEL_PATH", "artifacts/pipeline.pkl"))
MODEL_Q10_PATH  = Path(os.getenv("MODEL_Q10_PATH", "artifacts/pipeline_q10.pkl"))
MODEL_Q90_PATH  = Path(os.getenv("MODEL_Q90_PATH", "artifacts/pipeline_q90.pkl"))
REPORT_PATH     = Path(os.getenv("REPORT_PATH", "artifacts/training_report.json"))

pipe = None
pipe_q10 = None
pipe_q90 = None
report = None

def _try_load(path: Path):
    if path.exists():
        return joblib.load(path)
    return None

def load_models():
    global pipe, pipe_q10, pipe_q90, report
    pipe = _try_load(MODEL_PATH)
    pipe_q10 = _try_load(MODEL_Q10_PATH)
    pipe_q90 = _try_load(MODEL_Q90_PATH)
    if REPORT_PATH.exists():
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
    else:
        report = {"rmse_mean": None, "r2_mean": None, "features": []}

def have_quantiles() -> bool:
    return pipe_q10 is not None and pipe_q90 is not None

def load_models():
    global pipe, pipe_q10, pipe_q90, report
    pipe = _try_load(MODEL_PATH)
    pipe_q10 = _try_load(MODEL_Q10_PATH)
    pipe_q90 = _try_load(MODEL_Q90_PATH)
    print(f"PIPE: {pipe is not None}, Q10: {pipe_q10 is not None}, Q90: {pipe_q90 is not None}")
    if REPORT_PATH.exists():
        report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
    else:
        report = {"rmse_mean": None, "r2_mean": None, "features": []}
