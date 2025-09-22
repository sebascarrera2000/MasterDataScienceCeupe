import pandas as pd, numpy as np, json, glob, warnings
from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import GroupKFold, cross_val_score
import joblib

warnings.filterwarnings("ignore", category=UserWarning)

DATA_DIRS = [
    r"C:\Temp\eda_exports_2020",
    r"C:\Temp\eda_exports_2021",
    r"C:\Temp\eda_exports_2022",
    r"C:\Temp\eda_exports_2023",
    r"C:\Temp\eda_exports_2024",
]

ART_DIR = Path("artifacts"); ART_DIR.mkdir(parents=True, exist_ok=True)

NUM_COLS = [
    "s11_punt_global","s11_punt_matematicas","s11_punt_lectura_critica",
    "s11_punt_sociales_ciudadanas","s11_punt_c_naturales","s11_punt_ingles",
    "anio",
]
CAT_COLS = ["inst_origen","inst_caracter_academico"]
LABEL_COL = "spro_global"

TRAIN_QUANTILES = True

def load_all():
    Xs, ys, groups = [], [], []
    for d in DATA_DIRS:
        feats = glob.glob(str(Path(d)/"train_features_*.csv"))
        labs  = glob.glob(str(Path(d)/"train_labels_*.csv"))
        if not feats or not labs:
            print(f"[WARN] faltan archivos en {d}")
            continue
        X = pd.read_csv(feats[0]); y = pd.read_csv(labs[0])

        if "anio" not in X.columns:
            try:
                anio = int(Path(feats[0]).stem.split("_")[-1])
            except:
                anio = 0
            X["anio"] = anio

        n = min(len(X), len(y))
        Xs.append(X.iloc[:n].copy())
        ys.append(y.iloc[:n, 0].astype(float).values)
        groups.append(X.iloc[:n]["anio"].values)

    if not Xs:
        raise RuntimeError("No encontré datos de entrenamiento (revisa DATA_DIRS).")

    X_all = pd.concat(Xs, ignore_index=True)
    y_all = np.concatenate(ys, axis=0)
    g_all = np.concatenate(groups, axis=0)

    for c in ["inst_origen","inst_caracter_academico"]:
        if c in X_all.columns:
            X_all[c] = X_all[c].astype(str).str.strip().str.upper()

    return X_all, y_all, g_all

def build_pipe(num_cols, cat_cols, loss=None, quantile=None):
    num_t = Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())])
    cat_t = Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("ohe", OneHotEncoder(handle_unknown="ignore"))])
    prep = ColumnTransformer([("num", num_t, num_cols), ("cat", cat_t, cat_cols)], remainder="drop")

    kwargs = dict(
        learning_rate=0.08, max_depth=6, max_leaf_nodes=31,
        min_samples_leaf=50, l2_regularization=0.0, random_state=42
    )
    if loss:
        kwargs.update(loss=loss)
    if quantile is not None:
        kwargs.update(quantile=quantile)

    model = HistGradientBoostingRegressor(**kwargs)
    return Pipeline([("prep", prep), ("model", model)])

if __name__ == "__main__":
    X_all, y_all, g_all = load_all()
    use_num = [c for c in NUM_COLS if c in X_all.columns]
    use_cat = [c for c in CAT_COLS if c in X_all.columns]
    use_cols = use_num + use_cat
    X = X_all[use_cols].copy()

    pipe = build_pipe(use_num, use_cat)

    gkf = GroupKFold(n_splits=5)
    rmse = -cross_val_score(pipe, X, y_all, groups=g_all, scoring="neg_root_mean_squared_error", cv=gkf)
    r2   =  cross_val_score(pipe, X, y_all, groups=g_all, scoring="r2", cv=gkf)
    print(f"CV (HGBR) -> RMSE: {rmse.mean():.3f} ± {rmse.std():.3f} | R²: {r2.mean():.3f} ± {r2.std():.3f}")

    pipe.fit(X, y_all)
    joblib.dump(pipe, ART_DIR/"pipeline.pkl")

    intervals = None
    if TRAIN_QUANTILES:
        pipe_q10 = build_pipe(use_num, use_cat, loss="quantile", quantile=0.10)
        pipe_q90 = build_pipe(use_num, use_cat, loss="quantile", quantile=0.90)
        pipe_q10.fit(X, y_all); joblib.dump(pipe_q10, ART_DIR/"pipeline_q10.pkl")
        pipe_q90.fit(X, y_all); joblib.dump(pipe_q90, ART_DIR/"pipeline_q90.pkl")
        intervals = {"quantiles": [0.10, 0.90], "artifacts": ["pipeline_q10.pkl","pipeline_q90.pkl"]}

    (ART_DIR/"training_report.json").write_text(json.dumps({
        "model": "HistGradientBoostingRegressor",
        "train_quantiles": TRAIN_QUANTILES,
        "n_samples": int(len(X)),
        "rmse_mean": float(rmse.mean()),
        "rmse_std": float(rmse.std()),
        "r2_mean": float(r2.mean()),
        "r2_std": float(r2.std()),
        "features": use_cols,
        "intervals": intervals
    }, indent=2), encoding="utf-8")

    print("✅ Guardados:")
    print(" -", ART_DIR/"pipeline.pkl")
    if TRAIN_QUANTILES:
        print(" -", ART_DIR/"pipeline_q10.pkl")
        print(" -", ART_DIR/"pipeline_q90.pkl")
    print(" -", ART_DIR/"training_report.json")
