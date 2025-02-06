'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface ShippingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
}

interface PickupData {
  pickupName: string;
  pickupDni: string;
}

interface OrderCreateData {
  userId: string;
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "DELIVERED" | "CANCELLED";
  isPickup: boolean;
  paymentType: "CUOTAS" | "TRANSFERENCIA";
  products: { create: { productId: string; quantity: number; price: number }[] };
  shippingAddress: string;
  pickupName?: string;
  pickupDni?: string;
}

export const order = async (
  cartItems: any[],
  orderData: ShippingData | PickupData,
  isPickup: boolean,
  paymentMethod: "cuota" | "transferencia", 
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return { ok: false, message: "No hay sesión de usuario" };
  }

  if (!cartItems.length) {
    return { ok: false, message: "El carrito está vacío" };
  }

  try {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const result = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { stock: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `El producto ${item.id} no tiene stock suficiente o no existe`
          );
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      let shippingAddress = "";
      const orderCreateData: OrderCreateData = {
        userId,
        totalPrice,
        status: "PENDING", 
        isPickup,
        paymentType: paymentMethod === "cuota" ? "CUOTAS" : "TRANSFERENCIA", 
        products: {
          create: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        shippingAddress: "",  // Se actualizará más adelante
      };

      if (isPickup) {
        const pickupData = orderData as PickupData;
        shippingAddress = "Retiro en tienda";
        orderCreateData.pickupName = pickupData.pickupName;
        orderCreateData.pickupDni = pickupData.pickupDni;
      } else {
        const shippingData = orderData as ShippingData;
        shippingAddress = [
          shippingData.address,
          shippingData.city,
          shippingData.province,
          shippingData.postalCode,
          shippingData.additionalInfo,
        ]
          .filter(Boolean)
          .join(", ");
      }

      orderCreateData.shippingAddress = shippingAddress;

      const newOrder = await tx.order.create({
        data: orderCreateData,
        include: { products: true },
      });

      if (!isPickup) {
        const shippingData = orderData as ShippingData;
        const newAddress = await tx.orderAddress.create({
          data: {
            street: shippingData.address,
            locality: shippingData.city,
            province: shippingData.province,
            postalCode: shippingData.postalCode,
            order: { connect: { id: newOrder.id } },
          },
        });

        await tx.order.update({
          where: { id: newOrder.id },
          data: { address: { connect: { id: newAddress.id } } },
        });
      }

      return newOrder;
    });

    return { ok: true, redirectUrl: `/compra/${result.id}?method=${paymentMethod}` };
  } catch (error) {
    console.error("Error al procesar la orden:", error);
    return { ok: false, message: "Error desconocido al procesar la orden" };
  }
};
