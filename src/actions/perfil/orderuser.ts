'use server';

import prisma from "../../lib/prisma";
import { OrderStatus, PaymentType, DeliveryStatus, PaymentStatus } from '@prisma/client';

export type OrderWithProducts = {
  id: string;
  userId: string;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  totalPrice: number;
  shippingAddress: string;
  isPickup: boolean;
  pickupName: string | null;
  pickupDni: string | null;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  cancellationReason: string | null;
  products: {
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
    };
  }[];
};

export async function fetchUserOrders(userId: string): Promise<OrderWithProducts[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return JSON.parse(JSON.stringify(orders)) as OrderWithProducts[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}