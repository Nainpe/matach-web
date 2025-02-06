'use server';


import prisma from '@/lib/prisma';

export async function fetchUpdatedStock(productId: string): Promise<number> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product.stock;
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    throw new Error('Error al verificar el stock');
  }
}
