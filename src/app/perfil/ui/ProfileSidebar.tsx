'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './ProfileSidebar.module.css';
import Link from 'next/link';
import { getUserData } from '../../../actions/perfil/getUserDetails';
import { logout } from '../../../actions/auth/logout';


const ProfileSidebar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  const { email, image } = session?.user || {};

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await getUserData();
        setUserName(`${userData.firstName} ${userData.lastName}`.trim());
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName(null);
      }
    };

    if (session) {
      fetchUserName();
    }
  }, [session]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/'; // Redirect to home page and force a full page refresh
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileHeader}>
        {image ? (
          <Image
            src={image}
            alt={`${userName || 'Usuario'}`}
            width={80}  
            height={80}
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.placeholderImage}>👤</div>
        )}
        <h2 className={styles.userName}>{userName || 'Usuario'}</h2>
        <p className={styles.userEmail}>{email}</p>
      </div>
      <ul className={styles.profileMenu}>
        <Link className={styles.sideLink} href="/perfil">
        <li className={isActive('/perfil') ? styles.activeLink : ''}>
          Mí Perfil
        </li>
        </Link>

        <Link className={styles.sideLink} href="/perfil/Mispedidos" >
         <li className={isActive('/perfil/Mispedidos') ? styles.activeLink : ''}>
          Mis Pedidos
        </li>
        </Link>
       
        <Link className={styles.sideLink} href="/perfil/TuInformacion" >
          <li className={isActive('/perfil/TuInformacion') ? styles.activeLink : ''}>
            Informacion de Usuario
          </li>
        </Link>

        <li>
        <button className={styles.buttonLogout} onClick={handleLogout}>Cerrar sesión</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;

