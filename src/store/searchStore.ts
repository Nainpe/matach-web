// src/store/searchStore.ts
import { create } from 'zustand';

interface SearchState {
  isSearchVisible: boolean;
  toggleSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isSearchVisible: false,
  toggleSearch: () => set((state) => ({ isSearchVisible: !state.isSearchVisible })),
}));
