'use server';

import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mail';
import { randomBytes } from 'crypto';

export async function sendForgotPasswordEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Este correo no está registrado.');
  }

  // Eliminar cualquier token existente para este identificador
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  const token = randomBytes(3).toString('hex').toUpperCase();
  const expirationTime = 5 * 60 * 1000; // 5 minutos

  const expiresAt = new Date(Date.now() + expirationTime);


  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: expiresAt,
    },
  });

  const resetPasswordUrl = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;
  const htmlContent = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>`;
  await sendMail(email, 'Restablecimiento de Contraseña', htmlContent);
}

