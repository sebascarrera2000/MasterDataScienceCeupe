// src/services/api.ts
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8003/api";

export const apiClient = {
  async predict(data: {
    anio: number;
    s11_punt_global: number;
    s11_punt_matematicas: number;
    s11_punt_lectura_critica: number;
    s11_punt_sociales_ciudadanas: number;
    s11_punt_c_naturales: number;
    s11_punt_ingles: number;
    inst_origen: string;
    inst_caracter_academico: string;
    colegio_nombre: string;
    municipio: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/predict`, data);
    return response.data;
  },

  async getMunicipios(query: string): Promise<string[]> {
    // Dummy por ahora
    return ["PASTO", "IPIALES", "TUMACO"].filter(m =>
      m.toLowerCase().includes(query.toLowerCase())
    );
  },

  async getColegios(municipio: string, query: string): Promise<{ nombre: string; municipio: string }[]> {
    // Dummy por ahora
    return [
      { nombre: "COLEGIO SAN IGNACIO", municipio },
      { nombre: "COLEGIO DE LA PRESENTACIÓN", municipio }
    ].filter(c => c.nombre.toLowerCase().includes(query.toLowerCase()));
  },

  async getProgramas(_: string | undefined, municipio: string, query: string): Promise<{ programa_id: string; label: string }[]> {
    // Dummy por ahora
    return [
      { programa_id: "ING_SIST", label: "Ingeniería de Sistemas" },
      { programa_id: "ADM_EMP", label: "Administración de Empresas" }
    ].filter(p => p.label.toLowerCase().includes(query.toLowerCase()));
  }
};
