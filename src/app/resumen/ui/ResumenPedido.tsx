'use client';

import Image from 'next/image'; // Importa el componente Image de Next.js
import { useCartStore } from '@/store/cartStore';
import { CartProduct } from '@/types';
import styles from './ResumenPedido.module.css';
import TotalBox from './TotalBox';
import ShippingForm from './ShippingForm';

const ResumenPedido = () => {
  const cartItems: CartProduct[] = useCartStore((state) => state.cartItems);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className='main-container'>
      <div className={styles.container}>
        <div className={styles.resumenRorm}>
          
        <div className={styles.resumenContainer}>
          <h2>Resumen del Pedido</h2>

          {cartItems.length === 0 ? (
            <p className={styles.emptyMessage}>No hay productos en el carrito.</p>
          ) : (
            <div className={styles.productContainer}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.productItem}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={item.imageUrl || '/images/placeholder.png'} // Fallback para imágenes faltantes
                      alt={item.name}
                      width={150}
                      height={150}
                      className={styles.productImage}
                      priority
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <p className={styles.productName}>{item.name}</p>
                    <div className={styles.priceQuantityWrapper}>
                      <p className={styles.productPrice}>
                        ${item.price.toLocaleString('es-AR')}
                      </p>
                      <p>
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className={styles.productSubtotal}>
                      Subtotal: ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
        <ShippingForm />

          
         </div>
          

        <TotalBox totalPrice={totalPrice}  />


        

      </div>
    </div>
    
  );
};

export default ResumenPedido;
