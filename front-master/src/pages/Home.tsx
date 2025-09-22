import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Calculator,
  School,
  TrendingUp,
  BarChart3,
  Users,
  Award,
  Github,
  Heart,
  GraduationCap,
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Predice tu puntaje en
            <span className="text-blue-600"> Saber Pro</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Utiliza nuestro modelo de aprendizaje automático para predecir tu resultado en Saber Pro
            basado en tus puntajes de Saber 11 y características de tu institución educativa.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/predict">
              <Button size="lg" className="px-8">
                <Calculator className="h-5 w-5 mr-2" />
                Empezar Predicción
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Ver Metodología
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-gray-600">Precisión del modelo (R²)</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">12.3</div>
            <div className="text-sm text-gray-600">Error promedio (RMSE)</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600">+50k</div>
            <div className="text-sm text-gray-600">Predicciones realizadas</div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explora nuestras herramientas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Predice tu Saber Pro
              </h3>
              <p className="text-gray-600 mb-4">
                Ingresa tus puntajes de Saber 11 y datos de tu colegio para obtener
                una predicción personalizada de tu resultado en Saber Pro.
              </p>
              <Link to="/predict">
                <Button variant="outline" size="sm">
                  Comenzar
                </Button>
              </Link>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <School className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Explora tu Colegio
              </h3>
              <p className="text-gray-600 mb-4">
                Analiza el rendimiento histórico de tu colegio y compáralo
                con otros del mismo municipio o región.
              </p>
              <Link to="/colegios">
                <Button variant="outline" size="sm">
                  Explorar
                </Button>
              </Link>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Conoce el Valor Agregado
              </h3>
              <p className="text-gray-600 mb-4">
                Descubre qué programas académicos agregan más valor
                al desarrollo de sus estudiantes.
              </p>
              <Link to="/va">
                <Button variant="outline" size="sm">
                  Ver Ranking
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Latest Year Panel */}
        <div className="mt-20">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Datos más Recientes</h3>
                <p className="text-gray-600">Información del último año disponible (2024)</p>
              </div>
              <Badge variant="primary">Actualizado</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">2,458</div>
                  <div className="text-sm text-gray-600">Colegios analizados</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">128k</div>
                  <div className="text-sm text-gray-600">Estudiantes evaluados</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <School className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">1,250</div>
                  <div className="text-sm text-gray-600">Programas académicos</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">152.4</div>
                  <div className="text-sm text-gray-600">Puntaje promedio nacional</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Personal & Acknowledgements */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sobre el autor & Agradecimientos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Autor */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Juan Sebastián Carrea Bolaños
                </h3>
                <Badge variant="secondary">Autor</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Desarrollador del proyecto y autor del TFM orientado a predicción del desempeño en
                Saber Pro, análisis EDA y ranking por Valor Agregado.
              </p>
              <a
                href="https://github.com/sebascarrera2000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                aria-label="GitHub de Juan Sebastián Carrea Bolaños"
              >
                <Github className="h-5 w-5" />
                github.com/sebascarrera2000
              </a>
            </Card>

            {/* Proyecto */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Trabajo Fin de Máster</h3>
                <Badge variant="primary">TFM</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Plataforma web que integra catálogos ICFES, predicción con intervalos (q10–q90),
                exploración de colegios y ranking de programas por Valor Agregado.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                Tecnologías: React, TypeScript, Tailwind, Recharts, APIs propias (EDA / VA / Predict).
              </div>
            </Card>

            {/* Agradecimientos */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Agradecimientos</h3>
                <Badge variant="success" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> Gracias
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Un agradecimiento especial a <strong>CEUPE</strong> por su formación en Data Science.
                Espero que disfruten el trabajo desarrollado en este TFM y que sea útil para la
                comunidad académica.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-gray-700">
                <GraduationCap className="h-4 w-4 text-purple-600" />
                <span className="text-xs">Centro Europeo de Postgrado • CEUPE</span>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-blue-600 rounded-2xl px-6 py-12 text-white">
          <h2 className="text-3xl font-bold">¿Listo para conocer tu predicción?</h2>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Nuestro modelo utiliza técnicas avanzadas de machine learning para brindarte
            la predicción más precisa basada en datos históricos del ICFES.
          </p>
          <div className="mt-8">
            <Link to="/predict">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calculator className="h-5 w-5 mr-2" />
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
