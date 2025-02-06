'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './AdminNavbar.module.css';

export default function AdminNavbar() {
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    // Conectar al servidor Socket.IO
    const socket = io('http://localhost:3000'); // URL de tu servidor

    // Escuchar el evento 'ORDER_NOTIFICATION' que emite el servidor
    socket.on('ORDER_NOTIFICATION', (data) => {
      console.log('Nueva notificación de orden:', data);
      setNotifications((prev) => prev + 1); // Incrementa las notificaciones cuando llega un mensaje
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.title}>Admin Panel</div>

      <div className={styles.iconsContainer}>
        <button className={styles.iconButton}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className={styles.notificationBadge}>{notifications}</span>
        </button>

        <button className={styles.iconButton}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
