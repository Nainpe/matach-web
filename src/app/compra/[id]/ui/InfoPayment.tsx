'use client';

import { useState } from 'react';
import { LuCreditCard } from 'react-icons/lu';
import clsx from 'clsx';
import styles from './InfoPayment.module.css';
import { TbCashBanknote } from 'react-icons/tb';

interface InfoPaymentProps {
  paymentStatus: 'PENDING' | 'VALIDATED' | 'REJECTED';
  paymentType: 'TRANSFERENCIA' | 'CUOTAS'; // Tipo de pago
  totalPrice: number;
  orderId: string;
}

export default function InfoPayment({ paymentStatus, paymentType, totalPrice }: InfoPaymentProps) {
  const [installments, setInstallments] = useState<number | null>(null);
  const [, setFinalPrice] = useState<number | null>(null);
  const [, setMonthlyPayment] = useState<number | null>(null);

  const interestRates: { [key: number]: number } = {
    3: 0.10,
    6: 0.15,
    9: 0.20,
    12: 0.25,
  };

  const handleInstallmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInstallments = parseInt(e.target.value);

    if (!isNaN(selectedInstallments)) {
      setInstallments(selectedInstallments);

      const interestRate = interestRates[selectedInstallments] || 0;
      const priceWithInterest = totalPrice * (1 + interestRate);
      setFinalPrice(priceWithInterest);

      const monthly = priceWithInterest / selectedInstallments;
      setMonthlyPayment(monthly);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const getPaymentStatusMessage = (status: 'PENDING' | 'VALIDATED' | 'REJECTED') => {
    switch (status) {
      case 'PENDING':
        return 'Pago pendiente';
      case 'VALIDATED':
        return 'Pago confirmado';
      case 'REJECTED':
        return 'Pago rechazado';
      default:
        return 'Estado desconocido';
    }
  };

  const renderInstallmentOptions = () => {
    const options = [3, 6, 9, 12];
    return options.map((installment) => {
      const interestRate = interestRates[installment] || 0;
      const priceWithInterest = totalPrice * (1 + interestRate);
      const monthly = priceWithInterest / installment;
      return (
        <option key={installment} value={installment}>
          {installment} cuotas de {formatCurrency(monthly)}
        </option>
      );
    });
  };

  const handleConfirmClick = () => {
    alert(`Has seleccionado ${installments || 0} cuotas.`);
  };

  return (
    <div className={styles.InfoPaymentContainer}>
      <h3 className={styles.TitleInfo}>Información de Pago</h3>

      <div 
        className={clsx(styles.InfoPaymentBox, 
          paymentType === 'TRANSFERENCIA' ? styles.TransferenciaBox : styles.CuotasBox)}
      >
        <p>
          {paymentType === 'TRANSFERENCIA' ? <TbCashBanknote /> :<LuCreditCard /> }
          <strong className={styles.TitlePayment}>Método de pago</strong>
        </p>
        <p className={styles.PaymentInfo}>
          {paymentType === 'TRANSFERENCIA' ? 'Transferencia bancaria' : 'Financiación con cuotas'}
        </p>
      </div>

      <div className={styles.InfoPaymentBox}>
        <p>
          <strong className={styles.TitlePayment}>Estado</strong>
        </p>
        <p
          className={clsx(
            styles.PaymentInfo,
            paymentStatus === 'PENDING' && styles.PendingText,
            paymentStatus === 'VALIDATED' && styles.ValidatedText,
            paymentStatus === 'REJECTED' && styles.RejectedText
          )}
        >
          {getPaymentStatusMessage(paymentStatus)}
        </p>
      </div>
      
      <div className={styles.InfoPaymentBox}>
        <p>
          <strong className={styles.TitlePayment}>Datos bancarios</strong>
        </p>
        <ul className={styles.ListPayment}>
            <li>Banco: Banco de la Nación Argentina</li>
            <li>Titular: Gorila Games S.R.L.</li>
            <li>CBU: 0110000000000000000000</li>
            <li>Alias: GORILA.GAMES.VENTAS</li>
            <li>CUIT: 30-12345678-9</li>
          </ul>
      </div>

      {paymentType === 'CUOTAS' && (
        <div className={styles.InfoPaymentBox}>
          <p>
            <strong className={styles.TitlePayment}>Cuotas</strong>
          </p>
          <div>
            <select
              value={installments || ''}
              onChange={handleInstallmentChange}
              className={styles.CustomSelect}
            >
              <option value="" disabled>
                Selecciona las cuotas
              </option>
              {renderInstallmentOptions()}
            </select>
            <button onClick={handleConfirmClick} className={styles.ConfirmButton}>
              Confirmar selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
