import { create } from 'zustand';

export interface ClientData {
  nombre: string;
  telefono: string;
  dni: string;
  mesa?: number;
  takeAway: boolean;
}

interface ProductoOrden {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

interface OrderState {
  currentStep: number;
  steps: string[];
  clientData: ClientData;
  productosSeleccionados: ProductoOrden[];
  total: number;
  goNextStep: () => void;
  goPrevStep: () => void;
  setCurrentStep: (index: number) => void;
  setClientData: (data: ClientData) => void;
  agregarProductoOrden: (producto: ProductoOrden) => void;
  eliminarProducto: (productId: string) => void;
  actualizarCantidad: (productId: string, quantity: number) => void;
  calcularTotal: () => number;
  resetForm: () => void;
}

const useOrderForms = create<OrderState>((set, get) => ({
  currentStep: 0,
  steps: ['Datos del Cliente', 'Selección de Productos', 'Resumen y Pago'],
  clientData: {
    nombre: '',
    telefono: '',
    dni: '',
    takeAway: false
  },
  productosSeleccionados: [],
  total: 0,

  goNextStep: () => set((state) => ({
    currentStep: state.currentStep < state.steps.length - 1 
      ? state.currentStep + 1 
      : state.currentStep
  })),

  goPrevStep: () => set((state) => ({
    currentStep: state.currentStep > 0 
      ? state.currentStep - 1 
      : state.currentStep
  })),

  setCurrentStep: (index) => set((state) => ({
    currentStep: index >= 0 && index < state.steps.length 
      ? index 
      : state.currentStep
  })),

  setClientData: (data) => set({ clientData: data }),

  agregarProductoOrden: (producto) => set((state) => {
    const existente = state.productosSeleccionados.find(p => p.id === producto.id);
    
    if (existente) {
      if (existente.quantity >= existente.stock) {
        return state;
      }
      
      return {
        productosSeleccionados: state.productosSeleccionados.map(p =>
          p.id === producto.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        ),
        total: state.total + producto.price
      };
    }
    
    return {
      productosSeleccionados: [...state.productosSeleccionados, { ...producto, quantity: 1 }],
      total: state.total + producto.price
    };
  }),

  eliminarProducto: (productId) => set((state) => {
    const producto = state.productosSeleccionados.find(p => p.id === productId);
    if (!producto) return state;

    return {
      productosSeleccionados: state.productosSeleccionados.filter(p => p.id !== productId),
      total: state.total - (producto.price * producto.quantity)
    };
  }),

  actualizarCantidad: (productId, quantity) => set((state) => {
    if (quantity < 1) return state;

    const producto = state.productosSeleccionados.find(p => p.id === productId);
    if (!producto || quantity > producto.stock) return state;

    const diferencia = quantity - producto.quantity;
    
    return {
      productosSeleccionados: state.productosSeleccionados.map(p =>
        p.id === productId ? { ...p, quantity } : p
      ),
      total: state.total + (diferencia * producto.price)
    };
  }),

  calcularTotal: () => {
    return get().productosSeleccionados.reduce(
      (total, producto) => total + (producto.price * producto.quantity),
      0
    );
  },

  resetForm: () => set({
    productosSeleccionados: [],
    total: 0,
    currentStep: 0,
    clientData: {
      nombre: '',
      telefono: '',
      dni: '',
      takeAway: false
    }
  })
}));

export default useOrderForms;