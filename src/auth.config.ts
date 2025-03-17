import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import prisma from "./lib/prisma";
import type { Role } from "@prisma/client";

type User = {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  image?: string | null;
  name?: string | null;
  dni: string;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
  address?: string; // Campo derivado de Address
  postalCode?: string; // Campo derivado de Address
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/registro",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },

    session({ session, token }) {
      const userData = token.data as User;
      session.user = {
        ...userData,
        createdAt: userData.createdAt.toISOString(),
      };
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

        // Buscar usuario con su dirección principal
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            addresses: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        });

        if (!user) return null;

        // Verificar si el correo está verificado
        if (!user.emailVerified) throw new Error("Email no verificado");

        // Comparar la contraseña
        if (!bcryptjs.compareSync(password, user.password)) return null;

        // Obtener dirección principal
        const primaryAddress = user.addresses[0];

        // Desestructuración con variables no usadas (ignorar warnings)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, addresses: _addresses, ...userData } = user;

        return {
          ...userData,
          address: primaryAddress?.street || "",
          postalCode: primaryAddress?.postalCode || "",
          createdAt: userData.createdAt.toISOString(),
          emailVerified: userData.emailVerified?.toISOString() || null,
        } as unknown as User;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);