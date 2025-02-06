'use server';

import prisma from '@/lib/prisma';

export async function fetchUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        products: {
          include: {
            product: true, // Incluye información del producto
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}
