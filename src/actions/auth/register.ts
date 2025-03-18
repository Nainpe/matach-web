'use server';

import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "./sendVerificationEmail";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dni: string,
  phoneNumber: string,
  address: string,
  locality: string,
  province: string,
  postalCode: string
) => {
  const verificationToken = randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  // Validaciones
  const dniRegex = /^\d{8}[A-Za-z]$/;
  if (!dniRegex.test(dni)) {
    return { ok: false, message: "Formato de DNI inválido" };
  }

  if (phoneNumber.length < 9) {
    return { ok: false, message: "Número de teléfono debe tener al menos 9 dígitos" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { ok: false, message: "El correo electrónico ya está registrado." };
    }

    // Transacción
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: bcryptjs.hashSync(password),
          firstName,
          lastName,
          phoneNumber,
          dni,
          name: `${firstName} ${lastName}`,
          emailVerified: null,
        },
        select: { id: true, name: true, email: true },
      });

      await prisma.address.create({
        data: {
          userId: user.id,
          street: address,
          locality,
          province,
          postalCode,
          isPrimary: true,
        },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires: tokenExpires,
        },
      });

      return user;
    });

    // Envío de email con manejo de errores
    try {
      await sendVerificationEmail(result.email, verificationToken);
    } catch (error) {
      await prisma.user.delete({ where: { id: result.id } });
      return { 
        ok: false, 
        message: "Error enviando email de verificación" 
      };
    }

    return { ok: true, user: result };

  } catch (error: unknown) {
    // Manejo de errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        return { 
          ok: false, 
          message: field 
            ? `El ${field} ya está registrado` 
            : "Registro duplicado" 
        };
      }
    }
    
    // Error genérico
    return { 
      ok: false, 
      message: error instanceof Error 
        ? error.message 
        : "Error durante el registro" 
    };
  }
};