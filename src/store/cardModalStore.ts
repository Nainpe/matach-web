import { create } from 'zustand';

type CardModalStore = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useCardModalStore = create<CardModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
