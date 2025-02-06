import { create } from "zustand";

interface ShippingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
}

interface PickupData {
  pickupName: string;
  pickupDni: string;
}

interface ShippingStore {
  shippingOption: 'retiro' | 'delivery' | 'uber'; 
  shippingData: ShippingData;
  pickupData: PickupData;
  setShippingOption: (option: 'retiro' | 'delivery' | 'uber') => void;
  setShippingData: (data: Partial<ShippingData>) => void;
  setPickupData: (data: Partial<PickupData>) => void;
}

const initialShippingData: ShippingData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  dni: '',
  address: '',
  province: '',
  city: '',
  postalCode: '',
  additionalInfo: '',
};

const initialPickupData: PickupData = {
  pickupName: '',
  pickupDni: '',
};

export const useShippingStore = create<ShippingStore>((set) => ({
  shippingOption: 'retiro', // Valor inicial, puede ser 'retiro', 'delivery', o 'uber'
  shippingData: initialShippingData,
  pickupData: initialPickupData,
  setShippingOption: (option) => set({ shippingOption: option }), // Esta función ahora acepta 'uber'
  setShippingData: (data) => {
    set((state) => ({
      shippingData: { ...state.shippingData, ...data }
    }));
  },
  setPickupData: (data) => {
    set((state) => ({
      pickupData: { ...state.pickupData, ...data }
    }));
  },
}));