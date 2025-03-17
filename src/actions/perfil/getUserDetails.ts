'use server'

import { auth } from "../../auth.config"
import prisma from "../../lib/prisma"



export async function getUserData() {
  const session = await auth()
  
  if (!session || !session.user?.email) {
    throw new Error("No autorizado")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true, // Incluir todas las direcciones
    }
  })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    addresses: user.addresses.map(address => ({
      street: address.street,
      locality: address.locality || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      country: address.country || '',
    }))
  }
}
