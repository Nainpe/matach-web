'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyTokenWithoutIdentifier(token: string) {
  try {
    console.log('Token recibido:', token);

    // Buscar el token en la base de datos
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token: token },
    });

    console.log('Token encontrado en la base de datos:', verificationToken);

    if (!verificationToken) {
      throw new Error('Token inválido o no encontrado.');
    }

    // Verificar expiración
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: token,
          },
        },
      });
      throw new Error('Token expirado.');
    }

    // Buscar usuario asociado
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    // Actualizar con DateTime en lugar de Boolean
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },  // Cambio clave aquí
    });

    // Eliminar token usado
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: token,
        },
      },
    });

    return { success: true, message: 'Email verificado exitosamente.', user };
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