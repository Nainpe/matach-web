'use server';

import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "./sendVerificationEmail";
import prisma from "../../lib/prisma";

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
  const tokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // Expira en 1 día

  try {
    // Verificar si el correo electrónico ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { ok: false, message: "El correo electrónico ya está registrado." };
    }

    // Crear usuario (corregido el campo emailVerified)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
        firstName,
        lastName,
        phoneNumber,
        dni,
        name: `${firstName} ${lastName}`,
        emailVerified: null, // Ahora es DateTime nullable
      },
      select: { id: true, name: true, email: true },
    });

    // Crear la dirección asociada al usuario
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

    // Crear token de verificación
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    // Enviar correo de verificación
    await sendVerificationEmail(user.email, verificationToken);

    return { ok: true, user };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Ocurrió un error durante el registro." };
  }
};