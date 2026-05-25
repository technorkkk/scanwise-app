import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/lib/i18n';

interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  category: string | null;
  nutri_score: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  nova_group: 1 | 2 | 3 | 4 | null;
  eco_score: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  health_score: number | null;
  calories_per_100g: number | null;
  fat_per_100g: number | null;
  saturated_fat_per_100g: number | null;
  carbs_per_100g: number | null;
  sugar_per_100g: number | null;
  fiber_per_100g: number | null;
  protein_per_100g: number | null;
  salt_per_100g: number | null;
  sodium_per_100g: number | null;
  ingredients_text: string | null;
  allergens: string[] | null;
  additives: string[] | null;
  processing_level: 'minimally_processed' | 'processed' | 'ultra_processed' | null;
  ai_summary_en: string | null;
  ai_summary_hi: string | null;
  source: string | null;
}

interface ScanHistoryItem {
  id: string;
  product: Product;
  scannedAt: string;
}

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  scanHistory: ScanHistoryItem[];
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
  currentProduct: Product | null;
  setCurrentProduct: (product: Product | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      compareProducts: [],
      addToCompare: (product) => {
        const current = get().compareProducts;
        if (current.length < 4 && !current.find((p) => p.id === product.id)) {
          set({ compareProducts: [...current, product] });
        }
      },
      removeFromCompare: (id) =>
        set({ compareProducts: get().compareProducts.filter((p) => p.id !== id) }),
      clearCompare: () => set({ compareProducts: [] }),
      favoriteIds: [],
      toggleFavorite: (id) => {
        const current = get().favoriteIds;
        if (current.includes(id)) {
          set({ favoriteIds: current.filter((i) => i !== id) });
        } else {
          set({ favoriteIds: [...current, id] });
        }
      },
      scanHistory: [],
      addToHistory: (product) => {
        const current = get().scanHistory;
        const exists = current.find((h) => h.product.id === product.id);
        if (!exists) {
          set({
            scanHistory: [
              { id: crypto.randomUUID(), product, scannedAt: new Date().toISOString() },
              ...current,
            ].slice(0, 100),
          });
        }
      },
      clearHistory: () => set({ scanHistory: [] }),
      currentProduct: null,
      setCurrentProduct: (product) => set({ currentProduct: product }),
    }),
    {
      name: 'scanwise-store',
      partialize: (state) => ({
        locale: state.locale,
        favoriteIds: state.favoriteIds,
        scanHistory: state.scanHistory,
      }),
    }
  )
);

export type { Product, ScanHistoryItem };
