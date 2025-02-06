// src/app/components/ui/CartSummaryBox/CartSummaryBox.tsx
'use client';

import React, { useState } from 'react';
import styles from './CartSummaryBox.module.css';
import { CartProduct } from '@/types';
import Link from 'next/link';

interface CartSummaryBoxProps {
  cartItems: CartProduct[];
  totalPrice: number;
}

const CartSummaryBox: React.FC<CartSummaryBoxProps> = ({ cartItems, totalPrice }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const validCoupons: { [code: string]: number } = {
    'DESCUENTO10': 0.10,
    'DESCUENTO20': 0.20,
  };

  const handleApplyCoupon = () => {
    if (validCoupons[couponCode]) {
      setDiscount(validCoupons[couponCode]);
      setErrorMessage('');
    } else {
      setErrorMessage('Cupón no válido');
      setDiscount(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  const finalPrice = totalPrice - totalPrice * discount;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;

  return (
    <div className={styles.summaryBox}>
      <h2 className={styles.resumen}>Resumen</h2>
      <div className={styles.couponSection}>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ingresa tu cupón"
          className={styles.couponInput}
        />
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
      <div className={styles.subtotalContainer}>
        <span>Subtotal</span>
        <span className={styles.subtototalPrice}>${subtotal.toLocaleString('es-AR')}</span>
      </div>
      {discount > 0 && (
        <div className={styles.discountContainer}>
          <span>Descuento</span>
          <span className={styles.discountContainerNumber} >-${discountAmount.toLocaleString('es-AR')}</span>
        </div>
      )}
      <hr className={styles.divider} />

      <div className={styles.totalPriceContainer}>
        <span>Total</span>
        <span>${finalPrice.toLocaleString('es-AR')}</span>
      </div>
      <Link href='/resumen'>
      <button className={styles.checkoutButton}>Proceder al pago</button>
      </Link>
    </div>
  );
};

export default CartSummaryBox;
