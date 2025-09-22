import { PredictionInput, PredictionResult, ColegioEDA, ProgramaEDA, MunicipioEDA, VAPrograma } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }

  // Prediction
  async predict(input: PredictionInput): Promise<PredictionResult> {
    return this.request<PredictionResult>('/api/predict', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // EDA endpoints
  async getColegioEDA(colegio_nombre: string, municipio: string, anio?: number): Promise<{ colegio: ColegioEDA }> {
    const params = new URLSearchParams({ colegio_nombre, municipio });
    if (anio) params.append('anio', anio.toString());
    
    return this.request<{ colegio: ColegioEDA }>(`/api/eda/colegio?${params}`);
  }

  async getProgramaEDA(programa_id: string, anio?: number): Promise<{ programa: ProgramaEDA }> {
    const params = new URLSearchParams({ programa_id });
    if (anio) params.append('anio', anio.toString());
    
    return this.request<{ programa: ProgramaEDA }>(`/api/eda/programa?${params}`);
  }

  async getMunicipioEDA(municipio: string, anio?: number): Promise<{ municipio: MunicipioEDA }> {
    const params = new URLSearchParams({ municipio });
    if (anio) params.append('anio', anio.toString());
    
    return this.request<{ municipio: MunicipioEDA }>(`/api/eda/municipio?${params}`);
  }

  async getVARanking(anio?: number, institucion?: string, municipio?: string, limit = 50): Promise<{ anio: number; items: VAPrograma[] }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (anio) params.append('anio', anio.toString());
    if (institucion) params.append('institucion', institucion);
    if (municipio) params.append('municipio', municipio);
    
    return this.request<{ anio: number; items: VAPrograma[] }>(`/api/va/ranking?${params}`);
  }

  // Catalogs
  async getMunicipios(search?: string): Promise<string[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    return this.request<string[]>(`/api/catalogs/municipios?${params}`);
  }

  async getColegios(municipio?: string, search?: string): Promise<Array<{ nombre: string; municipio: string; }>> {
    const params = new URLSearchParams();
    if (municipio) params.append('municipio', municipio);
    if (search) params.append('search', search);
    
    return this.request<Array<{ nombre: string; municipio: string; }>>(`/api/options/colegios?${params}`);
  }

  async getProgramas(institucion?: string, municipio?: string, search?: string): Promise<Array<{ programa_id: string; label: string; }>> {
    const params = new URLSearchParams();
    if (institucion) params.append('institucion', institucion);
    if (municipio) params.append('municipio', municipio);
    if (search) params.append('search', search);
    
    return this.request<Array<{ programa_id: string; label: string; }>>(`/api/options/programas?${params}`);
  }
}

export const apiClient = new ApiClient();