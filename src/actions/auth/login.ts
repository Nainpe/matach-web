'use server';

import { AuthError } from 'next-auth';
import { signIn } from '../../auth.config';

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