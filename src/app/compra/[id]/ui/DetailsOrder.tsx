"use client";

import Image from "next/image";
import styles from "./DetailsOrder.module.css";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  isPickup: boolean;
  products: Product[];
}

export default function DetailsOrder({ order }: { order: Order }) {
  // Calcular subtotal
  const subtotal = order.products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  // Calcular costo de envío
  const shippingCost =
    order.isPickup || order.shippingAddress === "Retiro en tienda" || order.status === "CANCELLED"
      ? 0
      : order.status === "PENDING" || order.status === "APPROVED"
      ? 500
      : order.status === "SHIPPED"
      ? 700
      : 0;

  const shippingText =
    shippingCost === 0
      ? "Gratis"
      : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(shippingCost);

  // Total final
  const total = subtotal + shippingCost;

  return (
    <div className={styles.DetailsOrderBox}>
      <h2 className={styles.DetailsOrderTitle}>Detalles del Pedido</h2>
      {order.products.map((product) => (
        <div key={product.id} className={styles.OrderItem}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            className={styles.ProductImage}
            width={80}
            height={80}
            priority
          />
          <div className={styles.ProductInfo}>
            <div className={styles.ProductDetails}>
              <h3 className={styles.ProductTitle}>{product.name}</h3>
              <p className={styles.ProductPrice}>
                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
              </p>
            </div>
            <p className={styles.ProductQuantity}>Cantidad: {product.quantity}</p>
          </div>
        </div>
      ))}

      <div className={styles.OrderSummary}>
        <div className={styles.SummaryRow}>
          <span>Subtotal:</span>
          <span>{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(subtotal)}</span>
        </div>
        <div className={styles.SummaryRow}>
          <span>Envío:</span>
          <span>{shippingText}</span>
        </div>
        <div className={styles.SummaryRowTotal}>
          <span>Total:</span>
          <span>{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}</span>
        </div>
      </div>
    </div>
  );
}
