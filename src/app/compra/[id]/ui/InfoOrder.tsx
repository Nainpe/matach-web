'use client';

import { LuMapPin } from 'react-icons/lu';
import styles from './InfoOrder.module.css';
import { HiOutlineTruck } from "react-icons/hi";
import { FiPackage } from 'react-icons/fi';
import { MdOutlineStorefront } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";



interface OrderAddress {
  street: string;
  locality: string;
  province: string;
  postalCode: string;
}

interface InfoOrderProps {
  address: OrderAddress | null; 
  isPickup: boolean; 
}

export default function InfoOrder({ address, isPickup }: InfoOrderProps) {
  return (
    <div className={styles.InfoOrderBox}>
      <h3 className={styles.TitleInfo}>Información de Envío/Retiro</h3>
      {isPickup ? (
        <div className={styles.InfoDireccion}>
          <div className={styles.InfoDireccionBox}>
            <p>
              <MdOutlineStorefront />
              <strong className={styles.TitleDirecction}>Retiro en el Local</strong>
            </p>
            <p className={styles.ShippingInfo}>Matach Computación</p>
            <p>Av. Libertad 258</p>
            <p>Santiago del Estero</p>
            <p>CP: 4200</p>
          </div>
          <div className={styles.InfoShippingBox}>
            <p>
            <IoTimeOutline />
            <strong className={styles.TitleDirecction}>Método de Envío</strong>
            </p>
            <p className={styles.ShippingInfo}> Lunes a Viernes: 9:30 - 13:30, 18:00 - 21:30</p>
            <p>Sábados: 10:00 - 13:30, 18:30 - 21:30</p>
          </div>
          <div className={styles.InfoShippingBox}>
            <p>
               <strong className={styles.TitleDirecction}>Instrucciones</strong>
            </p>
            <p className={styles.ShippingInfo}>Presentar DNI y número de orden al retirar.</p>
          </div>
        </div>
      ) : (
        <div className={styles.InfoDireccion}>
          <div className={styles.InfoDireccionBox}>
            <p>
              <LuMapPin />
              <strong className={styles.TitleDirecction}>Dirección de Envío</strong>
            </p>
            <p className={styles.ShippingInfo}>{address?.street}</p>
            <p>{address?.locality}</p>
            <p>{address?.province}</p>
            <p>CP: {address?.postalCode}</p>
          </div>
          <div className={styles.InfoShippingBox}>
            <p>
              <HiOutlineTruck />
              <strong className={styles.TitleDirecction}>Método de Envío</strong>
            </p>
            <p className={styles.ShippingInfo}>Correo a domicilio</p>
          </div>
          <div className={styles.InfoState}>
            <p>
              <FiPackage />
              <strong className={styles.TitleDirecction}>Estado del Envío</strong>
            </p>
            <p className={styles.ShippingInfo}>En Preparación</p>
          </div>
        </div>
      )}
    </div>
  );
}
