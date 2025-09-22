import pandas as pd
from typing import Dict, Any, Optional

NUM_COLS = [
    "s11_punt_global","s11_punt_matematicas","s11_punt_lectura_critica",
    "s11_punt_sociales_ciudadanas","s11_punt_c_naturales","s11_punt_ingles",
    "anio",
]
CAT_COLS = ["inst_origen","inst_caracter_academico"]

SUPABASE_ON = False
supabase = None
try:
    import os
    from supabase import create_client
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        SUPABASE_ON = True
except Exception:
    supabase = None
    SUPABASE_ON = False

def fetch_colegio_stats(colegio_nombre: str, municipio: Optional[str], anio: int) -> Optional[Dict[str, Any]]:
    if not SUPABASE_ON or supabase is None:
        return None
    q = supabase.table("eda_colegio").select("*").eq("anio", anio).eq("colegio_nombre", colegio_nombre)
    muni_col = "cole_mcpio_ubicacion"
    if municipio:
        q = q.eq(muni_col, municipio)
    data = q.limit(1).execute().data
    if not data:
        return None
    row = data[0]
    return {
        "media_lc":  row.get("media_lc"),
        "media_mat": row.get("media_mat"),
        "media_soc": row.get("media_soc"),
        "media_nat": row.get("media_nat"),
        "media_ing": row.get("media_ing"),
        "media_global": row.get("media_global"),
    }

def build_features_row(payload: Dict[str, Any]):
    row: Dict[str, Any] = {}
    for c in NUM_COLS + CAT_COLS:
        row[c] = payload.get(c)

    faltan = [c for c in ["s11_punt_global","s11_punt_matematicas","s11_punt_lectura_critica",
                          "s11_punt_sociales_ciudadanas","s11_punt_c_naturales","s11_punt_ingles"]
              if row.get(c) is None]
    completed_from_colegio = False
    if faltan and payload.get("colegio_nombre") and payload.get("anio"):
        stats = fetch_colegio_stats(payload["colegio_nombre"], payload.get("municipio"), int(payload["anio"]))
        if stats:
            row.setdefault("s11_punt_lectura_critica",    stats.get("media_lc"))
            row.setdefault("s11_punt_matematicas",        stats.get("media_mat"))
            row.setdefault("s11_punt_sociales_ciudadanas",stats.get("media_soc"))
            row.setdefault("s11_punt_c_naturales",        stats.get("media_nat"))
            row.setdefault("s11_punt_ingles",             stats.get("media_ing"))
            row.setdefault("s11_punt_global",             stats.get("media_global"))
            completed_from_colegio = True

    for c in ["inst_origen","inst_caracter_academico"]:
        if row.get(c) is not None:
            row[c] = str(row[c]).strip().upper()

    missing_num = [c for c in NUM_COLS if row.get(c) is None]
    if missing_num:
        raise ValueError(f"Faltan columnas numéricas requeridas: {missing_num}")

    df = pd.DataFrame([row], columns=NUM_COLS + CAT_COLS)
    dbg = {"completed_from_colegio": completed_from_colegio}
    return df, dbg
