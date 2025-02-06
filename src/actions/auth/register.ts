'use server';

import { randomBytes } from "crypto";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "./sendVerificationEmail";

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

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
        firstName,
        lastName,
        phoneNumber,
        dni,
        name: `${firstName} ${lastName}`,
        emailVerified: false, // Marca como no verificado
      },
      select: { id: true, name: true, email: true },
    });

    // Crear la dirección asociada al usuario
    await prisma.address.create({
      data: {
        userId: user.id, // Asocia la dirección al usuario
        street: address,
        locality,
        province,
        postalCode,
        isPrimary: true, // Marca como dirección principal
      },
    });

    // Crear token de verificación en la tabla `VerificationToken`
    await prisma.verificationToken.create({
      data: {
        identifier: user.email, // Usa el email como identificador
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