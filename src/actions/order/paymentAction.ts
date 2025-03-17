'use server';

import prisma from "../../lib/prisma";


export async function getPaymentStatus(orderId: string) {
  if (!orderId) {
    throw new Error('orderId is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      paymentStatus: true,
    },
  });

  const validStatuses = ['PENDING', 'VALIDATED', 'REJECTED'];
  const paymentStatus = order?.paymentStatus;

  if (paymentStatus && validStatuses.includes(paymentStatus)) {
    return paymentStatus;
  }

  return 'PENDING';
}

export async function getPaymentDetails(orderId: string) {
  if (!orderId) {
    throw new Error('orderId is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      paymentType: true, 
      paymentStatus: true, 
    },
  });

  if (!order) {
    throw new Error(`No se encontró la orden con ID: ${orderId}`);
  }

  return {
    paymentType: order.paymentType, 
    paymentStatus: order.paymentStatus, 
  };
}
