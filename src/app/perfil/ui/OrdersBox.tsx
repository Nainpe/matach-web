'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PiPackage } from 'react-icons/pi';
import { LuShoppingBag } from "react-icons/lu";
import { useSession } from 'next-auth/react';
import styles from './OrdersBox.module.css';
import { fetchUserOrders } from '../../../actions/perfil/orderuser';

interface Order {
  id: string;
  createdAt: Date; // Cambiar de string a Date
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'DELIVERED';
}

const OrdersBox: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (session?.user?.id) {
        const userOrders = await fetchUserOrders(session.user.id);
        
        const sortedOrders = userOrders
          .sort((a: Order, b: Order) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);
          
        setOrders(sortedOrders);
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
        <div className={styles.noOrdersIcon}>
          <LuShoppingBag size={60} />
        </div>
        <h2 className={styles.noOrdersTitle}>Aún no tienes órdenes</h2>
        <p className={styles.noOrdersText}>
          Parece que no has realizado ninguna compra todavía. ¡Echa un vistazo a nuestra tienda y encuentra algo que te guste!
        </p>
        <Link href="/" className={styles.exploreButton}>
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.ordersTitle}>Mis Órdenes</h2>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          passHref
          legacyBehavior
        >
          <div
            className={`${styles.orderBox} ${
              activeOrder === order.id ? styles.active : ''
            }`}
            onClick={() => setActiveOrder(order.id)}
          >
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
            <p
              className={`${styles.orderStatus} ${
                order.status === 'APPROVED' ? styles.approved : styles.notApproved
              }`}
            >
              {order.status === 'APPROVED' ? 'Entregado' : 'Pendiente'}
            </p>
          </div>
        </Link>
      ))}

      <Link href="/perfil/Mispedidos" className={styles.allOrdersButton}>
        Ver todas las órdenes
      </Link>
    </div>
  );
};

export default OrdersBox;