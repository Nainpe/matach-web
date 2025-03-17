'use client';

import styles from './AdminNavbar.module.css';
import { useEffect } from 'react';
import { FaRegBell } from 'react-icons/fa';
import SideBarAdmin from './SideBarAdmin';
import { useNotificationStore } from '../../../store/notificationStore';

export default function AdminNavbar() {
  const { toggleSidebar, loadNotifications } = useNotificationStore();

  // Cargar notificaciones al iniciar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.title}>Admin Panel</div>

        <div className={styles.iconsContainer}>
          <button className={styles.iconButton} onClick={toggleSidebar}>
            <FaRegBell className={styles.icon} />
          </button>
        </div>
      </nav>
      
      <SideBarAdmin />
    </>
  );
}