'use server';

import prisma from '@/lib/prisma';

interface Address {
  id: string;
  userId: string;
  street: string;
  locality: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  isPrimary: boolean;
  createdAt: Date;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addresses: Address[];
  dni: string;
  email: string;
  image?: string | null;
}

export async function fetchUserProfile(userId: string): Promise<UserProfileData> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      addresses: user.addresses,
      dni: user.dni,
      email: user.email,
      image: user.image,
    };
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw new Error('No se pudo obtener el perfil del usuario');
  }
}

export async function updateUserProfile(userId: string, userData: UserProfileData) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        dni: userData.dni,
        image: userData.image,
        addresses: {
          upsert: userData.addresses.map(address => ({
            where: { id: address.id },
            update: {
              street: address.street,
              locality: address.locality,
              province: address.province,
              postalCode: address.postalCode,
              country: address.country,
              phoneNumber: address.phoneNumber,
              isPrimary: address.isPrimary,
            },
            create: {
              street: address.street,
              locality: address.locality,
              province: address.province,
              postalCode: address.postalCode,
              country: address.country,
              phoneNumber: address.phoneNumber,
              isPrimary: address.isPrimary,
            },
          })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw new Error('No se pudo actualizar el perfil del usuario');
  }
}

