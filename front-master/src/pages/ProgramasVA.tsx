import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { Select } from "../components/ui/Select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { GraduationCap, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const YEAR_OPTIONS = [
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2024", label: "2024" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

interface ProgramaVA {
  anio: number;
  programa_id: string; // viene concatenado "INSTITUCIÓN | PROGRAMA | SEDE" según backend
  estu_prgm_academico?: string; // si lo tuvieras por separado, lo dejamos opcional
  inst_nombre_institucion: string;
  key_muni: string;

  // métricas VA
  n: number;
  va_promedio: number;
  sd?: number;
  ic95_inf?: number;
  ic95_sup?: number;
  media_obs?: number;
  media_pred?: number;
}

export const ProgramasVA: React.FC = () => {
  const [allRows, setAllRows] = useState<ProgramaVA[]>([]);
  const [rows, setRows] = useState<ProgramaVA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [year, setYear] = useState<string>("2024");

  const [selected, setSelected] = useState<ProgramaVA | null>(null);
  const [showModal, setShowModal] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const mapApiItem = (it: any): ProgramaVA => ({
    anio: Number(it.anio),
    programa_id: String(it.programa_id),
    estu_prgm_academico: it.estu_prgm_academico
      ? String(it.estu_prgm_academico)
      : undefined,
    inst_nombre_institucion: String(it.inst_nombre_institucion ?? ""),
    key_muni: String(it.key_muni ?? ""),

    n: Number(it.n ?? 0),
    va_promedio: Number(it.va_promedio ?? 0),
    sd: it.sd != null ? Number(it.sd) : undefined,
    ic95_inf: it.ic95_inf != null ? Number(it.ic95_inf) : undefined,
    ic95_sup: it.ic95_sup != null ? Number(it.ic95_sup) : undefined,
    media_obs: it.media_obs != null ? Number(it.media_obs) : undefined,
    media_pred: it.media_pred != null ? Number(it.media_pred) : undefined,
  });

  const fetchRank = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        anio: year,
        limit: "50",
      });
      const res = await fetch(
        `${API_BASE}/api/rank/va-programs?${params.toString()}`,
        { headers: { accept: "application/json" } }
      );
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped: ProgramaVA[] = items.map(mapApiItem);

      // Ordenar por VA (desc)
      mapped.sort((a, b) => b.va_promedio - a.va_promedio);

      setAllRows(mapped);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.message || "Error al cargar los datos de programas VA");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allRows.length / ITEMS_PER_PAGE)),
    [allRows.length]
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setRows(allRows.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [allRows, currentPage]);

  const vaBadge = (va: number) => {
    if (va >= 15) return <Badge variant="success">VA alto</Badge>;
    if (va >= 7.5) return <Badge variant="primary">VA medio</Badge>;
    if (va >= 0) return <Badge variant="secondary">VA bajo</Badge>;
    return <Badge variant="warning">VA negativo</Badge>;
  };

  // Texto legible a partir de programa_id concatenado, si quieres mostrar "programa" separado
  const parsePrograma = (programa_id: string) => {
    // El backend parece enviar:  "UNIVERSIDAD ... | INGENIERÍA ... | PASTO"
    const parts = programa_id.split("|").map((s) => s.trim());
    if (parts.length >= 2) return { prog: parts[1], inst: parts[0] };
    return { prog: programa_id, inst: "" };
  };

  // Datos para el gráfico modal
  const modalChartData = selected
    ? [
        { name: "Media Observada", valor: selected.media_obs ?? 0 },
        { name: "Media Predicha", valor: selected.media_pred ?? 0 },
        { name: "VA Promedio", valor: selected.va_promedio ?? 0 },
      ]
    : [];

  return (
    <Layout showSideMenu>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explorador de Programas – VA</h1>
          <p className="mt-2 text-gray-600">
            Ranking de programas por <strong>Valor Agregado (VA)</strong> promedio, con intervalo de confianza.
          </p>
        </div>

        {/* Filtro de año */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Año"
              options={YEAR_OPTIONS}
              value={year}
              onChange={(e: any) => setYear(e?.target ? e.target.value : e)}
            />
            <div className="flex items-end">
              <Badge variant="primary">Año {year}</Badge>
            </div>
          </div>
        </Card>

        {/* Tabla principal */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Institución</th>
                      <th className="px-6 py-3 text-left">Programa</th>
                      <th className="px-6 py-3 text-left">Municipio</th>
                      <th className="px-6 py-3 text-center">n</th>
                      <th className="px-6 py-3 text-center">VA prom.</th>
                      <th className="px-6 py-3 text-center">IC95%</th>
                      <th className="px-6 py-3 text-center">Media obs.</th>
                      <th className="px-6 py-3 text-center">Media pred.</th>
                      <th className="px-6 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((p, i) => {
                      const parsed = parsePrograma(p.programa_id);
                      return (
                        <tr key={`${p.programa_id}-${i}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{p.inst_nombre_institucion || parsed.inst}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">
                                {parsed.prog}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{p.key_muni}</td>
                          <td className="px-6 py-4 text-center">{p.n}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span>{p.va_promedio.toFixed(2)}</span>
                              {vaBadge(p.va_promedio)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.ic95_inf != null && p.ic95_sup != null
                              ? `${p.ic95_inf.toFixed(2)} – ${p.ic95_sup.toFixed(2)}`
                              : "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.media_obs != null ? p.media_obs.toFixed(1) : "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.media_pred != null ? p.media_pred.toFixed(1) : "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelected(p);
                                setShowModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Modal de detalles */}
        {showModal && selected && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-11/12 max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  {parsePrograma(selected.programa_id).prog}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-600">Institución:</span>{" "}
                  <span className="font-medium">
                    {selected.inst_nombre_institucion || parsePrograma(selected.programa_id).inst}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Municipio:</span>{" "}
                  <span className="font-medium">{selected.key_muni}</span>
                </div>
                <div>
                  <span className="text-gray-600">n:</span>{" "}
                  <span className="font-medium">{selected.n}</span>
                </div>
                <div>
                  <span className="text-gray-600">IC95%:</span>{" "}
                  <span className="font-medium">
                    {selected.ic95_inf != null && selected.ic95_sup != null
                      ? `${selected.ic95_inf.toFixed(2)} – ${selected.ic95_sup.toFixed(2)}`
                      : "—"}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={modalChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {/* Área de referencia para IC95% (sobre el eje Y) */}
                  {selected.ic95_inf != null && selected.ic95_sup != null && (
                    <ReferenceArea
                      y1={selected.ic95_inf}
                      y2={selected.ic95_sup}
                      fill="#bbf7d0"
                      fillOpacity={0.35}
                      stroke="#10b981"
                      strokeOpacity={0.4}
                    />
                  )}
                  <Bar dataKey="valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              <p className="text-xs text-gray-500 mt-2">
                La franja verde indica el intervalo de confianza 95% del VA. Barras: media observada, media predicha y VA promedio.
              </p>

              <div className="mt-6 text-right">
                <Button onClick={() => setShowModal(false)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
