'use server';

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function resetPassword(token: string, newPassword: string, email: string) {
  try {
    // Buscar el token de verificación usando tanto el token como el email
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    if (!verificationToken) {
      throw new Error('Token inválido o expirado.');
    }

    const hashedPassword = await hash(newPassword, 12);

    // Actualizar la contraseña y verificar el correo electrónico
    await prisma.user.update({
      where: { email: email },
      data: { 
        password: hashedPassword,
        emailVerified: true,
      },
    });

    // Eliminar el token una vez que se actualiza la contraseña
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    return { success: true, message: 'Contraseña actualizada exitosamente.' };
  } catch (error: unknown) {
    console.error('Error al restablecer la contraseña:', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('No se pudo restablecer la contraseña.');
  }
}
