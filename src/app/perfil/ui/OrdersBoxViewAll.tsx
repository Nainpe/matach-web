'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PiPackage } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import styles from './OrdersBoxViewAll.module.css';
import { fetchUserOrders } from '../../../actions/perfil/orderuser';

// Interface para el tipo de dato de las órdenes
interface OrderType {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'DELIVERED';
  createdAt: string;
}

const OrdersBoxViewAll: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (session?.user?.id) {
        const userOrders = await fetchUserOrders(session.user.id);
        setOrders(userOrders.map(order => ({
          ...order,
          createdAt: order.createdAt.toString()
        }))); 
      }
    };
    loadOrders();
  }, [session?.user?.id]);

  if (!session) {
    return <p>Inicia sesión para ver tus órdenes.</p>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.noOrdersContainer}>
        <h2>No tienes órdenes aún</h2>
        <p>Parece que aún no has realizado ninguna compra. ¡Explora nuestra tienda!</p>
        <Link href="/" className={styles.exploreButton}>
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'APPROVED':
        return 'Aprobado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'DELIVERED':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return styles.pending;
      case 'APPROVED':
        return styles.approved;
      case 'CANCELLED':
        return styles.cancelled;
      case 'DELIVERED':
        return styles.delivered;
      default:
        return styles.unknown;
    }
  };

  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.ordersTitle}>Todas mis órdenes</h2>
      {orders.map((order) => (
        <div key={order.id} className={styles.orderBox}>
          <div className={styles.icon}>
            <PiPackage />
          </div>
          <div className={styles.orderDetails}>
            <p className={styles.orderName}>
              <span>{order.id}</span>
            </p>
            <p className={styles.orderDate}>
              Fecha: <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div className={styles.orderActions}>
            <p className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
              {getStatusLabel(order.status)}
            </p>
            <Link href={`/compra/${order.id}`} className={styles.detailsButton}>
              Ver detalles
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersBoxViewAll;