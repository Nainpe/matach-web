'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyToken(token: string, identifier: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: identifier,
          token: token,
        },
      },
    });

    if (!verificationToken) {
      throw new Error('Token inválido.');
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: identifier,
            token: token,
          },
        },
      });
      throw new Error('Token expirado.');
    }

    // No eliminamos el token aquí, solo lo verificamos

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    return { success: true, message: 'Token verificado exitosamente.', user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error en la verificación:', error);
      throw new Error(error.message || 'Error en la verificación.');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error en la verificación.');
    }
  }
}
