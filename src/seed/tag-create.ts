import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear múltiples tags
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Memoria RAM' },
      { name: 'Hardware' },

    ],
    skipDuplicates: true, // Opcional: Evita la creación de duplicados si el tag ya existe
  });

  console.log('Tags creados:', tags);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
