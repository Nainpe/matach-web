'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { CartProduct } from '@/types';
import styles from './CartSummary.module.css';
import CartSummaryBox from '../CartSummaryBox/CartSummaryBox';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { useCartStore } from '@/store/cartStore';
import { fetchUpdatedStock } from '@/actions/carrito/UpdateStock';

interface CartSummaryProps {
  discount: number;
  cartItems: CartProduct[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ discount, cartItems }) => {
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [stockLevels, setStockLevels] = useState<{ [key: string]: number }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchInitialStock = async () => {
      const initialStock: { [key: string]: number } = {};
      const initialQuantities: { [key: string]: number } = {};
      for (const item of cartItems) {
        try {
          const stock = await fetchUpdatedStock(item.id);
          initialStock[item.id] = stock;
          initialQuantities[item.id] = item.quantity;
        } catch (error) {
          console.error(`Error fetching stock for item ${item.id}:`, error);
          initialStock[item.id] = item.quantity; // Fallback to current quantity
          initialQuantities[item.id] = item.quantity;
        }
      }
      setStockLevels(initialStock);
      setQuantities(initialQuantities);
    };

    fetchInitialStock();
  }, [cartItems]);

  const handleIncrement = (id: string) => {
    if (quantities[id] < (stockLevels[id] || 0)) {
      const newQuantity = quantities[id] + 1;
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
      updateCartItemQuantity(id, newQuantity);
      toast.success(`Cantidad actualizada.`);
    } else {
      toast.error(`No puedes agregar más de ${stockLevels[id]} unidades.`);
    }
  };

  const handleDecrement = (id: string) => {
    if (quantities[id] > 1) {
      const newQuantity = quantities[id] - 1;
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
      updateCartItemQuantity(id, newQuantity);
      toast.success(`Cantidad reducida.`);
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (stockLevels[id] || 0)) {
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
      updateCartItemQuantity(id, newQuantity);
      toast.success(`Cantidad actualizada.`);
    } else if (newQuantity > (stockLevels[id] || 0)) {
      toast.error(`No puedes agregar más de ${stockLevels[id]} unidades.`);
    } else {
      toast.error('La cantidad mínima es 1.');
    }
  };

  const handleDeleteItem = (id: string) => {
    removeFromCart(id);
    toast.success(`Producto eliminado del carrito.`);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (quantities[item.id] || 1), 0);
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
                      src={item.imageUrl || '/images/placeholder.png'}
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
                        <input
                          type="number"
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                          className={styles.quantityInput}
                          min="1"
                          max={stockLevels[item.id] || 1}
                        />
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
        {cartItems.length > 0 && (
          <CartSummaryBox
            cartItems={cartItems.map((item) => ({ ...item, stock: stockLevels[item.id] || item.quantity }))}
            totalPrice={finalPrice}
          />
        )}
      </div>
    </div>
  );
};

export default CartSummary;
