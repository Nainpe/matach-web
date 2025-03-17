'use server';

import prisma from "../../lib/prisma";


export const deleteOrder = async (orderId: string) => {
  try {
    await prisma.orderProduct.deleteMany({
      where: { orderId: orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { 
      success: false, 
      error: 'No se pudo eliminar la orden. Asegúrate de que no tenga productos asociados.' 
    };
  }
};