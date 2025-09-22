import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Saber Pro</span>
            </div>
            <p className="mt-4 text-gray-600 text-sm leading-6">
              Sistema de predicción y análisis de resultados Saber Pro basado en puntajes Saber 11 
              y características institucionales. Desarrollado con metodología de ciencia de datos 
              y aprendizaje automático.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Inicio</Link></li>
              <li><Link to="/predict" className="text-sm text-gray-600 hover:text-gray-900">Predicción</Link></li>
              <li><Link to="/colegios" className="text-sm text-gray-600 hover:text-gray-900">Explorar Colegios</Link></li>
              <li><Link to="/programas" className="text-sm text-gray-600 hover:text-gray-900">Explorar Programas</Link></li>
              <li><Link to="/va" className="text-sm text-gray-600 hover:text-gray-900">Valor Agregado</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Información</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">Metodología</Link></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Términos de Uso</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacidad</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Saber Pro Predict. Todos los derechos reservados.
            </p>
            <div className="text-sm text-gray-400">
              Datos: ICFES | Modelo: R² = 0.85, RMSE = 12.3
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};