import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store';

// Pages
import { Home } from './pages/Home';
import { Predict } from './pages/Predict';
import { Colegios } from './pages/Colegios';
import { About } from './pages/About';
import { Programas } from './pages/Programas';
import { ProgramasVA } from './pages/ProgramasVA';
// Toast component for notifications
const Toast: React.FC = () => {
  const { ui, removeToast } = useStore();

  useEffect(() => {
    ui.toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [ui.toasts, removeToast]);

  if (ui.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {ui.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 ${
            toast.type === 'error' ? 'border-l-4 border-red-400' :
            toast.type === 'success' ? 'border-l-4 border-green-400' :
            'border-l-4 border-blue-400'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {toast.type === 'error' ? 'Error' : 
                   toast.type === 'success' ? 'Éxito' : 'Información'}
                </p>
                <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(toast.id)}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/colegios" element={<Colegios />} />
          <Route path="/about" element={<About />} />
          <Route path='/programas' element={<Programas />} />
          <Route path='/va' element={<ProgramasVA/>} />
       
        </Routes>
        <Toast />
      </div>
    </Router>
  );
};

export default App;