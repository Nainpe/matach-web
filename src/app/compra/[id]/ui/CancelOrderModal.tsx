'use client';

import { useState } from 'react';
import styles from './CancelOrderModal.module.css';
import { cancelOrder } from '../../../../actions/order/cancelOrder';
import { useCardModalStore } from '../../../../store/cardModalStore';

interface CancelOrderModalProps {
  orderId: string; // Prop para el ID de la orden
}

export default function CancelOrderModal({ orderId }: CancelOrderModalProps) {
  const { isOpen, closeModal } = useCardModalStore();
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor, ingresa un motivo para cancelar la orden.');
      return;
    }

    setIsCancelling(true);
    try {
      const result = await cancelOrder(orderId, cancelReason);
      if (result.success) {
        alert('Orden cancelada exitosamente.');
        closeModal();
        window.location.reload(); // Recargar la página para actualizar el estado
      } else {
        alert(result.error || 'Error al cancelar la orden.');
      }
    } catch (error) {
      console.error('Error cancelando la orden:', error);
      alert('Error al cancelar la orden.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>¿Por qué deseas cancelar la orden?</h2>
        <textarea
          placeholder="Ingresa el motivo de la cancelación..."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className={styles.textarea}
        />
        <div className={styles.modalActions}>
          <button onClick={closeModal} className={styles.cancelButton}>
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={isCancelling}
            className={styles.confirmButton}
          >
            {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
}