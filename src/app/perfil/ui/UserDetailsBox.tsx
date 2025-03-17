'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './UserDetailsBox.module.css';

import Link from 'next/link';
import { getUserData } from '../../../actions/perfil/getUserDetails';

interface Address {
  street: string;
  locality: string;
  province: string;
  postalCode: string;
  country: string;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addresses: Address[];
}

const UserDetails: React.FC = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (session) {
        fetchUserData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [session]);

  if (!session) {
    return <div>Por favor, inicia sesión para ver tus detalles.</div>;
  }

  if (!userDetails) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className={styles.userDetailsContainer}>
      <h2 className={styles.userDetailsTitle}>Detalles del Usuario</h2>

      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.header}>Nombre</div>
        <div className={styles.content}>
          {userDetails.firstName} {userDetails.lastName}
        </div>
      </div>

      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.header}>Email</div>
        <div className={styles.content}>{userDetails.email}</div>
      </div>

      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.header}>Teléfono</div>
        <div className={styles.content}>{userDetails.phoneNumber}</div>
      </div>

      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.header}>Calles</div>
        <div className={styles.content}>
          {userDetails.addresses.length > 0 ? (
            <ul className={styles.addressList}>
              {userDetails.addresses.map((address, index) => (
                <li key={index}>{address.street}</li>
              ))}
            </ul>
          ) : (
            <div>No hay direcciones registradas</div>
          )}
        </div>
      </div>

      <Link href="perfil/TuInformacion" className={styles.buttonLink}>
        <h3 className={styles.editarDatos}>Editar Datos</h3>
      </Link>
    </div>
  );
};

export default UserDetails;
