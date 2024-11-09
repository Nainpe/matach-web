import { create } from 'zustand'
import { getCookie, setCookie } from 'cookies-next'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  stock: number
}

interface CartStore {
  cartItems: CartItem[]
  addToCart: (product: CartItem) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  initializeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      initializeCart: () => {
        try {
          const cartCookie = getCookie('cart')
          if (cartCookie) {
            const parsedCart = JSON.parse(cartCookie as string)
            const validItems = parsedCart.filter((item: any) => 
              item.id && 
              item.name && 
              typeof item.price === 'number' && 
              typeof item.quantity === 'number' &&
              item.imageUrl
            )
            set({ cartItems: validItems })
          }
        } catch (error) {
          console.error('Error al inicializar el carrito:', error)
        }
      },

      addToCart: (product) => {
        if (!product.id || !product.name || typeof product.price !== 'number') {
          console.error('Producto inválido:', product)
          return
        }

        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id)
          let updatedCartItems

          if (existingItem) {
            // Actualizar cantidad si el producto ya existe
            updatedCartItems = state.cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            )
          } else {
            // Agregar nuevo producto al array existente
            updatedCartItems = [...state.cartItems, product]
          }

          // Guardar en cookies
          setCookie('cart', JSON.stringify(updatedCartItems), {
            maxAge: 60 * 60 * 24 * 7, // 7 días
            path: '/' // Importante: hacer la cookie accesible en todas las rutas
          })

          return { cartItems: updatedCartItems }
        })
      },

      updateCartItemQuantity: (id, quantity) => {
        set((state) => {
          const updatedCartItems = state.cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
          
          setCookie('cart', JSON.stringify(updatedCartItems), {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
          })
          
          return { cartItems: updatedCartItems }
        })
      },

      removeFromCart: (id) => {
        set((state) => {
          const updatedCartItems = state.cartItems.filter(item => item.id !== id)
          
          setCookie('cart', JSON.stringify(updatedCartItems), {
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
          })
          
          return { cartItems: updatedCartItems }
        })
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
