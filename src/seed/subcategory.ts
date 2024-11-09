import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSubCategory() {
  const categoryId = 'cm12v1sxz00057fnsr543iua1'; // Reemplaza con un ID válido

  const parentCategory = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!parentCategory) {
    console.log('La categoría padre no existe.');
    return;
  }

  const subCategory = await prisma.category.create({
    data: {
      name: 'Procesadores',
      description: 'Subcategoría de procesadores',
      parentCategory: {
        connect: { id: categoryId },
      },
    },
  });

  console.log('Subcategoría creada:', subCategory);
}

createSubCategory()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
