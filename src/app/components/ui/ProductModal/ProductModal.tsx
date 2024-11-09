import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';

interface InstallmentOption {
  months: number;
  amount: number;
  hasInterest: boolean;
}

interface ProductModalProps {
  product: {
    id: string;
    price: number;
  };
  installmentOptions: InstallmentOption[];
  isOpen: boolean;
  onClose: () => void;
}

// Función para formatear números en formato argentino
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default function ProductModal({ product, installmentOptions, isOpen, onClose }: ProductModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtramos las opciones de cuotas para que solo se incluyan las de interés y los meses deseados
  const filteredOptions = installmentOptions.filter(option => 
    option.hasInterest && [3, 6, 9, 12].includes(option.months)
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.subtitle}>Opciones de cuotas:</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Meses</th>
              <th>Cuota</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOptions.map((option, index) => (
              <tr key={index} className={styles.listItem}>
                <td>{option.months} cuota{option.months > 1 ? 's' : ''}</td>
                <td>{formatCurrency(option.amount)}</td>
                <td>{formatCurrency(option.amount * option.months)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
      </div>
    </div>
  );
}
