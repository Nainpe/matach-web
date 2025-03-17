'use server';

import prisma from "../../lib/prisma";


export const updateOrderStar = async (orderId: string, isStarred: boolean) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { isStarred },
    });
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error('Error updating order star:', error);
    return { success: false, error: 'Error al actualizar el estado de favorito' };
  }
};