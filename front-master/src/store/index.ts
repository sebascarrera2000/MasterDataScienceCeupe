import { create } from 'zustand';
import { Filters, Catalogs, PredictionInput, PredictionResult, ApiError } from '../types';

interface AppState {
  // Filters
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;

  // Catalogs
  catalogs: Catalogs;
  setCatalogs: (key: keyof Catalogs, data: any) => void;
  loadingCatalogs: Record<keyof Catalogs, boolean>;
  setLoadingCatalog: (key: keyof Catalogs, loading: boolean) => void;

  // Prediction
  prediction: {
    input: PredictionInput | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    result: PredictionResult | null;
    error: ApiError | null;
  };
  setPrediction: (data: Partial<AppState['prediction']>) => void;

  // UI
  ui: {
    sideMenuOpen: boolean;
    darkMode: boolean;
    loading: boolean;
    toasts: Array<{ id: string; type: 'success' | 'error' | 'info'; message: string; }>;
  };
  setUI: (data: Partial<AppState['ui']>) => void;
  addToast: (toast: Omit<AppState['ui']['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
}

const initialFilters: Filters = {
  anio: null,
  municipio: null,
  institucion: null,
  programaId: null,
};

const initialCatalogs: Catalogs = {
  municipios: [],
  colegios: [],
  instituciones: [],
  programas: [],
};

export const useStore = create<AppState>((set, get) => ({
  // Filters
  filters: initialFilters,
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({ filters: initialFilters }),

  // Catalogs
  catalogs: initialCatalogs,
  setCatalogs: (key, data) => set((state) => ({
    catalogs: { ...state.catalogs, [key]: data }
  })),
  loadingCatalogs: {
    municipios: false,
    colegios: false,
    instituciones: false,
    programas: false,
  },
  setLoadingCatalog: (key, loading) => set((state) => ({
    loadingCatalogs: { ...state.loadingCatalogs, [key]: loading }
  })),

  // Prediction
  prediction: {
    input: null,
    status: 'idle',
    result: null,
    error: null,
  },
  setPrediction: (data) => set((state) => ({
    prediction: { ...state.prediction, ...data }
  })),

  // UI
  ui: {
    sideMenuOpen: false,
    darkMode: false,
    loading: false,
    toasts: [],
  },
  setUI: (data) => set((state) => ({
    ui: { ...state.ui, ...data }
  })),
  addToast: (toast) => set((state) => ({
    ui: {
      ...state.ui,
      toasts: [...state.ui.toasts, { ...toast, id: Date.now().toString() }]
    }
  })),
  removeToast: (id) => set((state) => ({
    ui: {
      ...state.ui,
      toasts: state.ui.toasts.filter(t => t.id !== id)
    }
  })),
}));