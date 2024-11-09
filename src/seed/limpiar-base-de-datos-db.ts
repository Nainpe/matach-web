import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limpiarBaseDeDatos() {
  try {
    // Primero, eliminamos los productos ya que tienen relaciones con Brand y Category
    const eliminarProductos = await prisma.product.deleteMany();
    console.log('Productos eliminados:', eliminarProductos.count);

    // Luego, eliminamos las categorías
    const eliminarCategorias = await prisma.category.deleteMany();
    console.log('Categorías eliminadas:', eliminarCategorias.count);

    // Finalmente, eliminamos las marcas
    const eliminarMarcas = await prisma.brand.deleteMany();
    console.log('Marcas eliminadas:', eliminarMarcas.count);

    console.log('La base de datos ha sido limpiada exitosamente.');
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarBaseDeDatos();