'use server';

import prisma from "../../lib/prisma";

export const cancelOrder = async (orderId: string, reason: string) => {
  try {
    await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancellationReason: reason,
        },
        include: {
          products: {
            select: {
              productId: true,
              quantity: true
            }
          }
        }
      });

      for (const item of updatedOrder.products) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { success: false, error: 'Error al cancelar la orden' };
  }
};