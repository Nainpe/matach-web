'use server';

import { OrderStatus, PaymentStatus,Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

interface GetPendingPaymentsAdminProps {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  statusFilter?: OrderStatus | '';
  startDate?: string;
  endDate?: string;
}

export const getPendingPaymentsAdmin = async ({
  page = 1,
  pageSize = 10,
  searchQuery = '',
  statusFilter = '',
  startDate = '',
  endDate = '',
}: GetPendingPaymentsAdminProps) => {
  try {
    const skip = (page - 1) * pageSize;
    const whereClause: Prisma.OrderWhereInput = {
      paymentStatus: PaymentStatus.PENDING
    };

    // Filtro por ID o código
    if (searchQuery) {
      whereClause.OR = [
        { id: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Filtro por estado
    if (statusFilter) {
      whereClause.status = statusFilter as OrderStatus;
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      const filter: { gte?: Date; lt?: Date } = {};
      
      if (startDate) {
        filter.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        filter.lt = end;
      }
      
      whereClause.createdAt = filter;
    }

    // Obtener órdenes paginadas
    const orders = await prisma.order.findMany({
      skip,
      take: pageSize,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        products: {
          include: { product: { select: { name: true } } }
        },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      where: whereClause,
    });

    const totalOrders = await prisma.order.count({ where: whereClause });

    const formattedOrders = orders.map((order) => ({
      seleccion: '',
      fecha: order.createdAt.toLocaleDateString(),
      codigo: order.id.substring(0, 8),
      cliente: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A',
      email: order.user?.email || 'N/A',
      subtotal: order.products.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
      total: order.totalPrice.toFixed(2),
      productos: order.products.map(item => `${item.product.name} x${item.quantity}`).join(', '),
      detalles: `${
        order.isPickup 
          ? 'Retiro en Tienda' 
          : order.address 
            ? `Envío a: ${order.address.street}, ${order.address.locality}, ${order.address.province}`
            : 'Dirección no especificada'
      } - Pago: ${order.paymentType}`,
      estado: order.status,
      deliveryStatus: order.deliveryStatus,
      paymentStatus: order.paymentStatus,
      paymentType: order.paymentType,
      acciones: '',
      orderId: order.id,
      isPickup: order.isPickup,
      shippingAddress: order.shippingAddress,
      fullAddress: order.address 
        ? `${order.address.street}, ${order.address.locality}, ${order.address.province}, ${order.address.postalCode}`
        : null,
      paymentMethod: order.paymentType,
      isStarred: order.isStarred || false,
    }));

    return { orders: formattedOrders, totalOrders };
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return { orders: [], totalOrders: 0 };
  }
};