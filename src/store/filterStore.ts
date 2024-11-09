// src/store/filterStore.ts
import { create } from 'zustand';

interface FilterState {
  isOpen: boolean;
  selectedBrands: string[];
  priceRange: [number, number];
  toggleFilter: () => void;
  setBrands: (brands: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isOpen: false,
  selectedBrands: [],
  priceRange: [0, 10000], // Rango de precio inicial
  toggleFilter: () => set((state) => ({ isOpen: !state.isOpen })),
  setBrands: (brands) => set({ selectedBrands: brands }),
  setPriceRange: (range) => set({ priceRange: range }),
}));
