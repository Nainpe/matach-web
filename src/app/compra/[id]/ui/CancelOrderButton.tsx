'use client';

import { useCardModalStore } from '../../../../store/cardModalStore';
import CancelOrderModal from './CancelOrderModal';
import styles from './CancelOrderButton.module.css';

interface CancelOrderButtonProps {
  orderId: string;
  orderStatus: string;
}

export default function CancelOrderButton({ orderId, orderStatus }: CancelOrderButtonProps) {
  const { openModal } = useCardModalStore();

  if (orderStatus === 'CANCELLED') return null;

  return (
    <div className={styles.container}>
      <p className={styles.warningText}>¿Deseas cancelar esta orden?</p>
      <button
        className={styles.cancelButton}
        onClick={openModal}
      >
        Confirmar Cancelación
      </button>
      <CancelOrderModal orderId={orderId} />
    </div>
  );
}