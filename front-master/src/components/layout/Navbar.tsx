import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../store';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { ui, setUI } = useStore();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Predicción', href: '/predict' },
    { name: 'Colegios', href: '/colegios' },
    { name: 'Programas', href: '/programas' },
    { name: 'Valor Agregado', href: '/va' },
    { name: 'Acerca', href: '/about' },
  ];

  const toggleSideMenu = () => {
    setUI({ sideMenuOpen: !ui.sideMenuOpen });
  };

  const toggleDarkMode = () => {
    setUI({ darkMode: !ui.darkMode });
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSideMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Saber Pro</span>
            </Link>

            <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
           

            
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {ui.sideMenuOpen && (
        <div className="lg:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === item.href
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setUI({ sideMenuOpen: false })}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};