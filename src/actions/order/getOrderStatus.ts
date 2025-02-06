'use server';

import prisma from "@/lib/prisma";

export async function getOrderStatus(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
      },
    });

    if (!order) {
      console.error('Orden no encontrada');
      return { 
        creationDate: 'No disponible', 
        paymentStatus: 'PENDING', 
        preparationStatus: 'PENDING', 
        shippingStatus: 'PENDING' 
      }; // Valores predeterminados
    }

    return {
      creationDate: order.createdAt.toLocaleString(),
      paymentStatus: order.paymentStatus || "PENDING",
      preparationStatus: order.status || "PENDING",
      shippingStatus: order.deliveryStatus || "PENDING",
    };
  } catch (error) {
    console.error('Error al obtener el estado del pedido:', error);
    return { 
      creationDate: 'No disponible', 
      paymentStatus: 'PENDING', 
      preparationStatus: 'PENDING', 
      shippingStatus: 'PENDING' 
    }; 
  }
}
