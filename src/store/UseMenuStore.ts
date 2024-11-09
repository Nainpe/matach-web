// store/userMenuStore.ts

import { create } from "zustand";

interface UserMenuState {
  isUserMenuOpen: boolean;
  toggleUserMenu: () => void;
}

export const useUserMenuStore = create<UserMenuState>((set) => ({
  isUserMenuOpen: false,
  toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
}));
