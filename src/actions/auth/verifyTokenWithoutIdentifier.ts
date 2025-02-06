'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyTokenWithoutIdentifier(token: string) {
  try {
    console.log('Token recibido:', token);

    // Busca el token en la base de datos para obtener el `identifier`
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token: token }, // Busca por el token
    });

    console.log('Token encontrado en la base de datos:', verificationToken);

    // Si el token no existe, lanza un error
    if (!verificationToken) {
      throw new Error('Token inválido o no encontrado.');
    }

    // Si el token ha expirado, elimínalo y lanza un error
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

    // Busca al usuario asociado al token usando el `identifier`
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });


    // Si no se encuentra el usuario, lanza un error
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    // Marca al usuario como verificado (actualiza el campo `emailVerified`)
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true }, // Cambia a `true` en lugar de `new Date()`
    });

    // Elimina el token después de usarlo (opcional)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: token,
        },
      },
    });

    // Retorna un mensaje de éxito
    return { success: true, message: 'Email verificado exitosamente.', user };
  } catch (error: unknown) {
    // Manejo de errores
    if (error instanceof Error) {
      console.error('Error en la verificación:', error);
      throw new Error(error.message || 'Error en la verificación.');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error en la verificación.');
    }
  }
}