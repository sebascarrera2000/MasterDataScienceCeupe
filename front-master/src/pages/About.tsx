import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Brain,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
} from 'lucide-react';

export const About: React.FC = () => {
  const modelMetrics = [
    { metric: 'R² Score', value: 0.236, description: 'Varianza explicada promedio por el modelo' },
    { metric: 'RMSE', value: 9.89, description: 'Error cuadrático medio (±1.80)' },
    { metric: 'N° de Muestras', value: 1260866, description: 'Tamaño total del dataset de entrenamiento' },
    { metric: 'Precisión Cuantílica', value: 2, description: 'Intervalos al 10% y 90%' },
  ];

  const featureImportance = [
    { feature: 'Puntaje Global S11', importance: 0.25 },
    { feature: 'Matemáticas S11', importance: 0.18 },
    { feature: 'Lectura Crítica S11', importance: 0.12 },
    { feature: 'Sociales y Ciudadanas S11', importance: 0.10 },
    { feature: 'C. Naturales S11', importance: 0.10 },
    { feature: 'Inglés S11', importance: 0.08 },
    { feature: 'Año', importance: 0.07 },
    { feature: 'Institución de Origen', importance: 0.06 },
    { feature: 'Carácter Académico', importance: 0.04 },
  ];

  const validationByYear = [
    { year: '2019', rmse: 10.5, r2: 0.22 },
    { year: '2020', rmse: 10.1, r2: 0.24 },
    { year: '2021', rmse: 9.9, r2: 0.23 },
    { year: '2022', rmse: 9.7, r2: 0.25 },
    { year: '2023', rmse: 9.5, r2: 0.26 },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Metodología y Información Técnica</h1>
          <p className="mt-2 text-gray-600">
            Conoce cómo funciona nuestro modelo de predicción, sus métricas y limitaciones
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Machine Learning</h3>
            <p className="text-sm text-gray-600">
              Utilizamos un modelo <strong>HistGradientBoostingRegressor</strong> con soporte para
              predicción de cuantiles
            </p>
          </Card>

          <Card className="text-center">
            <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Datos ICFES</h3>
            <p className="text-sm text-gray-600">
              Basado en 1,260,866 registros de datos históricos oficiales del ICFES
            </p>
          </Card>

          <Card className="text-center">
            <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Intervalos de Confianza</h3>
            <p className="text-sm text-gray-600">
              Generación de intervalos al <strong>10%</strong> y <strong>90%</strong> con artefactos
              <em> pipeline_q10.pkl</em> y <em>pipeline_q90.pkl</em>
            </p>
          </Card>
        </div>

        {/* Model Performance */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rendimiento del Modelo</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {modelMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {typeof metric.value === 'number' && metric.value < 1 && metric.metric !== 'Precisión Cuantílica'
                    ? (metric.value * 100).toFixed(1) + '%'
                    : metric.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-900">{metric.metric}</div>
                <div className="text-xs text-gray-600">{metric.description}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Importancia de Variables</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={featureImportance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="feature" type="category" width={160} />
                  <Tooltip formatter={(v: any) => [`${(v * 100).toFixed(1)}%`, 'Importancia']} />
                  <Bar dataKey="importance" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Evolución de Métricas</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={validationByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="r2" stroke="#3b82f6" name="R² Score" />
                  <Line yAxisId="right" type="monotone" dataKey="rmse" stroke="#ef4444" name="RMSE" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Methodology */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Metodología</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">1. Fuentes de Datos</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Variables de Entrada</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• s11_punt_global</li>
                  <li>• s11_punt_matematicas</li>
                  <li>• s11_punt_lectura_critica</li>
                  <li>• s11_punt_sociales_ciudadanas</li>
                  <li>• s11_punt_c_naturales</li>
                  <li>• s11_punt_ingles</li>
                  <li>• anio</li>
                  <li>• inst_origen</li>
                  <li>• inst_caracter_academico</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">2. Procesamiento de Datos</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Limpieza:</strong> eliminación de inconsistencias y valores atípicos</li>
                  <li><strong>Normalización:</strong> estandarización de textos y categorías</li>
                  <li><strong>Ingeniería de características:</strong> codificación de variables categóricas</li>
                  <li><strong>Imputación:</strong> tratamiento de valores faltantes</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">3. Modelado</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Modelo:</strong> HistGradientBoostingRegressor</li>
                  <li><strong>Predicción Cuantílica:</strong> activa (10% y 90%)</li>
                  <li><strong>N° de muestras:</strong> 1,260,866</li>
                  <li><strong>Artefactos:</strong> pipeline_q10.pkl, pipeline_q90.pkl</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Limitations */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Limitaciones y Consideraciones</h2>

          <div className="space-y-4">
            <Alert variant="warning">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <strong>Limitaciones del Modelo:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• R² relativamente bajo (0.23), explica parte limitada de la varianza</li>
                  <li>• Precisión varía según programa académico e institución</li>
                  <li>• No considera factores personales o motivacionales</li>
                  <li>• Depende de la calidad de los datos de entrada</li>
                </ul>
              </div>
            </Alert>

            <Alert variant="info">
              <CheckCircle className="h-5 w-5" />
              <div>
                <strong>Uso Recomendado:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Interpretar como estimación orientativa</li>
                  <li>• Complementar con análisis académico adicional</li>
                  <li>• Considerar los intervalos al 10% y 90%</li>
                  <li>• No usar como decisión definitiva</li>
                </ul>
              </div>
            </Alert>
          </div>
        </Card>

        {/* Technical Details */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles Técnicos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Especificaciones del Modelo</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Algoritmo:</strong> HistGradientBoostingRegressor</li>
                  <li><strong>Predicción de Cuantiles:</strong> Sí (0.1 y 0.9)</li>
                  <li><strong>N° de Muestras:</strong> 1,260,866</li>
                  <li><strong>Variables de entrada:</strong> 9</li>
                  <li><strong>Artefactos:</strong> pipeline_q10.pkl, pipeline_q90.pkl</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Métricas de Evaluación</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>RMSE:</strong> 9.89 ± 1.80</li>
                  <li><strong>R² Score:</strong> 0.236 ± 0.132</li>
                  <li><strong>MAE:</strong> No reportado</li>
                  <li><strong>Última actualización:</strong> 2024</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Este modelo fue desarrollado con fines educativos e informativos.
              Utiliza <em>HistGradientBoostingRegressor</em> con predicción de cuantiles para generar
              intervalos de confianza. Los datos provienen de fuentes oficiales del ICFES.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
