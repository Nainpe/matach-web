'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import styles from './AddToCartSection.module.css'
import { getCookie, setCookie } from 'cookies-next'
import ApprovalMessage from '../MessageStack/ApprovalMessage.tsx/ApprovalMessage'
import ErrorMessage from '../MessageStack/ErrorMessage/ErrorMessage'
import MessageStack from '../MessageStack/MessageStack'

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

interface Message {
  id: number
  text: string
}

export default function AddToCartSection({ productId, stock, slug }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [errorMessages, setErrorMessages] = useState<Message[]>([])
  const [approvalMessages, setApprovalMessages] = useState<Message[]>([])
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
          console.log('Respuesta completa de la API:', data)
          
          if (data.product) {
            const product = data.product
            setProductDetails({
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              stock: product.stock
            })
            console.log('Detalles del producto establecidos:', product)
          } else {
            console.error('No se encontraron datos del producto en la respuesta')
            showErrorMessage('No se pudo cargar la información del producto')
          }
        } else {
          console.error('Error en la respuesta de la API')
          showErrorMessage('Error al cargar el producto')
        }
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error)
        showErrorMessage('Error al cargar el producto')
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
      setErrorMessages([])
    } else {
      showErrorMessage('No hay más stock disponible para agregar')
    }
  }

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
    setErrorMessages([])
  }

  const showApprovalMessage = (text: string) => {
    const newMessage: Message = { id: Date.now(), text }
    setApprovalMessages((prevMessages) => [...prevMessages, newMessage])
    setTimeout(() => {
      setApprovalMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id))
    }, 3000)
  }

  const showErrorMessage = (text: string) => {
    const newMessage: Message = { id: Date.now(), text }
    setErrorMessages((prevMessages) => [...prevMessages, newMessage])
    setTimeout(() => {
      setErrorMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id))
    }, 3000)
  }

  const handleAddToCart = async () => {
    if (!productDetails) {
      showErrorMessage('Error: No se pueden obtener los detalles del producto')
      return
    }
  
    if (!productDetails.id || !productDetails.name || typeof productDetails.price !== 'number') {
      console.error('Datos del producto incompletos:', productDetails)
      showErrorMessage('Error: Información del producto incompleta')
      return
    }
  
    const cartProduct = {
      id: productDetails.id,
      name: productDetails.name,
      price: productDetails.price,
      quantity: quantity,
      imageUrl: productDetails.images[0]?.url || '/path/to/default-image.jpg',
      stock: productDetails.stock,
    }
  
    console.log('Producto a añadir al carrito:', cartProduct)
  
    addToCart(cartProduct)
    showApprovalMessage('Producto agregado al carrito')
  
    // Disparar evento para actualizar el Navbar
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
      <MessageStack
        errorMessages={errorMessages}
        approvalMessages={approvalMessages}
        onRemoveError={(id) => setErrorMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))}
        onRemoveApproval={(id) => setApprovalMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))}
      />
    </div>
  )
}