// MobileCartSummary.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import styles from './MobileCartSummary.module.css';
import { CartProduct } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { FaMinus, FaPlus } from 'react-icons/fa';
import CartSummaryFooter from './CartSummaryFooter/CartSummaryFooter';

export default function MobileCartSummary() {
  const cartItems: CartProduct[] = useCartStore((state) => state.cartItems);
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleIncrement = (id: string, quantity: number) => {
    updateCartItemQuantity(id, quantity + 1);
  };

  const handleDecrement = (id: string, quantity: number) => {
    if (quantity > 1) {
      updateCartItemQuantity(id, quantity - 1);
    }
  };

  // Define la función applyDiscount para manejar el descuento
  const applyDiscount = (coupon: string) => {
    if (coupon === 'DESCUENTO10') {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return subtotal * 0.1;
    }
    return 0;
  };

  return (
    <div className={styles.cardContainer}>
      {cartItems.map((item) => (
        <div key={item.id} className={styles.productContainer}>
          <div className={styles.header}>
            <button onClick={() => removeFromCart(item.id)} className={styles.closeButton}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Product Image */}
          <div className={styles.imageContainer}>
            <Image
              src={item.imageUrl || '/placeholder.svg'}
              alt={item.name}
              className={styles.image}
              width={200}
              height={200}
            />
          </div>

          {/* Product Info */}
          <div className={styles.content}>
            <h2 className={styles.title}>{item.name}</h2>
            <div className={styles.price}>
              <span className={styles.priceAmount}>
                ${item.price.toLocaleString()}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className={styles.quantityContainer}>
              <span className={styles.quantityLabel}>Cant:</span>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleDecrement(item.id, item.quantity)}
                  className={styles.quantityButton}
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  readOnly
                  className={styles.quantityInput}
                />
                <button
                  onClick={() => handleIncrement(item.id, item.quantity)}
                  className={styles.quantityButton}
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>
                ${(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
      <CartSummaryFooter applyDiscount={applyDiscount} />
    </div>
  );
}
