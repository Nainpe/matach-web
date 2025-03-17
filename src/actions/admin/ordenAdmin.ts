'use server';

import { io } from "socket.io-client";
import { auth } from "../../auth.config";
import prisma from "../../lib/prisma";

interface ClientData {
  nombre: string;
  telefono: string;
  dni: string;
  mesa?: number;
  takeAway: boolean;
}

interface ProductoOrden {
  id: string;
  quantity: number;
  price: number;
}

const generateRandomOrderId = (): string => {
  const min = 10000;
  const max = 99999;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
};

export const crearOrdenAdmin = async (
  clientData: ClientData,
  productosSeleccionados: ProductoOrden[]
) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return { ok: false, message: "No hay sesión de administrador" };
    }

    if (productosSeleccionados.length === 0) {
      return { ok: false, message: "No hay productos seleccionados" };
    }

    const totalPrice = productosSeleccionados.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    await prisma.$transaction(async (tx) => {
      for (const item of productosSeleccionados) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { stock: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${item.id}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const usuario = await tx.user.findUnique({
        where: { id: userId },
        select: { dni: true }
      });

      if (!usuario) {
        throw new Error("Usuario administrador no encontrado");
      }

      const shippingAddress = clientData.takeAway
        ? "Para llevar"
        : `Mesa N°${clientData.mesa || 'Sin número'}`;

      const newOrder = await tx.order.create({
        data: {
          id: generateRandomOrderId(),
          userId,
          totalPrice,
          status: "APPROVED",
          deliveryStatus: "DELIVERED",
          shippingAddress,
          isPickup: clientData.takeAway,
          pickupDni: clientData.takeAway ? usuario.dni : null,
          paymentType: "TRANSFERENCIA",
          products: {
            create: productosSeleccionados.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              phoneNumber: true
            }
          }
        }
      });

      await tx.notification.create({
        data: {
            message: `Nueva orden #${newOrder.id}`,
            read: false,
        },
      });

      const socket = io('http://localhost:3001');
      socket.emit('nuevaOrdenAdmin', {
        ordenId: newOrder.id,
        cliente: `${newOrder.user.firstName} ${newOrder.user.lastName}`,
        total: newOrder.totalPrice
      });
    });

    return { ok: true };
  } catch (error: unknown) {
    console.error("Error en crearOrdenAdmin:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error al procesar la orden"
    };
  }
};