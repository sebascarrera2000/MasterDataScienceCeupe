export interface Filters {
  anio: number | null;
  municipio: string | null;
  institucion: string | null;
  programaId: string | null;
}

export interface Catalogs {
  municipios: string[];
  colegios: Array<{ nombre: string; municipio: string; }>;
  instituciones: string[];
  programas: Array<{ programa_id: string; label: string; }>;
}

export interface PredictionInput {
  anio_referencia: number;
  s11_punt_global: number;
  s11_punt_matematicas: number;
  s11_punt_lectura_critica: number;
  s11_punt_sociales_ciudadanas: number;
  s11_punt_c_naturales: number;
  s11_punt_ingles: number;
  colegio_nombre: string;
  municipio: string;
  inst_origen?: string;
  inst_caracter_academico?: string;
  programa_id: string;
}

export interface PredictionResult {
  y_pred: number;
  intervalo: {
    inf: number;
    sup: number;
  };
  contexto: {
    colegio: {
      media_global: number;
      p25: number;
      p50: number;
      p75: number;
      n_estu: number;
    };
    municipio: {
      prom_lc: number;
      prom_mat: number;
      prom_soc: number;
      prom_nat: number;
      prom_ing: number;
    };
    programa: {
      media_global: number;
      va_promedio?: number;
    };
  };
}

export interface ColegioEDA {
  anio: number;
  colegio_nombre: string;
  municipio: string;
  n_estu: number;
  media_lc: number;
  media_mat: number;
  media_soc: number;
  media_nat: number;
  media_ing: number;
  media_global: number;
  p25_global: number;
  p50_global: number;
  p75_global: number;
  sd_global: number;
}

export interface ProgramaEDA {
  anio: number;
  programa_id: string;
  media_global: number;
  n: number | null;
  p25: number | null;
  p50: number | null;
  p75: number | null;
  sd: number | null;
}

export interface MunicipioEDA {
  anio: number;
  municipio: string;
  prom_lc: number;
  prom_mat: number;
  prom_soc: number;
  prom_nat: number;
  prom_ing: number;
}

export interface VAPrograma {
  programa_id: string;
  va_promedio: number;
  ic95_inf: number;
  ic95_sup: number;
  n: number;
  media_obs: number;
  media_pred: number;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}