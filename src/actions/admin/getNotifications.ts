'use server';

import prisma from "../../lib/prisma";


export const getNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    return [];
  }
};