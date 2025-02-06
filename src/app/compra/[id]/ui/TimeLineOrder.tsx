'use client';

import { IoCheckmark } from 'react-icons/io5';
import { FiCreditCard, FiPackage } from 'react-icons/fi';
import { LuTruck } from 'react-icons/lu';
import styles from './TimeLineOrder.module.css';

interface OrderStatus {
  creationDate: string;
  paymentStatus: string;
  preparationStatus: string;
  shippingStatus: string;
}

interface TimeLineOrderProps {
  orderStatus: OrderStatus | null; 
}

const getStatusClass = (status?: string) => {
  if (!status) return styles.pending;

  switch (status.toLowerCase()) {
    case 'validated':
    case 'completed':
    case 'delivered':
    case 'approved':
      return styles.approved;
    case 'pending':
    case 'processing':
      return styles.pending;
    case 'canceled':
    case 'failed':
    case 'rejected': 
    case 'cancelled':
      return styles.canceled;
    default:
      return styles.pending;
  }
};

const translateStatus = (status?: string) => {
  if (!status) return 'En espera'; 
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado', 
    cancelled: 'Cancelado',
    delivered: 'Entregado',
    validated: 'Validado',
    in_transit: 'En tránsito',
    processing: 'En proceso',
  };

  return statusMap[status.toLowerCase()] || 'En espera'; 
};

const TimeLineOrder = ({ orderStatus }: TimeLineOrderProps) => {
  if (!orderStatus) {
    return <p>Información de la orden no disponible</p>; // Mostrar algo en caso de error
  }

  return (
    <div className={styles.lineBox}>
      <div className={styles.stateContainer}>
        <div className={`${styles.stateIcon} ${styles.approved}`}>
          <IoCheckmark />
        </div>
        <p className={styles.stateText}>Creación</p>
        <p className={styles.stateInfo}>{orderStatus.creationDate || 'No disponible'}</p>
      </div>

      <div className={styles.stateContainer}>
        <div className={`${styles.stateIcon} ${getStatusClass(orderStatus.paymentStatus)}`}>
          <FiCreditCard />
        </div>
        <p className={styles.stateText}>Pago</p>
        <p className={styles.stateInfo}>{translateStatus(orderStatus.paymentStatus)}</p>
      </div>

      <div className={styles.stateContainer}>
        <div className={`${styles.stateIcon} ${getStatusClass(orderStatus.preparationStatus)}`}>
          <FiPackage />
        </div>
        <p className={styles.stateText}>Preparación</p>
        <p className={styles.stateInfo}>{translateStatus(orderStatus.preparationStatus)}</p>
      </div>

      <div className={styles.stateContainer}>
        <div className={`${styles.stateIcon} ${getStatusClass(orderStatus.shippingStatus)}`}>
          <LuTruck />
        </div>
        <p className={styles.stateText}>Envío</p>
        <p className={styles.stateInfo}>{translateStatus(orderStatus.shippingStatus)}</p>
      </div>
    </div>
  );
};

export default TimeLineOrder;
