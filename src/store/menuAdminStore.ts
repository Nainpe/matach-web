// store/menuStore.ts
import { create } from 'zustand';

interface MenuState {
  isMenuOpen: boolean;
  selectedOrderId: string | null;
  toggleMenu: (orderId?: string) => void;
}

export const useMenuAdminStore = create<MenuState>((set) => ({
  isMenuOpen: false,
  selectedOrderId: null,
  toggleMenu: (orderId = null) => set((state) => ({
    isMenuOpen: orderId !== state.selectedOrderId || !state.isMenuOpen,
    selectedOrderId: orderId,
  })),
}));