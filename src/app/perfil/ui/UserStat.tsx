'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaShoppingCart, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import styles from './UserStats.module.css';
import { fetchUserOrders } from '@/actions/perfil/orderuser';

const UserStats: React.FC = () => {
  const { data: session } = useSession();
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      if (session?.user?.id) {
        const userOrders = await fetchUserOrders(session.user.id);

        // Calcular estadísticas
        const total = userOrders.length;
        const spent = userOrders.reduce(
          (sum: number, order: any) => sum + order.totalAmount,
          0
        );

        setTotalOrders(total);
        setTotalSpent(spent);
      }
    };
    loadStats();
  }, [session?.user?.id]);

  if (!session) {
    return null; // Ocultar estadísticas si no hay sesión
  }

  return (
    <div className={styles.statsContainer}>
      <p className={styles.statsTitle}>Estadísticas de Usuario</p>
      <div className={styles.statsBoxContainer}>
        <div className={styles.statsBox}>
          <FaShoppingCart className={styles.icon} />
          <p className={styles.statTitle}>Pedidos Totales</p>
          <p className={styles.statValue}>{totalOrders}</p>
        </div>
        <div className={styles.statsBox}>
          <FaMoneyBillWave className={styles.icon} />
          <p className={styles.statTitle}>Gasto Total</p>
          <p className={styles.statValue}>
            ${totalSpent.toLocaleString('es-AR')}
          </p>
        </div>
        {session.user.createdAt && (
          <div className={styles.statsBox}>
            <FaCalendarAlt className={styles.icon} />
            <p className={styles.statTitle}>Fecha de Creación</p>
            <p className={styles.statValue}>
              {new Date(session.user.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;
