import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Importa bcryptjs

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10); // Usa bcrypt para encriptar la contraseña

  // Crear usuario con rol de Admin
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '1234567890',
      address: '123 Admin St',
      postalCode: '12345',
      password: passwordHash,
      email: 'admin@example.com',
      role: Role.Admin,
    },
  });

  // Crear usuario con rol de User
  const regularUser = await prisma.user.create({
    data: {
      firstName: 'Regular',
      lastName: 'User',
      phoneNumber: '0987654321',
      address: '456 User St',
      postalCode: '67890',
      password: passwordHash,
      email: 'user@example.com',
      role: Role.User,
    },
  });

  console.log('Usuarios creados:', { adminUser, regularUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
