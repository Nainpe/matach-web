'use client';

import React, { useState } from 'react';
import styles from './ApplyCoupon.module.css';

interface ApplyCouponProps {
  onApplyCoupon: (discountAmount: number) => void;
}

const ApplyCoupon: React.FC<ApplyCouponProps> = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`/api/coupons/${couponCode}`);
      if (!response.ok) {
        throw new Error('Cupón no válido o expirado.');
      }

      const { discountAmount } = await response.json();
      onApplyCoupon(discountAmount);  // Aplica el descuento
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.couponContainer}>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Ingresa el código del cupón"
        className={styles.couponInput}
      />
      <button onClick={handleApplyCoupon} className={styles.applyButton}>Aplicar</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ApplyCoupon;
