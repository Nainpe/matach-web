import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface Producto {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string | null; // Permitimos que sea null
  images: { url: string }[];
  brandId: string;
  categoryId: string;
  tags: { tagId: string }[];
}

type Params = Promise<{ slug: string }>;


export async function GET(req: Request,{ params }: { params: Params }) {
  try {
    if (!(await params).slug) {
      return NextResponse.json({ error: 'Se requiere el slug' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const marca = searchParams.get('marca');
    const precioMin = searchParams.get('precioMin');
    const precioMax = searchParams.get('precioMax');

    const product = await prisma.product.findUnique({
      where: { slug: (await params).slug },
      include: {
        brand: true,
        category: true,
        images: true,
        specifications: true,
        tags: { include: { tag: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const sameBrandProducts: Producto[] = await prisma.product.findMany({
      where: {
        brandId: product.brandId,
        NOT: { id: product.id },
        AND: [
          marca ? { brand: { name: marca } } : {},
          precioMin ? { price: { gte: Number(precioMin) } } : {},
          precioMax ? { price: { lte: Number(precioMax) } } : {},
        ],
      },
      include: {
        images: true,
        tags: { include: { tag: true } },
      },
    });

    const differentBrandProducts: Producto[] = await prisma.product.findMany({
      where: {
        NOT: { id: product.id },
        brandId: { not: product.brandId },
        OR: [
          { categoryId: product.categoryId },
          {
            tags: {
              some: {
                tagId: {
                  in: product.tags.map((tag) => tag.tagId),
                },
              },
            },
          },
        ],
        AND: [
          marca ? { brand: { name: marca } } : {},
          precioMin ? { price: { gte: Number(precioMin) } } : {},
          precioMax ? { price: { lte: Number(precioMax) } } : {},
        ],
      },
      include: {
        images: true,
        tags: { include: { tag: true } },
      },
    });

    const relatedProductsSet = new Set<string>();
    const relatedProducts: Producto[] = [];

    sameBrandProducts.forEach((product) => {
      relatedProductsSet.add(product.id);
      relatedProducts.push(product);
    });

    differentBrandProducts.forEach((product) => {
      if (!relatedProductsSet.has(product.id)) {
        relatedProducts.push(product);
      }
    });

    return NextResponse.json({
      product: {
        ...product,
      },
      relatedProducts: relatedProducts.map((p) => ({
        ...p,
      })),
    });
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
