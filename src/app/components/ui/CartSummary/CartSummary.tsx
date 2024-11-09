'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartProduct } from '@/types';
import styles from './CartSummary.module.css';
import CartSummaryBox from '../CartSummaryBox/CartSummaryBox';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { useCartStore } from '@/store/cartStore';
import ApprovalMessage from '../MessageStack/ApprovalMessage.tsx/ApprovalMessage';
import ErrorMessage from '../MessageStack/ErrorMessage/ErrorMessage';
import MessageStack from '../MessageStack/MessageStack';

interface CartSummaryProps {
  discount: number;
}

interface Message {
  id: number;
  text: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({ discount }) => {
  const cartItems: CartProduct[] = useCartStore((state) => state.cartItems);
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const [approvalMessages, setApprovalMessages] = useState<Message[]>([]);
  const [errorMessages, setErrorMessages] = useState<Message[]>([]);

  const showApprovalMessage = (text: string) => {
    const newMessage: Message = { id: Date.now(), text };
    setApprovalMessages((prevMessages) => [...prevMessages, newMessage]);
    setTimeout(() => {
      setApprovalMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
    }, 3000);
  };

  const showErrorMessage = (text: string) => {
    const newMessage: Message = { id: Date.now(), text };
    setErrorMessages((prevMessages) => [...prevMessages, newMessage]);
    setTimeout(() => {
      setErrorMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
    }, 3000);
  };

  useEffect(() => {
    setErrorMessages([]);
  }, [cartItems]);

  const handleIncrement = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      if (item.quantity < item.stock) {
        updateCartItemQuantity(id, item.quantity + 1);
        showApprovalMessage(`Cantidad de ${item.name} actualizada.`);
      } else {
        showErrorMessage(`No puedes agregar más de ${item.stock} unidades de ${item.name}.`);
      }
    }
  };

  const handleDecrement = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(id, item.quantity - 1);
      showApprovalMessage(`Cantidad de ${item.name} reducida.`);
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      removeFromCart(id);
      showApprovalMessage(`${item.name} eliminado del carrito.`);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalPrice = totalPrice - discount;

  return (
    <div className="main-container">
      <h1>Carrito</h1>
      <div className={styles.paymentContainer}>
        <div className={styles.cartSummary}>
          {cartItems.length === 0 ? (
            <p className={styles.emptyMessage}>Tu carrito está vacío</p>
          ) : (
            <ul className={styles.productList}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.productItem}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className={styles.productImage}
                      priority
                    />
                  </div>
                  <div className={styles.productDetails}>
                    <p className={styles.productName}>{item.name}</p>
                    <div className={styles.priceQuantityWrapper}>
                      <p className={styles.productPrice}>${item.price.toLocaleString('es-AR')}</p>
                      <div className={styles.productQuantity}>
                        <button onClick={() => handleDecrement(item.id)} className={styles.quantityButton}>
                          <FaMinus />
                        </button>
                        <input type="number" value={item.quantity} readOnly className={styles.quantityInput} />
                        <button onClick={() => handleIncrement(item.id)} className={styles.quantityButton}>
                          <FaPlus />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className={styles.deleteButton}>
                          <AiOutlineDelete className={styles.deleteIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <CartSummaryBox
          cartItems={cartItems.map((item) => ({ ...item, stock: item.quantity }))}
          totalPrice={finalPrice}
        />
      </div>
      <MessageStack
        errorMessages={errorMessages}
        approvalMessages={approvalMessages}
        onRemoveError={(id) => setErrorMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))}
        onRemoveApproval={(id) => setApprovalMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))}
      />
    </div>
  );
};

export default CartSummary;