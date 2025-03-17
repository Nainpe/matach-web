'use server';

import { OrderStatus, PaymentType, Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

interface GetOrdersAdminProps {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  statusFilter?: OrderStatus | '';
  paymentFilter?: PaymentType | '';
  startDate?: string;
  endDate?: string;
}

export const getOrdersAdmin = async ({
  page = 1,
  pageSize = 10,
  searchQuery = '',
  statusFilter = '',
  paymentFilter = '',
  startDate = '',
  endDate = '',
}: GetOrdersAdminProps) => {
  try {
    const skip = (page - 1) * pageSize;
    const whereClause: Prisma.OrderWhereInput = {};

    // Filtro de búsqueda
    if (searchQuery) {
      whereClause.OR = [
        { id: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    // Filtros adicionales
    if (statusFilter) whereClause.status = statusFilter;
    if (paymentFilter) whereClause.paymentType = paymentFilter;

    // Filtro de fechas
    if (startDate || endDate) {
      const dateFilter: { gte?: Date; lt?: Date } = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        dateFilter.lt = end;
      }
      whereClause.createdAt = dateFilter;
    }

    // Consulta a Prisma
    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: pageSize,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          products: { include: { product: { select: { name: true } } } },
          address: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        where: whereClause,
      }),
      prisma.order.count({ where: whereClause })
    ]);

    // Formateo de resultados
    const formattedOrders = orders.map(order => ({
      seleccion: '',
      fecha: order.createdAt.toLocaleDateString(),
      codigo: order.id.substring(0, 8),
      cliente: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A',
      email: order.user?.email || 'N/A',
      subtotal: order.products.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
      total: order.totalPrice.toFixed(2),
      productos: order.products.map(item => `${item.product.name} x${item.quantity}`).join(', '),
      detalles: `${order.isPickup ? 'Retiro en Tienda' : 
        order.address ? `Envío a: ${order.address.street}, ${order.address.locality}` : 
        'Dirección no especificada'} - Pago: ${order.paymentType}`,
      estado: order.status,
      deliveryStatus: order.deliveryStatus,
      paymentStatus: order.paymentStatus,
      paymentType: order.paymentType,
      acciones: '',
      orderId: order.id,
      isPickup: order.isPickup,
      shippingAddress: order.address ? // Campo añadido
        `${order.address.street}, ${order.address.locality}` : 
        null,
      fullAddress: order.address ? 
        `${order.address.street}, ${order.address.locality}, ${order.address.province}, ${order.address.postalCode}` : 
        null,
      paymentMethod: order.paymentType,
      isStarred: order.isStarred || false,
    }));

    return { orders: formattedOrders, totalOrders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], totalOrders: 0 };
  }
};