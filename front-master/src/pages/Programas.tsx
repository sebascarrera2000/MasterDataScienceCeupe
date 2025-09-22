import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "../components/layout/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { Select } from "../components/ui/Select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GraduationCap, TrendingUp, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const YEAR_OPTIONS = [
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2024", label: "2024" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

interface ProgramaEDA {
  anio: number;
  inst_nombre_institucion: string;
  programa_id: string;
  key_muni: string;
  inst_origen: string;
  inst_caracter_academico: string;
  media_global: number;
}

export const Programas: React.FC = () => {
  const [allProgramas, setAllProgramas] = useState<ProgramaEDA[]>([]);
  const [programas, setProgramas] = useState<ProgramaEDA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaEDA | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [year, setYear] = useState<string>("2024");

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const mapApiItem = (it: any): ProgramaEDA => ({
    anio: Number(it.anio),
    inst_nombre_institucion: String(it.inst_nombre_institucion),
    programa_id: String(it.programa_id),
    key_muni: String(it.key_muni ?? ""),
    inst_origen: String(it.inst_origen ?? ""),
    inst_caracter_academico: String(it.inst_caracter_academico ?? ""),
    media_global: Number(it.media_global ?? 0),
  });

  const fetchRank = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        anio: year,
        criterio: "media_global",
        limit: "200",
      });

      const res = await fetch(`${API_BASE}/api/rank/programs?${params.toString()}`, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped = items.map(mapApiItem);

      // ordenar descendente por media_global
      const sorted = mapped.sort((a, b) => b.media_global - a.media_global);

      setAllProgramas(sorted);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.message || "Error al cargar los datos de programas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRank();
  }, [year]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allProgramas.length / ITEMS_PER_PAGE)),
    [allProgramas.length]
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setProgramas(allProgramas.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [allProgramas, currentPage]);

  const getPerformanceBadge = (mediaGlobal: number) => {
    if (mediaGlobal >= 170) return <Badge variant="success">Excelente</Badge>;
    if (mediaGlobal >= 150) return <Badge variant="primary">Bueno</Badge>;
    if (mediaGlobal >= 130) return <Badge variant="warning">Regular</Badge>;
    return <Badge variant="error">Bajo</Badge>;
  };

  return (
    <Layout showSideMenu>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explorador de Programas</h1>
          <p className="mt-2 text-gray-600">Ranking de programas académicos según media global</p>
        </div>

        {/* Filtro Año */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Año"
              options={YEAR_OPTIONS}
              value={year}
              onChange={(e: any) => setYear(e.target ? e.target.value : e)}
            />
            <div className="flex items-end">
              <Badge variant="primary">{`Año ${year}`}</Badge>
            </div>
          </div>
        </Card>

        {/* Tabla */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <Spinner size="lg" />
              <p>Cargando datos...</p>
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
                      <th className="px-6 py-3 text-left">Carácter</th>
                      <th className="px-6 py-3">Media Global</th>
                      <th className="px-6 py-3">Rendimiento</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((p, i) => (
                      <tr key={`${p.programa_id}-${i}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{p.inst_nombre_institucion}</td>
                        <td className="px-6 py-4">{p.programa_id}</td>
                        <td className="px-6 py-4">{p.key_muni}</td>
                        <td className="px-6 py-4">{p.inst_caracter_academico}</td>
                        <td className="px-6 py-4">{p.media_global.toFixed(1)}</td>
                        <td className="px-6 py-4">{getPerformanceBadge(p.media_global)}</td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPrograma(p);
                              setShowModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Modal */}
        {showModal && selectedPrograma && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-11/12 max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  {selectedPrograma.programa_id}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Institución:</strong> {selectedPrograma.inst_nombre_institucion}</div>
                <div><strong>Municipio:</strong> {selectedPrograma.key_muni}</div>
                <div><strong>Origen:</strong> {selectedPrograma.inst_origen}</div>
                <div><strong>Carácter:</strong> {selectedPrograma.inst_caracter_academico}</div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[{ name: "Media Global", valor: selectedPrograma.media_global }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

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
