// auth.config.ts

import type { NextAuthConfig } from 'next-auth';
import NextAuth, { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import prisma from './lib/prisma';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/registro',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        console.log({ email, password });

        // Buscar el usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        // Verificar si el correo está verificado
        if (!user.emailVerified) {
          throw new Error("Pinga")
        }

        // Comparar la contraseña
        if ( !bcryptjs.compareSync( password, user.password ) ) return null;        

        // Si la contraseña es correcta y el correo está verificado
        const { password: _, ...rest } = user;
        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
