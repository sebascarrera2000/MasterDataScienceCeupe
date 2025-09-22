import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Select } from '../components/ui/Select';
import { useStore } from '../store';
import { ColegioEDA } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { School, Users, TrendingUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const YEAR_OPTIONS = [
  { value: '2016', label: '2016' },
  { value: '2017', label: '2017' },
  { value: '2018', label: '2018' },
  { value: '2019', label: '2019' },
  { value: '2020', label: '2020' }
];

const PERIOD_OPTIONS = [
  { value: '1', label: 'Periodo 1' },
  { value: '2', label: 'Periodo 2' }
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

export const Colegios: React.FC = () => {
  const { filters } = useStore();
  const [allColegios, setAllColegios] = useState<ColegioEDA[]>([]);
  const [colegios, setColegios] = useState<ColegioEDA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColegio, setSelectedColegio] = useState<ColegioEDA | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [year, setYear] = useState<string>('2019');
  const [period, setPeriod] = useState<string>('1');
  const ano = Number(`${year}${period}`);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const mapApiItem = (it: any): ColegioEDA => ({
    anio: Number(it.anio),
    colegio_nombre: String(it.colegio_nombre),
    municipio: String(it.cole_mpio_ubicacion ?? it.municipio ?? ''),
    n_estu: Number(it.n_estu ?? 0),
    media_lc: Number(it.media_lc ?? 0),
    media_mat: Number(it.media_mat ?? 0),
    media_soc: Number(it.media_soc ?? 0),
    media_nat: Number(it.media_nat ?? 0),
    media_ing: Number(it.media_ing ?? 0),
    media_global: Number(it.media_global ?? 0),
    p25_global: Number(it.p25_global ?? 0),
    p50_global: Number(it.p50_global ?? 0),
    p75_global: Number(it.p75_global ?? 0),
    sd_global: Number(it.sd_global ?? 0),
  });

  const fetchRank = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        anio: String(ano),
        limit: '200',
        order: 'desc',
      });
      if (filters?.municipio) params.append('municipio', filters.municipio.toUpperCase());

      const res = await fetch(`${API_BASE}/api/rank/colleges?${params.toString()}`, {
        headers: { accept: 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped = items.map(mapApiItem);

      const filtered = filters?.institucion
        ? mapped.filter(c => c.colegio_nombre.toUpperCase().includes(filters.institucion.toUpperCase()))
        : mapped;

      setAllColegios(filtered);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar los datos de colegios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ano, filters?.municipio, filters?.institucion]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(allColegios.length / ITEMS_PER_PAGE)),
    [allColegios.length]
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setColegios(allColegios.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [allColegios, currentPage]);

  const getPerformanceBadge = (mediaGlobal: number) => {
    if (mediaGlobal >= 170) return <Badge variant="success">Excelente</Badge>;
    if (mediaGlobal >= 150) return <Badge variant="primary">Bueno</Badge>;
    if (mediaGlobal >= 130) return <Badge variant="warning">Regular</Badge>;
    return <Badge variant="error">Necesita Mejorar</Badge>;
  };

  const getColegioDetailsData = (colegio: ColegioEDA) => [
    { area: 'Lectura Crítica', puntaje: colegio.media_lc },
    { area: 'Matemáticas', puntaje: colegio.media_mat },
    { area: 'C. Sociales', puntaje: colegio.media_soc },
    { area: 'C. Naturales', puntaje: colegio.media_nat },
    { area: 'Inglés', puntaje: colegio.media_ing },
  ];

  return (
    <Layout showSideMenu>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explorador de Colegios</h1>
          <p className="mt-2 text-gray-600">Analiza el rendimiento de colegios en las pruebas Saber 11</p>
        </div>

        {/* Filtros Año/Periodo */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Año"
              options={YEAR_OPTIONS}
              value={year}
              onChange={(e: any) => setYear(e.target ? e.target.value : e)}
            />
            <Select
              label="Periodo"
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(e: any) => setPeriod(e.target ? e.target.value : e)}
            />
            <div className="flex items-end">
              <Badge variant="primary">{`Año ${year} • Periodo ${period} • ano=${ano}`}</Badge>
            </div>
          </div>
        </Card>

        {/* Tabla */}
        <Card>
          {loading ? (
            <div className="text-center py-8"><Spinner size="lg" /><p>Cargando datos...</p></div>
          ) : error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Colegio</th>
                    <th className="px-6 py-3">Estudiantes</th>
                    <th className="px-6 py-3">Media Global</th>
            
                    <th className="px-6 py-3">Rendimiento</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {colegios.map((c, i) => (
                    <tr key={`${c.colegio_nombre}-${i}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{c.colegio_nombre}<br /><span className="text-sm text-gray-500">{c.municipio}</span></td>
                      <td className="px-6 py-4">{c.n_estu}</td>
                      <td className="px-6 py-4">{c.media_global.toFixed(1)}<br /><span className="text-sm">σ={c.sd_global.toFixed(1)}</span></td>
                      <td className="px-6 py-4">{getPerformanceBadge(c.media_global)}</td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedColegio(c); setShowModal(true); }}>
                          <Eye className="h-4 w-4 mr-1" /> Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal */}
        {showModal && selectedColegio && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-11/12 max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedColegio.colegio_nombre}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><strong>Municipio:</strong> {selectedColegio.municipio}</div>
                <div><strong>Estudiantes:</strong> {selectedColegio.n_estu}</div>
                <div><strong>Media Global:</strong> {selectedColegio.media_global.toFixed(1)}</div>
                <div><strong>σ:</strong> {selectedColegio.sd_global.toFixed(1)}</div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getColegioDetailsData(selectedColegio)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="puntaje" fill="#3b82f6" />
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
