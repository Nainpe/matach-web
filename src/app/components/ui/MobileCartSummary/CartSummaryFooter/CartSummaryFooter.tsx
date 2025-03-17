

import { useState } from 'react';
import styles from './CartSummaryFooter.module.css';
import { useCartStore } from '../../../../../store/cartStore';


interface CartSummaryFooterProps {
  applyDiscount: (coupon: string) => number;
}

export default function CartSummaryFooter({ applyDiscount }: CartSummaryFooterProps) {
  const cartItems = useCartStore((state) => state.cartItems);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  const handleApplyCoupon = () => {
    const discountValue = applyDiscount(coupon);
    if (discountValue > 0) {
      setDiscount(discountValue);
      setError('');
    } else {
      setError('Cupón inválido');
      setDiscount(0);
    }
  };

  const total = subtotal - discount;

  return (
    <div className={styles.footerContainer}>
      <div className={styles.summaryRow}>
        <span>Subtotal:</span>
        <span>${subtotal.toLocaleString()}</span>
      </div>
      
      <div className={styles.summaryRow}>
        <span>Descuento:</span>
        <span>${discount.toLocaleString()}</span>
      </div>
      
      <div className={styles.summaryRowTotal}>
        <span>Total:</span>
        <span>${total.toLocaleString()}</span>
      </div>

      <div className={styles.couponContainer}>
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Ingresa tu cupón"
          className={styles.couponInput}
        />
        <button onClick={handleApplyCoupon} className={styles.applyCouponButton}>
          Aplicar Cupón
        </button>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
}
