import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const marca = searchParams.get('marca')?.split(',') || [];
  const precioMin = Number(searchParams.get('precioMin')) || 0;
  const precioMax = Number(searchParams.get('precioMax')) || 1000000;
  const categorySlug = searchParams.get('categorySlug');
  const searchTerm = searchParams.get('searchTerm') || '';

  // Logs para depuración
  console.log('categorySlug:', categorySlug);
  console.log('marca:', marca);
  console.log('precioMin:', precioMin);
  console.log('precioMax:', precioMax);
  console.log('searchTerm:', searchTerm);
  
  let categoryIds: string[] = [];

  // Obtener IDs de categoría
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    categoryIds = [category.id, ...category.subcategories.map((sub: { id: string }) => sub.id)];
  }

  // Validación de precios
  if (isNaN(precioMin) || isNaN(precioMax)) {
    return NextResponse.json({ error: 'Precios no válidos' }, { status: 400 });
  }

  // Validación de marcas
  if (marca.length > 0) {
    const validBrands = await prisma.brand.findMany({
      where: { id: { in: marca } },
    });

    const invalidBrands = marca.filter(brandId => !validBrands.some(b => b.id === brandId));
    
    if (invalidBrands.length > 0) {
      return NextResponse.json({ error: 'Una o más marcas no son válidas', invalidBrands }, { status: 400 });
    }
  }

  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: precioMin,
        lte: precioMax,
      },
      ...(marca.length > 0 ? { brandId: { in: marca } } : {}), // Filtrar por marca
      ...(categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {}), // Filtrar por categoría
      ...(searchTerm ? { // Filtrar por el término de búsqueda
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: {
      images: true,
    },
  });

  console.log('Productos encontrados:', products.length); // Log de productos encontrados

  if (products.length === 0) {
    return NextResponse.json({ message: 'No se encontraron productos con los filtros aplicados' }, { status: 200 });
  }

  return NextResponse.json(products);
}
