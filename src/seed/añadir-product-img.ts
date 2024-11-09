import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addImagesToProduct(productId: string, imageUrls: string[]) {
    try {
      // Crear nuevas entradas de imágenes para el producto
      await prisma.productImage.createMany({
        data: imageUrls.map(url => ({
          productId,
          url
        }))
      });
  
      console.log('Imágenes añadidas al producto con ID:', productId);
    } catch (error) {
      console.error('Error al añadir imágenes al producto:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  

// Usa la función con el ID del producto y URLs de imágenes
addImagesToProduct('cm1cyjg7u0005b2a81zertms4', [
  'https://matach-productos.s3.sa-east-1.amazonaws.com/IRONCLAW_RGB_WIRELESS_01.webp'
]);
