// components/SideBarAdmin.tsx
'use client';

import styles from './SideBarAdmin.module.css';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNotificationStore } from '../../../store/notificationStore';

export default function SideBarAdmin() {
  const { 
    isSidebarOpen, 
    notificationCount, 
    notifications,
    loadNotifications,
    addNotification,
    toggleSidebar,
  } = useNotificationStore();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('nuevaOrden', (data) => {
      addNotification(`Nueva orden #${data.ordenId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);
  
  return (
    <div className={`${styles.SideBarAdmin} ${isSidebarOpen ? styles.open : styles.closed}`}>
      <button onClick={toggleSidebar}>
        {isSidebarOpen ? 'Cerrar' : 'Abrir'} Sidebar
      </button>

      {isSidebarOpen && (
        <div>
          <h3>Notificaciones</h3>
          
          <div className={styles.notificationsList}>
            {notifications.map((msg, index) => (
              <div key={index} className={styles.notificationItem}>
                📢 <span>{msg}</span>
              </div>
            ))}
          </div>

          {notificationCount > 0 ? (
            <p>Tienes {notificationCount} notificaciones nuevas</p>
          ) : (
            <p>No hay notificaciones nuevas</p>
          )}
        </div>
      )}
    </div>
  );
}