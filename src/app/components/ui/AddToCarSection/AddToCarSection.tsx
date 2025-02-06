'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'; // Importar toaster
import { useCartStore } from '@/store/cartStore'
import styles from './AddToCartSection.module.css'

interface AddToCartSectionProps {
  productId: string
  stock: number
  slug: string
}

interface ProductImage {
  url: string
}

interface Product {
  id: string
  name: string
  price: number
  images: ProductImage[]
  stock: number
}

interface ApiResponse {
  product: Product
  relatedProducts: Product[]
}

export default function AddToCartSection({ productId, stock, slug }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [remainingStock, setRemainingStock] = useState(stock)
  const [productDetails, setProductDetails] = useState<Product | null>(null)
  const addToCart = useCartStore((state) => state.addToCart)
  const cartItems = useCartStore((state) => state.cartItems)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/Products/${slug}`)
        if (response.ok) {
          const data: ApiResponse = await response.json()
          if (data.product) {
            setProductDetails(data.product)
          } else {
            toast.error('No se pudo cargar la información del producto')
          }
        } else {
          toast.error('Error al cargar el producto')
        }
      } catch (error) {
        toast.error('Error al cargar el producto')
      }
    }

    fetchProductDetails()
  }, [slug])

  useEffect(() => {
    const currentProductInCart = cartItems.find((item) => item.id === productId)
    const quantityInCart = currentProductInCart ? currentProductInCart.quantity : 0
    setRemainingStock(stock - quantityInCart)
  }, [cartItems, productId, stock])

  const incrementQuantity = () => {
    if (quantity < remainingStock) {
      setQuantity((prevQuantity) => prevQuantity + 1)
    } else {
      toast.error('No hay más stock disponible para agregar')
    }
  }

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
  }

  const handleAddToCart = () => {
    if (!productDetails) {
      toast.error('Error: No se pueden obtener los detalles del producto')
      return
    }

    if (!productDetails.id || !productDetails.name || typeof productDetails.price !== 'number') {
      toast.error('Error: Información del producto incompleta')
      return
    }

    const cartProduct = {
      id: productDetails.id,
      name: productDetails.name,
      price: productDetails.price,
      quantity,
      imageUrl: productDetails.images[0]?.url || '/path/to/default-image.jpg',
      stock: productDetails.stock,
    }

    addToCart(cartProduct)
    toast.success('Producto agregado al carrito')
    window.dispatchEvent(new Event('cartUpdated'))
  }

  if (!productDetails) {
    return <div>Cargando...</div>
  }

  return (
    <div className={styles['add-to-cart-container']}>
      <div className={styles['product-quantity-counter']}>
        <button
          className={`${styles['quantity-btn']} ${styles.decrement}`}
          onClick={decrementQuantity}
          aria-label="Decrease quantity"
          type="button"
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          className={styles['quantity-input']}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Math.min(remainingStock, parseInt(e.target.value) || 1)))
          }
          min="1"
          aria-label="Product quantity"
        />
        <button
          className={`${styles['quantity-btn']} ${styles.increment}`}
          onClick={incrementQuantity}
          aria-label="Increase quantity"
          type="button"
          disabled={quantity >= remainingStock}
        >
          +
        </button>
        <button
          className={styles['add-to-cart-btn']}
          onClick={handleAddToCart}
          type="button"
          disabled={remainingStock === 0}
        >
          {remainingStock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
