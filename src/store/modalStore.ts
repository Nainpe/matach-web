import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  step: 'email' | 'code' | 'resetPassword';
  openModal: () => void;
  closeModal: () => void;
  nextStep: () => void;
  setStep: (step: 'email' | 'code' | 'resetPassword') => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  step: 'email',
  openModal: () => set({ isOpen: true }),
  closeModal: () =>
    set({ isOpen: false, step: 'email' }), // Reiniciar el paso al cerrar el modal
  nextStep: () =>
    set((state) => {
      const nextStep =
        state.step === 'email'
          ? 'code'
          : state.step === 'code'
          ? 'resetPassword'
          : state.step;
      return { step: nextStep };
    }),
  setStep: (step) => set({ step }),
}));
