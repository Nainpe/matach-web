import React from 'react';
import styles from './CardModal.module.css';
import { useCardModalStore } from '@/store/cardModalStore';


interface InstallmentOption {
  months: number;
  amount: number;
  hasInterest: boolean;
}

interface CardModalProps {
  installmentOptions: InstallmentOption[];
}

export default function CardModal({ installmentOptions }: CardModalProps) {
  const { isOpen, closeModal } = useCardModalStore();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Opciones de Cuotas</h2>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>

        <ul className={styles.installmentList}>
          {installmentOptions.map((option, index) => (
            <li key={index} className={styles.installmentItem}>
              <span>
                {option.months} {option.months > 1 ? 'cuotas' : 'cuota'} de{' '}
                <strong>${option.amount.toFixed(2)}</strong>
              </span>
              {option.hasInterest && <span className={styles.interest}>Con interés</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
