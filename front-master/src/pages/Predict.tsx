import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { Input } from "../components/ui/Input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { School, BookOpen, GraduationCap, Calculator } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://masterdatascienceceupe.onrender.com";
// Endpoint de predicción
const API_PREDICT = "http://127.0.0.1:8005/api/predict";

type ApiResult = {
  y_pred: number;
  intervalo: { inf: number; sup: number };
  contexto: {
    built_from?: { completed_from_colegio?: boolean };
    anio?: number;
    colegio_nombre?: string;
    municipio?: string;
  };
};

export const Predict: React.FC = () => {
  // Catálogos
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [colegios, setColegios] = useState<string[]>([]);
  const [programas, setProgramas] = useState<
    Array<{ programa_id: string; inst_nombre_institucion: string }>
  >([]);

  // Estado de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  // Formulario
  const [form, setForm] = useState({
    anio: 2025,
    s11_punt_global: "",
    s11_punt_matematicas: "",
    s11_punt_lectura_critica: "",
    s11_punt_sociales_ciudadanas: "",
    s11_punt_c_naturales: "",
    s11_punt_ingles: "",
    inst_origen: "OFICIAL",
    inst_caracter_academico: "UNIVERSIDAD",
    colegio_nombre: "",
    municipio: "",
    programa_id: "",
  });

  // Utilidades
  const unique = (arr: any[]) => Array.from(new Set(arr));

  // Cargar catálogos (municipios, colegios, programas) y deduplicar
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [munRes, colRes, progRes] = await Promise.all([
          fetch(`${API_BASE}/api/options/municipios?limit=500`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/api/options/colegios?limit=1000`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/api/options/programas?limit=2000`).then((r) =>
            r.json()
          ),
        ]);

        setMunicipios(unique(munRes.map((m: any) => m.municipio)));
        setColegios(unique(colRes.map((c: any) => c.colegio_nombre)));

        // Unicos por (programa_id + inst_nombre_institucion)
        const progMap = new Map<
          string,
          { programa_id: string; inst_nombre_institucion: string }
        >();
        for (const p of progRes) {
          progMap.set(p.programa_id + p.inst_nombre_institucion, {
            programa_id: p.programa_id,
            inst_nombre_institucion: p.inst_nombre_institucion,
          });
        }
        setProgramas(Array.from(progMap.values()));
      } catch (err) {
        console.error(err);
        setError("Error cargando catálogos");
      }
    };
    fetchCatalogs();
  }, []);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validación de rangos ICFES
  const validateRanges = () => {
    const toNum = (v: any) => Number(v);
    const g = toNum(form.s11_punt_global);
    const mat = toNum(form.s11_punt_matematicas);
    const lc = toNum(form.s11_punt_lectura_critica);
    const soc = toNum(form.s11_punt_sociales_ciudadanas);
    const nat = toNum(form.s11_punt_c_naturales);
    const ing = toNum(form.s11_punt_ingles);

    if (!(g >= 0 && g <= 500)) return "El puntaje global debe estar entre 0 y 500.";
    const modules: Array<[number, string]> = [
      [mat, "Matemáticas"],
      [lc, "Lectura Crítica"],
      [soc, "C. Sociales y Ciudadanas"],
      [nat, "C. Naturales"],
      [ing, "Inglés"],
    ];
    for (const [v, label] of modules) {
      if (!(v >= 0 && v <= 100)) return `El puntaje de ${label} debe estar entre 0 y 100.`;
    }
    if (!form.municipio) return "Seleccione un municipio.";
    if (!form.colegio_nombre) return "Seleccione un colegio.";
    if (!form.programa_id) return "Seleccione un programa.";
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const errMsg = validateRanges();
    if (errMsg) {
      setLoading(false);
      setError(errMsg);
      return;
    }

    try {
      // Construir payload en mayúsculas donde aplica
      const payload = {
        anio: Number(form.anio),
        s11_punt_global: Number(form.s11_punt_global),
        s11_punt_matematicas: Number(form.s11_punt_matematicas),
        s11_punt_lectura_critica: Number(form.s11_punt_lectura_critica),
        s11_punt_sociales_ciudadanas: Number(form.s11_punt_sociales_ciudadanas),
        s11_punt_c_naturales: Number(form.s11_punt_c_naturales),
        s11_punt_ingles: Number(form.s11_punt_ingles),
        inst_origen: form.inst_origen,
        inst_caracter_academico: form.inst_caracter_academico,
        colegio_nombre: form.colegio_nombre.trim().toUpperCase(),
        municipio: form.municipio.trim().toUpperCase(),
        programa_id: form.programa_id, // no afecta el payload esperado original, pero lo mantenemos por si el backend lo usa
      };

      const res = await fetch(API_PREDICT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const data: ApiResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Error en la predicción");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  // Datos para gráfica (Predicción + Intervalo)
  const chartData =
    result?.intervalo && typeof result?.y_pred === "number"
      ? [
          { name: "Inferior", value: result.intervalo.inf },
          { name: "Predicción", value: result.y_pred },
          { name: "Superior", value: result.intervalo.sup },
        ]
      : [];

  const completedFromColegio =
    result?.contexto?.built_from?.completed_from_colegio === true;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Predicción Saber Pro</h1>
        <p className="text-gray-600">
          Completa el formulario con tus datos para estimar tu puntaje en Saber Pro.
        </p>

        {/* Rango oficial (disclaimer pequeño) */}
        <p className="text-xs text-gray-500">
          <strong>Rangos ICFES:</strong> Global 0–500 · Lectura Crítica 0–100 · Matemáticas 0–100 ·
          C. Naturales 0–100 · C. Sociales y Ciudadanas 0–100 · Inglés 0–100.
        </p>

        {/* === FORMULARIO === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Datos básicos */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <School className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Datos Básicos</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Año"
                name="anio"
                type="number"
                value={form.anio}
                onChange={handleChange}
                min={2016}
                max={2030}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio
                </label>
                <select
                  name="municipio"
                  value={form.municipio}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione Municipio</option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colegio
                </label>
                <select
                  name="colegio_nombre"
                  value={form.colegio_nombre}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione Colegio</option>
                  {colegios.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Puntajes */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold">Puntajes Saber 11</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Global"
                  name="s11_punt_global"
                  type="number"
                  value={form.s11_punt_global}
                  onChange={handleChange}
                  min={0}
                  max={500}
                />
                <small className="text-gray-500 text-xs">0 – 500</small>
              </div>

              <div>
                <Input
                  label="Matemáticas"
                  name="s11_punt_matematicas"
                  type="number"
                  value={form.s11_punt_matematicas}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <small className="text-gray-500 text-xs">0 – 100</small>
              </div>

              <div>
                <Input
                  label="Lectura Crítica"
                  name="s11_punt_lectura_critica"
                  type="number"
                  value={form.s11_punt_lectura_critica}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <small className="text-gray-500 text-xs">0 – 100</small>
              </div>

              <div>
                <Input
                  label="C. Sociales y Ciudadanas"
                  name="s11_punt_sociales_ciudadanas"
                  type="number"
                  value={form.s11_punt_sociales_ciudadanas}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <small className="text-gray-500 text-xs">0 – 100</small>
              </div>

              <div>
                <Input
                  label="C. Naturales"
                  name="s11_punt_c_naturales"
                  type="number"
                  value={form.s11_punt_c_naturales}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <small className="text-gray-500 text-xs">0 – 100</small>
              </div>

              <div>
                <Input
                  label="Inglés"
                  name="s11_punt_ingles"
                  type="number"
                  value={form.s11_punt_ingles}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                <small className="text-gray-500 text-xs">0 – 100</small>
              </div>
            </div>
          </Card>

          {/* Institución */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold">Institución</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de institución
                </label>
                <select
                  name="inst_origen"
                  value={form.inst_origen}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="OFICIAL">Oficial</option>
                  <option value="NO OFICIAL">No Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carácter académico
                </label>
                <select
                  name="inst_caracter_academico"
                  value={form.inst_caracter_academico}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="UNIVERSIDAD">Universidad</option>
                  <option value="TECNOLÓGICA">Institución Tecnológica</option>
                  <option value="TECNICA_PROFESIONAL">
                    Institución Técnica Profesional
                  </option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Programa (incluye institución)
                </label>
                <select
                  name="programa_id"
                  value={form.programa_id}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Seleccione Programa</option>
                  {programas.map((p) => (
                    <option
                      key={`${p.programa_id}-${p.inst_nombre_institucion}`}
                      value={p.programa_id}
                    >
                      {p.programa_id} — {p.inst_nombre_institucion}
                    </option>
                  ))}
                </select>
                <small className="text-gray-500 text-xs">
                  Se lista el código del programa seguido del nombre de la institución.
                </small>
              </div>
            </div>
          </Card>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Predecir
              </>
            )}
          </Button>
          {result && (
            <Button variant="outline" onClick={handleReset}>
              Limpiar resultado
            </Button>
          )}
        </div>

        {/* === ERRORES === */}
        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}

        {/* === RESULTADOS === */}
        {result && (
          <Card className="p-6 mt-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Resultado de Predicción
            </h3>

            {/* Badges resumen */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Predicción: {result.y_pred.toFixed(1)}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Intervalo: {result.intervalo.inf.toFixed(1)} –{" "}
                {result.intervalo.sup.toFixed(1)}
              </span>
              {typeof result.contexto?.anio === "number" && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Año {result.contexto.anio}
                </span>
              )}
              {result.contexto?.municipio && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Municipio: {result.contexto.municipio.toUpperCase()}
                </span>
              )}
              {result.contexto?.colegio_nombre && (
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Colegio: {result.contexto.colegio_nombre.toUpperCase()}
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  completedFromColegio
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
                title="Indica si el backend completó información usando datos del colegio"
              >
                {completedFromColegio
                  ? "Con datos del colegio"
                  : "Sin datos completos del colegio"}
              </span>
            </div>

            {/* Gráfica: Predicción + Intervalo */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Predicción con intervalo de confianza
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#60a5fa"
                    fill="#93c5fd"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#1d4ed8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2">
                La línea muestra el valor estimado y el área sombreada representa el
                intervalo entre el límite inferior y superior.
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
