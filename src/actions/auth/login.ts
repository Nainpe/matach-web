'use server';

import { signIn } from '@/auth.config'; // Asegúrate de que esta función esté configurada correctamente.
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData.entries()),
      redirect:false
  });

    return 'Success';

  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email o contraseñas incorrectas';
          return 'chotongus'
        default:
          return 'Email no verificado o error desconocido, intenta nuevamente';
      }
    }
    throw error;
  }
}