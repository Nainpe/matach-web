'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import styles from './MobileCartSummary.module.css';

import { FaMinus, FaPlus } from 'react-icons/fa';
import CartSummaryFooter from './CartSummaryFooter/CartSummaryFooter';
import { toast } from 'react-hot-toast';
import { CartProduct } from '../../../../types';
import { useCartStore } from '../../../../store/cartStore';
import { fetchUpdatedStock } from '../../../../actions/carrito/UpdateStock';

export default function MobileCartSummary() {
  const cartItems: CartProduct[] = useCartStore((state) => state.cartItems);
  const updateCartItemQuantity = useCartStore((state) => state.updateCartItemQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [stockLevels, setStockLevels] = useState<{ [key: string]: number }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Fetch stock levels and initialize quantities
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
      toast.success(`Cantidad aumentada.`);
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

  const applyDiscount = (coupon: string) => {
    if (coupon === 'DESCUENTO10') {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * (quantities[item.id] || 1), 0);
      return subtotal * 0.1;
    }
    return 0;
  };

  return (
    <div className={styles.cardContainer}>
      {cartItems.map((item) => (
        <div key={item.id} className={styles.productContainer}>
          <div className={styles.header}>
            <button onClick={() => removeFromCart(item.id)} className={styles.closeButton}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Product Image */}
          <div className={styles.imageContainer}>
            <Image
              src={item.imageUrl || '/placeholder.svg'}
              alt={item.name}
              className={styles.image}
              width={200}
              height={200}
            />
          </div>

          {/* Product Info */}
          <div className={styles.content}>
            <h2 className={styles.title}>{item.name}</h2>
            <div className={styles.price}>
              <span className={styles.priceAmount}>
                ${item.price.toLocaleString()}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className={styles.quantityContainer}>
              <span className={styles.quantityLabel}>Cant:</span>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleDecrement(item.id)}
                  className={styles.quantityButton}
                >
                  <FaMinus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantities[item.id] || 1}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  className={styles.quantityInput}
                  min="1"
                  max={stockLevels[item.id] || 1}
                />
                <button
                  onClick={() => handleIncrement(item.id)}
                  className={styles.quantityButton}
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>
                ${(item.price * (quantities[item.id] || 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
      <CartSummaryFooter applyDiscount={applyDiscount} />
    </div>
  );
}
