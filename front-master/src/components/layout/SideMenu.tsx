import React from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { AutoComplete } from '../ui/AutoComplete';
import { Button } from '../ui/Button';
import { useStore } from '../../store';
import { apiClient } from '../../services/api';

export const SideMenu: React.FC = () => {
  const { filters, setFilters, resetFilters, catalogs, setCatalogs, loadingCatalogs, setLoadingCatalog } = useStore();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  const handleMunicipioSearch = async (query: string) => {
    if (query.length < 2) return;
    
    setLoadingCatalog('municipios', true);
    try {
      const municipios = await apiClient.getMunicipios(query);
      setCatalogs('municipios', municipios.map(m => ({ value: m, label: m })));
    } catch (error) {
      console.error('Error loading municipios:', error);
    } finally {
      setLoadingCatalog('municipios', false);
    }
  };

  const handleColegioSearch = async (query: string) => {
    if (query.length < 2) return;
    
    setLoadingCatalog('colegios', true);
    try {
      const colegios = await apiClient.getColegios(filters.municipio || undefined, query);
      setCatalogs('colegios', colegios.map(c => ({ value: c.nombre, label: `${c.nombre} - ${c.municipio}` })));
    } catch (error) {
      console.error('Error loading colegios:', error);
    } finally {
      setLoadingCatalog('colegios', false);
    }
  };

  return (
    <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
 
    </div>
  );
};