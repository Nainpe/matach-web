import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const marca = searchParams.get('marca')?.split(',') || [];
    const precioMin = Number(searchParams.get('precioMin')) || 0;
    const precioMax = Number(searchParams.get('precioMax')) || 1000000;
    const categorySlug = searchParams.get('categorySlug');
    const searchTerm = searchParams.get('searchTerm') || '';

    // Validación inicial de parámetros numéricos
    if (isNaN(precioMin) || isNaN(precioMax)) {
      return NextResponse.json(
        { error: 'Parámetros de precio no válidos' },
        { status: 400 }
      );
    }

    let categoryIds: string[] = [];

    if (categorySlug) {
      try {
        const category = await prisma.category.findUnique({
          where: { slug: categorySlug },
          include: { subcategories: true },
        });

        if (!category) {
          return NextResponse.json(
            { error: 'Categoría no encontrada' },
            { status: 404 }
          );
        }

        categoryIds = [category.id, ...category.subcategories.map(sub => sub.id)];
      } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
          { error: 'Error al obtener categoría' },
          { status: 500 }
        );
      }
    }

    // Validación de marcas
    if (marca.length > 0) {
      try {
        const validBrands = await prisma.brand.findMany({
          where: { id: { in: marca } },
        });

        const invalidBrands = marca.filter(brandId => 
          !validBrands.some(b => b.id === brandId)
        );

        if (invalidBrands.length > 0) {
          return NextResponse.json(
            { 
              error: 'Marcas no válidas',
              invalidBrands,
              validBrands: validBrands.map(b => b.id)
            },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error validating brands:', error);
        return NextResponse.json(
          { error: 'Error al validar marcas' },
          { status: 500 }
        );
      }
    }

    try {
      const products = await prisma.product.findMany({
        where: {
          price: { gte: precioMin, lte: precioMax },
          ...(marca.length > 0 && { brandId: { in: marca } }),
          ...(categoryIds.length > 0 && { categoryId: { in: categoryIds } }),
          ...(searchTerm && {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
          })
        },
        include: { images: true },
      });

      return NextResponse.json(products);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Error al obtener productos' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}