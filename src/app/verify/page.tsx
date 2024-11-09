// app/verify/page.tsx
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

interface VerifyProps {
  searchParams: { token: string };
}

export default async function VerifyPage({ searchParams }: VerifyProps) {
  const token = searchParams.token;

  if (!token) {
    return <p>Token de verificación no válido.</p>;
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: token, // Usa el identificador del token actual
          token,
        },
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return <p>Token inválido o expirado.</p>;
    }

    // Actualiza el campo `emailVerified` en el usuario correspondiente
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: true },
    });

    // Borra el token después de la verificación
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token,
        },
      },
    });

    redirect('/login');
  } catch (error) {
    console.error(error);
    return <p>Error en la verificación. Por favor, inténtalo de nuevo.</p>;
  }
}
