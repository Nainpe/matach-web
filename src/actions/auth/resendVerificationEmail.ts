'use server';

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from './sendVerificationEmail';

const prisma = new PrismaClient();

export async function resendVerificationEmail(email: string) {
  try {

    // Verifica si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    // Genera un nuevo token
    const newToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

    // Elimina cualquier token anterior del usuario
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Guarda el nuevo token en la base de datos
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: newToken,
        expires: expiresAt,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify/${newToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return { success: true, message: 'Nuevo correo de verificación enviado.' };
  } catch (error: unknown) {
    console.error('Error al reenviar email:', error);
    return { success: false, message: 'Error al reenviar el correo.' };
  }
}
