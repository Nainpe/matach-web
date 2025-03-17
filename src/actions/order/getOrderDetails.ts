'use server';

import prisma from "../../lib/prisma";


export async function getOrderDetails(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: {
        include: {
          product: {
            select: {
              name: true,
              images: {
                select: { url: true },
              },
            },
          },
        },
      },
      address: { 
        select: {
          street: true,
          locality: true,
          province: true,
          postalCode: true,
          isPrimary: true,
        },
      },
    },
  });
}
