'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useShippingStore } from '@/store/shippingStore';
import styles from './TotalBox.module.css';
import RadioGroup from './RadioGroup';
import CardPaymentSection from './CardPaymentSection';
import { order } from '@/actions/order/order';
import { toast } from 'react-hot-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Link from 'next/link';
import { CiEdit } from 'react-icons/ci'; 



interface TotalBoxProps {
  totalPrice: number;
}

const TotalBox: React.FC<TotalBoxProps> = ({ totalPrice }) => {
  const { shippingOption, setShippingOption, shippingData, pickupData } = useShippingStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const [paymentMethod, setPaymentMethod] = useState<'cuota' | 'transferencia'>('transferencia');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const shippingOptions: { value: 'retiro' | 'delivery' | 'uber'; label: string; info?: string; price?: string }[] = [
    { value: 'retiro', label: 'Retirar en tienda', price: 'Gratis' },
    { value: 'delivery', label: 'Envío a domicilio', info: 'Envío estándar a domicilio.', price: '$500' },
    { value: 'uber', label: 'Envío por Uber', info: 'Envío rápido a través de Uber.', price: '$1200' },
  ];

  const paymentOptions: { value: 'cuota' | 'transferencia'; label: string; info: string }[] = [
    {
      value: 'cuota',
      label: 'Pagar en Cuotas',
      info: 'Realiza tu pago en cuotas a través de Mercado Pago.',
    },
    {
      value: 'transferencia',
      label: 'Transferencia',
      info: 'Paga directamente desde tu cuenta bancaria.',
    },
  ];

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleCreateOrder = async () => {
    if (!captchaValue) {
      toast.error('Por favor, verifica que no eres un robot.');
      return;
    }

    const isPickup = shippingOption === 'retiro';

    if (isPickup) {
      const { pickupName, pickupDni } = pickupData;
      if (!pickupName || !pickupDni) {
        toast.error('Por favor, complete todos los campos de información de retiro.');
        return;
      }
    } else {
      const { address, city, province, postalCode } = shippingData;
      if (!address || !city || !province || !postalCode) {
        toast.error('Por favor, complete todos los campos de la dirección de envío.');
        return;
      }
    }

    toast('Enviando datos de orden...', { icon: '⏳' });
    setIsButtonDisabled(true);

    const response = await order(cartItems, isPickup ? pickupData : shippingData, isPickup, paymentMethod);

    if (response.ok && response.redirectUrl) {
      toast.success('Orden creada con éxito. Redirigiendo...');
      window.location.href = response.redirectUrl;
    } else {
      toast.error(response.message || 'Error al crear la orden.');
      setIsButtonDisabled(false);
    }
  };

  const shippingCost =
    shippingOption === 'delivery' ? 500 : shippingOption === 'uber' ? 1200 : 0;
  const totalWithShipping = totalPrice + shippingCost;

  return (
    <div className={styles.totalBox}>
      <div className={styles.headerContainer}>
      <h3 className={styles.totalPrice}>Tu Pedido</h3>
      <Link href="/carrito" className={styles.editCartLink}>
        <CiEdit className={styles.editCartIcon} /> Editar Carrito
      </Link>
    </div>
      <div className={styles.priceDetails}>
        <div className={styles.priceRow}>
          <span className={styles.priceSubtotal}>Subtotal:</span>
          <span className={styles.priceValue}>${totalPrice}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceEnvio}>Envío:</span>
          <span className={styles.priceValue}>${shippingCost}</span>
        </div>
        <div className={styles.priceTotalBox}>
          <span className={styles.priceTotal}>Total:</span>
          <span className={styles.priceValueTotal}>${totalWithShipping}</span>
        </div>
      </div>
      
      <div className={styles.cardPaymentContainer}>
        <CardPaymentSection />
      </div>


      <div className={styles.radioContainer}>
        <RadioGroup
          title="Método de pago"
          options={paymentOptions}
          selectedValue={paymentMethod}
          onChange={setPaymentMethod}
        />
      </div>

      <div className={styles.radioContainer}>
        <RadioGroup
          title="Opciones de envío"
          options={shippingOptions}
          selectedValue={shippingOption}
          onChange={setShippingOption}
        />
      </div>

      <div className={styles.captchaContainer}>
        <HCaptcha
          sitekey="6f940818-2e2a-47fc-8e20-05ca21f4123a"
          onVerify={(value) => handleCaptchaChange(value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.createOrderButton} ${
            isButtonDisabled ? styles.disabledButton : ''
          }`}
          onClick={handleCreateOrder}
          disabled={isButtonDisabled}
        >
          Finalizar orden
        </button>
      </div>
    </div>
  );
};

export default TotalBox;
