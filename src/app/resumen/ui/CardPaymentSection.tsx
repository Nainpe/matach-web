'use client';

import React from 'react';
import styles from './CardPaymentSection.module.css';
import { FaRegCreditCard } from 'react-icons/fa';
import Image from 'next/image';
import { useCardModalStore } from '../../../store/cardModalStore';
import CardModal from './CardModal';

export default function CardPaymentSection() {
  const { openModal } = useCardModalStore(); 

  const installmentOptions = [
    { months: 3, amount: 3666.67, hasInterest: true },
    { months: 6, amount: 1900.0, hasInterest: true },
    { months: 9, amount: 1333.33, hasInterest: true },
    { months: 12, amount: 1200.0, hasInterest: true },
  ];



  return (
    <>
        <div className={styles.cardPaymentsContainer}>
            <div className={styles.cardPayments}>
                <div className={styles.iconTitleContainer}>
                <FaRegCreditCard className={styles.iconCardPayment} />
                <div className={styles.titleSubtitle}>
                    <h2>Métodos de pagos y cuotas</h2>
                    <button className={styles.modalButton}    onClick={openModal} >Ver opciones de cuotas</button>
                </div>
                </div>

                <div className={styles.paymentsLogo}>
                <Image
                    className={styles.paymentsLogos}
                    src="/logos/visa-logo.svg"
                    alt="Logo de Visa"
                    width={30}
                    height={30}
                />
                <Image
                    className={styles.paymentsLogos}
                    src="/logos/Mercadopago.svg"
                    alt="Logo de Mercado Pago"
                    width={30}
                    height={30}
                />
                <Image
                    className={styles.paymentsLogos}
                    src="/logos/american-express-logo.jpg"
                    alt="Logo de American Express"
                    width={30}
                    height={30}
                />
                <Image
                    className={styles.paymentsLogos}
                    src="/logos/ma_symbol.svg"
                    alt="Logo de Mastercard"
                    width={30}
                    height={30}
                />
                </div>
            </div>
        </div>
        <CardModal installmentOptions={installmentOptions} />

    </>

  );
}
